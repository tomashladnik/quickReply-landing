export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherAuth } from "@/lib/teacher-auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ classId: string }> }
) {
  const auth = await requireTeacherAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const { classId } = await context.params;

    const classRecord = await prisma.schoolClass.findFirst({
      where: {
        id: classId,
        teacherId: auth.teacher.id,
      },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

const students = classRecord.enrollments.map((e) => ({
  id: e.student?.id ?? e.id,
  name: e.student
    ? `${e.student.firstName} ${e.student.lastName}`.trim()
    : "Unknown Student",
  consent: e.consent,
  scanStatus: e.scanStatus,
}));


    return NextResponse.json({
      class: {
        id: classRecord.id,
        name: classRecord.name,
        grade: classRecord.grade,
      },
      students,
    });
  } catch (err) {
    console.error("[TEACHER_ROSTER] error", err);
    return NextResponse.json(
      { error: "Failed to load roster" },
      { status: 500 }
    );
  }
}
