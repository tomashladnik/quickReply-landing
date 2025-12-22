// src/app/api/teacher/classes/[classId]/participation/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeacherAuth } from "@/lib/teacher-auth";

function escapeCsv(value: string): string {
  if (value.includes('"')) {
    value = value.replace(/"/g, '""');
  }
  if (/[",\n]/.test(value)) {
    return `"${value}"`;
  }
  return value;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ classId: string }> }
) {
  const auth = await requireTeacherAuth(req);
  if ("error" in auth) return auth.error;

  try {
    const { classId } = await context.params;

    const classRecord = await prisma.schoolClass.findFirst({
      where: { id: classId, teacherId: auth.teacher.id },
      include: {
        enrollments: {
          include: { student: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const header = ["Student Name", "Parent Consent", "Scan Status"];
    const rows = classRecord.enrollments.map((enrollment) => {
      const name = `${enrollment.student.firstName} ${enrollment.student.lastName}`.trim();
      const consent = enrollment.consent ? "Yes" : "No";
      const scanStatus =
        enrollment.scanStatus === "completed" ? "Completed" : "Not Completed";
      return [name, consent, scanStatus];
    });

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const filename = `class_participation_${classRecord.id}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[TEACHER_PARTICIPATION] error", err);
    return NextResponse.json(
      { error: "Failed to export participation" },
      { status: 500 }
    );
  }
}
