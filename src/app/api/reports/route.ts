import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TimeEntryModel from "@/lib/models/TimeEntry";
import dbConnect from "@/lib/mongodb";

function getDateRange(range: string, customStart?: string, customEnd?: string) {
  const now = new Date();
  let start: Date;
  let end: Date = new Date(now);

  switch (range) {
    case "today":
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "week":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "custom":
      if (!customStart || !customEnd) {
        throw new Error("Custom range requires start and end dates");
      }
      start = new Date(customStart);
      end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid date range");
  }

  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get("organisationId");
    const projectId = searchParams.get("projectId");
    const clientId = searchParams.get("clientId");
    const dateRange = searchParams.get("dateRange") || "week";
    const customStart = searchParams.get("customStart");
    const customEnd = searchParams.get("customEnd");
    const groupBy = searchParams.get("groupBy") || "project";
    const isPersonal = !organisationId;

    const { start, end } = getDateRange(dateRange, customStart, customEnd);

    const baseQuery: any = {
      userId: session.user.id,
      isPersonal,
      startTime: { $gte: start, $lte: end },
    };

    if (organisationId) baseQuery.organisationId = organisationId;
    if (projectId) baseQuery.projectId = projectId;
    if (clientId) baseQuery.clientId = clientId;

    // Get summary statistics
    const summaryPipeline = [
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: "$duration" },
          totalEarnings: { $sum: { $multiply: ["$duration", "$appliedRate"] } },
          entryCount: { $sum: 1 },
          avgRate: { $avg: "$appliedRate" },
        },
      },
    ];

    const summaryResult = await TimeEntryModel.aggregate(summaryPipeline);
    const summary = summaryResult[0] || {
      totalDuration: 0,
      totalEarnings: 0,
      entryCount: 0,
      avgRate: 0,
    };

    const totalHours = Math.floor(summary.totalDuration / 3600);
    const totalMinutes = Math.floor((summary.totalDuration % 3600) / 60);
    const totalEarnings = summary.totalEarnings / 3600; // Convert from per-second to per-hour

    // Get breakdown by grouping
    let groupField: string;
    let populateFields: string;

    switch (groupBy) {
      case "client":
        groupField = "$clientId";
        populateFields = "name colour";
        break;
      case "day":
        groupField = { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } };
        populateFields = "";
        break;
      default: // project
        groupField = "$projectId";
        populateFields = "name colour";
    }

    const breakdownPipeline = [
      { $match: baseQuery },
      {
        $group: {
          _id: groupField,
          totalDuration: { $sum: "$duration" },
          totalEarnings: { $sum: { $multiply: ["$duration", "$appliedRate"] } },
          avgRate: { $avg: "$appliedRate" },
          entryCount: { $sum: 1 },
        },
      },
      { $sort: { totalDuration: -1 } },
    ];

    let breakdownResult = await TimeEntryModel.aggregate(breakdownPipeline);

    // Populate references for project and client groupings
    if (groupBy === "project" || groupBy === "client") {
      const model = groupBy === "project" ? "Project" : "Client";
      breakdownResult = await TimeEntryModel.populate(breakdownResult, {
        path: "_id",
        model,
        select: populateFields,
      });
    }

    // Format breakdown data
    const breakdown = breakdownResult.map((item) => {
      const hours = Math.floor(item.totalDuration / 3600);
      const minutes = Math.floor((item.totalDuration % 3600) / 60);
      const earnings = item.totalEarnings / 3600;

      return {
        id: item._id?._id || item._id,
        name: item._id?.name || item._id,
        colour: item._id?.colour || null,
        duration: item.totalDuration,
        formattedDuration: `${hours}h ${minutes}m`,
        earnings: parseFloat(earnings.toFixed(2)),
        avgRate: parseFloat(item.avgRate.toFixed(2)),
        entryCount: item.entryCount,
        percentage: summary.totalDuration > 0 
          ? parseFloat(((item.totalDuration / summary.totalDuration) * 100).toFixed(1))
          : 0,
      };
    });

    return NextResponse.json({
      summary: {
        totalDuration: summary.totalDuration,
        formattedTotalTime: `${totalHours}h ${totalMinutes}m`,
        billableTime: `${totalHours}h ${totalMinutes}m`, // Assuming all time is billable for now
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        avgRate: parseFloat(summary.avgRate.toFixed(2)),
        entryCount: summary.entryCount,
      },
      breakdown,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
        range: dateRange,
      },
      groupBy,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}