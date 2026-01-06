// src/app/api/admin/consent-status/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId") ?? undefined;
    const classId = searchParams.get("classId") ?? undefined;
    const includeStudents = searchParams.get("includeStudents") === "true";
    const groupByClass = searchParams.get("groupByClass") === "true";

    const enrollmentWhere: Record<string, string> = {};
    if (classId) {
      enrollmentWhere.classId = classId;
    }

    const baseWhere = schoolId
      ? {
          class: {
            schoolId,
          },
        }
      : {};

    const where = {
      ...baseWhere,
      ...enrollmentWhere,
    };

    const consentGroups = await prisma.classEnrollment.groupBy({
      by: ["consent"],
      where,
      _count: { _all: true },
    });

    const totals = consentGroups.reduce(
      (acc, group) => {
        if (group.consent) {
          acc.consentYes = group._count._all;
        } else {
          acc.consentNo = group._count._all;
        }
        acc.total += group._count._all;
        return acc;
      },
      { consentYes: 0, consentNo: 0, total: 0 }
    );

    let classBreakdown: Array<{
      classId: string;
      consentYes: number;
      consentNo: number;
      total: number;
    }> = [];

    if (groupByClass && schoolId && !classId) {
      const classGroups = await prisma.classEnrollment.groupBy({
        by: ["classId", "consent"],
        where: baseWhere,
        _count: { _all: true },
      });

      const map = new Map<
        string,
        { classId: string; consentYes: number; consentNo: number; total: number }
      >();

      for (const group of classGroups) {
        const entry = map.get(group.classId) ?? {
          classId: group.classId,
          consentYes: 0,
          consentNo: 0,
          total: 0,
        };
        if (group.consent) {
          entry.consentYes = group._count._all;
        } else {
          entry.consentNo = group._count._all;
        }
        entry.total += group._count._all;
        map.set(group.classId, entry);
      }

      classBreakdown = Array.from(map.values());
    }

    let students:
      | Array<{
          enrollmentId: string;
          studentId: string;
          firstName: string;
          lastName: string;
          consent: boolean;
        }>
      | undefined;

    if (includeStudents && classId) {
      const enrollments = await prisma.classEnrollment.findMany({
        where: {
          classId,
        },
        include: {
          student: true,
        },
        orderBy: { createdAt: "desc" },
      });

      students = enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        firstName: enrollment.student.firstName,
        lastName: enrollment.student.lastName,
        consent: enrollment.consent,
      }));
    }

    return NextResponse.json({
      schoolId: schoolId ?? null,
      classId: classId ?? null,
      totals,
      classBreakdown,
      students,
    });
  } catch (err) {
    console.error("[ADMIN_CONSENT_STATUS] error", err);
    return NextResponse.json(
      { error: "Failed to load consent status" },
      { status: 500 }
    );
  }
}
