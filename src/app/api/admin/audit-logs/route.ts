// src/app/api/admin/audit-logs/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_LIMIT = 200;

function parseLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 50;
  }
  return Math.min(parsed, MAX_LIMIT);
}

function parseCursor(value: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return date;
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseLimit(searchParams.get("limit"));
    const cursor = parseCursor(searchParams.get("cursor"));
    const where = buildWhere(searchParams);

    const logs = await prisma.auditLog.findMany({
      where: {
        ...where,
        ...(cursor ? { createdAt: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const nextCursor =
      logs.length > 0 ? logs[logs.length - 1].createdAt.toISOString() : null;

    return NextResponse.json({
      logs,
      nextCursor,
    });
  } catch (err) {
    console.error("[ADMIN_AUDIT_LOGS_GET] error", err);
    return NextResponse.json(
      { error: "Failed to load audit logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = String(body.action ?? "").trim();
    const actorType = body.actorType ? String(body.actorType).trim() : null;

    if (!action) {
      return NextResponse.json(
        { error: "action is required" },
        { status: 400 }
      );
    }

    const ipAddress =
      body.ipAddress ??
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      null;

    const userAgent = body.userAgent ?? req.headers.get("user-agent") ?? null;

    const log = await prisma.auditLog.create({
      data: {
        action,
        actorId: body.actorId ?? null,
        actorType,
        schoolId: body.schoolId ?? null,
        classId: body.classId ?? null,
        studentId: body.studentId ?? null,
        resourceType: body.resourceType ?? null,
        resourceId: body.resourceId ?? null,
        ipAddress,
        userAgent,
        metadata: body.metadata ?? null,
      },
    });

    return NextResponse.json({ ok: true, log }, { status: 201 });
  } catch (err) {
    console.error("[ADMIN_AUDIT_LOGS_POST] error", err);
    return NextResponse.json(
      { error: "Failed to create audit log" },
      { status: 500 }
    );
  }
}
