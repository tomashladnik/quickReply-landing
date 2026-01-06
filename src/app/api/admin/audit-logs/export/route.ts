// src/app/api/admin/audit-logs/export/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 1000;

function parseLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 500;
  }
  return Math.min(parsed, MAX_LIMIT);
}

function buildWhere(searchParams: URLSearchParams) {
  const where: Record<string, string | undefined> = {
    schoolId: searchParams.get("schoolId") ?? undefined,
    classId: searchParams.get("classId") ?? undefined,
    studentId: searchParams.get("studentId") ?? undefined,
    actorId: searchParams.get("actorId") ?? undefined,
    actorType: searchParams.get("actorType") ?? undefined,
    action: searchParams.get("action") ?? undefined,
    resourceType: searchParams.get("resourceType") ?? undefined,
    resourceId: searchParams.get("resourceId") ?? undefined,
  };

  return Object.fromEntries(
    Object.entries(where).filter(([, value]) => value !== undefined)
  );
}

function toCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  if (/[",\r\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") ?? "json").toLowerCase();
    const limit = parseLimit(searchParams.get("limit"));
    const where = buildWhere(searchParams);

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (format === "csv") {
      const headers = [
        "id",
        "createdAt",
        "action",
        "actorType",
        "actorId",
        "schoolId",
        "classId",
        "studentId",
        "resourceType",
        "resourceId",
        "ipAddress",
        "userAgent",
        "metadata",
      ];

      const rows = logs.map((log) =>
        [
          log.id,
          log.createdAt.toISOString(),
          log.action,
          log.actorType,
          log.actorId,
          log.schoolId,
          log.classId,
          log.studentId,
          log.resourceType,
          log.resourceId,
          log.ipAddress,
          log.userAgent,
          log.metadata ? JSON.stringify(log.metadata) : null,
        ]
          .map(toCsvValue)
          .join(",")
      );

      const csv = [headers.join(","), ...rows].join("\r\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=\"audit-logs.csv\"",
        },
      });
    }

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("[ADMIN_AUDIT_LOGS_EXPORT] error", err);
    return NextResponse.json(
      { error: "Failed to export audit logs" },
      { status: 500 }
    );
  }
}
