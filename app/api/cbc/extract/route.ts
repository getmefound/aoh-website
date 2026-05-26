import { NextResponse } from "next/server";
import { hasCbcSession } from "@/lib/cbc-auth";
import cbcExtraction from "../../../../.cbc/mark-egidio-extraction.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!(await hasCbcSession())) return cbcUnauthorized();
  await request.json().catch(() => null);
  return NextResponse.json(cbcExtraction);
}

export async function GET() {
  if (!(await hasCbcSession())) return cbcUnauthorized();
  return NextResponse.json(cbcExtraction);
}

function cbcUnauthorized() {
  return NextResponse.json({ ok: false, error: "CBC access required." }, { status: 401 });
}
