import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectModel from "@/lib/models/Project";
import dbConnect from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get("organisationId");
    const clientId = searchParams.get("clientId");
    const isPersonal = !organisationId;

    const query: {
      userId: string;
      isPersonal: boolean;
      archived: boolean;
      organisationId?: string;
      clientId?: string;
    } = {
      userId: session.user.id,
      isPersonal,
      archived: false,
    };

    if (organisationId) query.organisationId = organisationId;
    if (clientId) query.clientId = clientId;

    const projects = await ProjectModel.find(query)
      .populate("clientId", "name colour")
      .sort({ name: 1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
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
    const { name, clientId, category, colour, defaultRate, organisationId } =
      body;

    if (!name || !clientId) {
      return NextResponse.json(
        { error: "Name and client are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const project = await ProjectModel.create({
      name,
      clientId,
      category,
      colour: colour || "#10B981",
      defaultRate: defaultRate || 0,
      isPersonal: !organisationId,
      organisationId: organisationId || null,
      userId: session.user.id,
    });

    const populatedProject = await ProjectModel.findById(project._id).populate(
      "clientId",
      "name colour",
    );

    return NextResponse.json(populatedProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
