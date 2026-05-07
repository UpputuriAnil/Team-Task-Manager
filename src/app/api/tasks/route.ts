import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, projectId, assignedToId } = await req.json();

    if (!title || !projectId) {
      return new NextResponse("Title and Project ID are required", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedToId: assignedToId || null,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    let whereClause: any = {};
    
    if (projectId) {
      whereClause.projectId = projectId;
    }

    if (session.user.role !== "ADMIN") {
      whereClause.assignedToId = session.user.id;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: true,
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
