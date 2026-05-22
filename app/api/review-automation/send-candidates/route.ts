import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { cleanClientSlug, getReviewSendCandidates } from "@/lib/review-send-candidates";

export async function GET(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const searchParams = req.nextUrl.searchParams;
  const clientSlug = cleanClientSlug(searchParams.get("client"));
  const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit") ?? 300)));

  const result = await getReviewSendCandidates({ clientSlug, limit });
  if (!result.ok) {
    const { status, ...body } = result;
    return NextResponse.json(body, { status });
  }

  return NextResponse.json({
    ok: true,
    storageConfigured: true,
    clientSlug: result.clientSlug,
    clientName: result.clientName,
    sourceUploadAt: result.sourceUploadAt,
    totalCandidates: result.totalCandidates,
    candidates: result.candidates,
  });
}
