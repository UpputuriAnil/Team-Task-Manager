import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Register Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
