import { NextResponse } from "next/server";
import { mockHistory, mockChildren } from "../../mock-data";

interface Params {
  params: { childId: string };
}

export async function GET(_: Request, { params }: Params) {
  const childExists = mockChildren.some((c) => c.id === params.childId);
  if (!childExists) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  const history = mockHistory[params.childId] ?? [];
  return NextResponse.json({ history });
}


