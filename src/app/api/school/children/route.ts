import { NextResponse } from "next/server";
import { mockChildren } from "../mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentEmail = searchParams.get("parentEmail") || "parent@example.com";

  const children = mockChildren.filter(
    (child) => child.parentEmail === parentEmail
  );

  return NextResponse.json({ children });
}


