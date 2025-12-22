// src/app/api/teacher/classes/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherAuth } from "@/lib/teacher-auth";

export async function GET(req: NextRequest) {
  const auth = await requireTeacherAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const classes = await prisma.schoolClass.findMany({
      where: { teacherId: auth.teacher.id },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, grade: true, schoolId: true },
    });

    return NextResponse.json({ classes });
  } catch (err) {
    console.error("[TEACHER_CLASSES] error", err);
    return NextResponse.json(
      { error: "Failed to load classes" },
      { status: 500 }
    );
  }
}
