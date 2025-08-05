import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectModel from "@/lib/models/Project";
import RateRuleModel from "@/lib/models/RateRule";
import TimeEntryModel from "@/lib/models/TimeEntry";
import dbConnect from "@/lib/mongodb";

async function calculateAppliedRate(
  projectId: string,
  userId: string,
  weekStart: Date,
  weekEnd: Date,
) {
  const project = await ProjectModel.findById(projectId);
  if (!project) return 0;

  const rateRule = await RateRuleModel.findOne({
    projectId,
    userId,
    isActive: true,
  }).sort({ createdAt: -1 });

  if (!rateRule) return project.defaultRate;

  const weeklyHours = await TimeEntryModel.aggregate([
    {
      $match: {
        projectId,
        userId,
        startTime: { $gte: weekStart, $lte: weekEnd },
      },
    },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: "$duration" },
      },
    },
  ]);

  const totalWeeklySeconds = weeklyHours[0]?.totalDuration || 0;
  const totalWeeklyHours = totalWeeklySeconds / 3600;

  for (const condition of rateRule.conditions.sort(
    (a, b) => b.weeklyHoursThreshold - a.weeklyHoursThreshold,
  )) {
    if (totalWeeklyHours >= condition.weeklyHoursThreshold) {
      return condition.newRate;
    }
  }

  return rateRule.baseRate;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get("organisationId");
    const projectId = searchParams.get("projectId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const isPersonal = !organisationId;

    const query: {
      userId: string;
      isPersonal: boolean;
      organisationId?: string;
      projectId?: string;
    } = {
      userId: session.user.id,
      isPersonal,
    };

    if (organisationId) query.organisationId = organisationId;
    if (projectId) query.projectId = projectId;

    const timeEntries = await TimeEntryModel.find(query)
      .populate("projectId", "name colour")
      .populate("clientId", "name colour")
      .sort({ startTime: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await TimeEntryModel.countDocuments(query);

    return NextResponse.json({
      timeEntries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      description,
      startTime,
      endTime,
      duration,
      projectId,
      clientId,
      organisationId,
    } = body;

    if (
      !description ||
      !startTime ||
      (!endTime && !duration) ||
      !projectId ||
      !clientId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const start = new Date(startTime);
    const end = endTime
      ? new Date(endTime)
      : new Date(start.getTime() + duration * 1000);
    const calculatedDuration =
      duration || Math.floor((end.getTime() - start.getTime()) / 1000);

    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - start.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const appliedRate = await calculateAppliedRate(
      projectId,
      session.user.id,
      weekStart,
      weekEnd,
    );

    const timeEntry = await TimeEntryModel.create({
      description,
      startTime: start,
      endTime: end,
      duration: calculatedDuration,
      projectId,
      clientId,
      appliedRate,
      isPersonal: !organisationId,
      organisationId: organisationId || null,
      userId: session.user.id,
    });

    const populatedEntry = await TimeEntryModel.findById(timeEntry._id)
      .populate("projectId", "name colour")
      .populate("clientId", "name colour");

    return NextResponse.json(populatedEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
