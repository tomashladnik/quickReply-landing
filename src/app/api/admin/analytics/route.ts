// src/app/api/admin/analytics/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildEnrollmentWhere(schoolId?: string | null) {
  if (!schoolId) {
    return {};
  }

  return {
    class: {
      schoolId,
    },
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    const enrollmentWhere = buildEnrollmentWhere(schoolId);
    const classWhere = schoolId ? { schoolId } : {};

    const [
      totalEnrollments,
      uniqueStudents,
      totalClasses,
      scanStatusGroups,
    ] = await Promise.all([
      prisma.classEnrollment.count({ where: enrollmentWhere }),
      prisma.classEnrollment.count({
        where: enrollmentWhere,
        distinct: ["studentId"],
      }),
      prisma.schoolClass.count({ where: classWhere }),
      prisma.classEnrollment.groupBy({
        by: ["scanStatus"],
        where: enrollmentWhere,
        _count: { _all: true },
      }),
    ]);

    const scanStatusCounts = scanStatusGroups.reduce<Record<string, number>>(
      (acc, group) => {
        acc[group.scanStatus] = group._count._all;
        return acc;
      },
      {}
    );

    const completedScans = scanStatusCounts.completed ?? 0;
    const participationRate =
      totalEnrollments > 0 ? completedScans / totalEnrollments : 0;

    return NextResponse.json({
      schoolId: schoolId ?? null,
      totals: {
        enrollments: totalEnrollments,
        uniqueStudents,
        classes: totalClasses,
      },
      scans: scanStatusCounts,
      participationRate,
    });
  } catch (err) {
    console.error("[ADMIN_ANALYTICS] error", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
