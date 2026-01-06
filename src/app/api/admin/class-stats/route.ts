// src/app/api/admin/class-stats/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ScanStatusCounts = Record<string, number>;

function mapScanStatusGroups(
  groups: Array<{ classId: string; scanStatus: string; _count: { _all: number } }>
) {
  const map = new Map<string, ScanStatusCounts>();

  for (const group of groups) {
    const entry = map.get(group.classId) ?? {};
    entry[group.scanStatus] = group._count._all;
    map.set(group.classId, entry);
  }

  return map;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId") ?? undefined;
    const classId = searchParams.get("classId") ?? undefined;

    const classWhere: Record<string, string> = {};
    if (schoolId) {
      classWhere.schoolId = schoolId;
    }
    if (classId) {
      classWhere.id = classId;
    }

    const classes = await prisma.schoolClass.findMany({
      where: classWhere,
      select: {
        id: true,
        name: true,
        grade: true,
        schoolId: true,
        createdAt: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!classes.length) {
      return NextResponse.json({ classes: [] });
    }

    const classIds = classes.map((item) => item.id);
    const scanStatusGroups = await prisma.classEnrollment.groupBy({
      by: ["classId", "scanStatus"],
      where: {
        classId: {
          in: classIds,
        },
      },
      _count: { _all: true },
    });

    const scanStatusMap = mapScanStatusGroups(scanStatusGroups);

    const payload = classes.map((item) => {
      const scanCounts = scanStatusMap.get(item.id) ?? {};
      const totalEnrollments = item._count.enrollments;
      const completed = scanCounts.completed ?? 0;
      const notCompleted = scanCounts.not_completed ?? 0;
      const otherStatuses = Object.keys(scanCounts).reduce((acc, status) => {
        if (status !== "completed" && status !== "not_completed") {
          acc[status] = scanCounts[status] ?? 0;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        id: item.id,
        name: item.name,
        grade: item.grade,
        schoolId: item.schoolId,
        teacher: item.teacher,
        totals: {
          enrollments: totalEnrollments,
          scanned: completed,
          notScanned: notCompleted,
        },
        participationRate:
          totalEnrollments > 0 ? completed / totalEnrollments : 0,
        otherStatuses,
      };
    });

    return NextResponse.json({ classes: payload });
  } catch (err) {
    console.error("[ADMIN_CLASS_STATS] error", err);
    return NextResponse.json(
      { error: "Failed to load class stats" },
      { status: 500 }
    );
  }
}
