// src/app/api/teacher/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  issueTeacherToken,
  verifyPassword,
  TeacherTokenPayload,
} from "@/lib/teacher-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, schoolId: true, passwordHash: true },
    });

    if (!teacher || !verifyPassword(password, teacher.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const payload: TeacherTokenPayload = {
      teacherId: teacher.id,
      schoolId: teacher.schoolId,
      email: teacher.email,
    };

    const token = issueTeacherToken(payload);

    return NextResponse.json({
      token,
      teacher: {
        id: teacher.id,
        email: teacher.email,
        name: teacher.name,
        schoolId: teacher.schoolId,
      },
    });
  } catch (err) {
    console.error("[TEACHER_LOGIN] error", err);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
