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

    const { name, description, deadline } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        adminId: session.user.id,
      },
    });

    return NextResponse.json(project);
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

    // Admins see all projects for task creation, members see projects they have tasks in
    if (session.user.role === "ADMIN") {
      const projects = await prisma.project.findMany({
        include: {
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(projects);
    } else {
      const projects = await prisma.project.findMany({
        where: {
          tasks: {
            some: { assignedToId: session.user.id }
          }
        },
        include: {
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(projects);
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
