// src/lib/teacher-auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TEACHER_JWT_SECRET = process.env.TEACHER_JWT_SECRET || "teacher-secret";
const PBKDF2_ITERATIONS = Number.parseInt(
  process.env.TEACHER_PBKDF2_ITERATIONS || "100000",
  10
);
const PBKDF2_KEYLEN = 32;
const PBKDF2_DIGEST = "sha256";

export type TeacherTokenPayload = {
  teacherId: string;
  schoolId: string;
  email: string;
};

export function createPasswordHash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4) return false;

  const [, iterationsRaw, salt, storedHash] = parts;
  const iterations = Number.parseInt(iterationsRaw, 10);
  if (!Number.isFinite(iterations)) return false;

  const computed = crypto
    .pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");

  const storedBuffer = Buffer.from(storedHash, "hex");
  const computedBuffer = Buffer.from(computed, "hex");
  if (storedBuffer.length !== computedBuffer.length) return false;

  return crypto.timingSafeEqual(storedBuffer, computedBuffer);
}

export function issueTeacherToken(payload: TeacherTokenPayload): string {
  const expiresIn = process.env.TEACHER_JWT_EXPIRES_IN || "12h";
  return jwt.sign(payload, TEACHER_JWT_SECRET, { expiresIn });
}

function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

export async function requireTeacherAuth(
  req: NextRequest
): Promise<
  | { teacher: { id: string; email: string; schoolId: string }; payload: TeacherTokenPayload }
  | { error: Response }
> {
  const token = getBearerToken(req);
  if (!token) {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  let payload: TeacherTokenPayload;
  try {
    payload = jwt.verify(token, TEACHER_JWT_SECRET) as TeacherTokenPayload;
  } catch {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: payload.teacherId },
    select: { id: true, email: true, schoolId: true },
  });

  if (!teacher) {
    return { error: new Response("Unauthorized", { status: 401 }) };
  }

  return { teacher, payload };
}
