import { NextResponse } from "next/server";
import { getChildById } from "../../mock-data";

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const child = getChildById(params.id);
  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  return NextResponse.json({ child });
}


