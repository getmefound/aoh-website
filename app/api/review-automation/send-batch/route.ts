import { NextRequest, NextResponse } from "next/server";
import { authorizeInternalRequest } from "@/lib/internal-api-auth";
import { buildSendLogPacket, postReviewAutomationSlackSummary } from "@/lib/review-automation";
import { buildReviewRequestEmail, sendReviewRequestEmail } from "@/lib/review-request-email";
import { cleanClientSlug, getReviewSendCandidates } from "@/lib/review-send-candidates";
import { saveReviewAutomationEvent } from "@/lib/review-automation-store";

type SendBatchBody = {
  clientSlug?: unknown;
  limit?: unknown;
  commit?: unknown;
  confirm?: unknown;
};

const MAX_BATCH_SIZE = 25;
const DEFAULT_BATCH_SIZE = 5;
const CONFIRM_TEXT = "SEND_REVIEW_REQUESTS";

export async function POST(req: NextRequest) {
  const auth = authorizeInternalRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const body = (await req.json().catch(() => null)) as SendBatchBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const clientSlug = cleanClientSlug(body.clientSlug);
  const limit = clampBatchLimit(body.limit);
  const commit = body.commit === true;
  const result = await getReviewSendCandidates({ clientSlug, limit: 500 });

  if (!result.ok) {
    const { status, ...payload } = result;
    return NextResponse.json(payload, { status });
  }

  const batch = result.candidates.slice(0, limit);
  const emails = batch.map((candidate) =>
    buildReviewRequestEmail({
      clientSlug: result.clientSlug,
      clientName: result.clientName,
      candidate,
    }),
  );

  if (!commit) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      clientSlug: result.clientSlug,
      clientName: result.clientName,
      sourceUploadAt: result.sourceUploadAt,
      totalCandidates: result.totalCandidates,
      batchSize: emails.length,
      previews: emails.map((email) => ({
        to: email.to,
        subject: email.subject,
        feedbackUrl: email.feedbackUrl,
        unsubscribeUrl: email.unsubscribeUrl,
      })),
      nextStep: `POST again with commit=true and confirm=${CONFIRM_TEXT} after proof check approval.`,
    });
  }

  if (body.confirm !== CONFIRM_TEXT) {
    return NextResponse.json(
      {
        ok: false,
        error: `Live sends require confirm=${CONFIRM_TEXT}.`,
      },
      { status: 409 },
    );
  }

  const sent = [];
  const failed = [];

  for (const email of emails) {
    const sendResult = await sendReviewRequestEmail(email);
    const packet = buildSendLogPacket({
      clientSlug: result.clientSlug,
      customerEmail: email.to,
      status: sendResult.ok ? "sent" : "failed",
      provider: sendResult.provider,
      messageId: sendResult.ok ? sendResult.messageId : "",
      detail: sendResult.ok ? `Review request sent to ${email.feedbackUrl}` : sendResult.error,
    });
    const storageResult = await saveReviewAutomationEvent("send_log", packet);

    if (sendResult.ok) {
      sent.push({ to: email.to, provider: sendResult.provider, messageId: sendResult.messageId });
    } else {
      failed.push({ to: email.to, provider: sendResult.provider, error: sendResult.error });
      await postReviewAutomationSlackSummary("send_log", packet, {
        ok: storageResult.ok,
        configured: storageResult.configured,
        error: storageResult.ok ? undefined : storageResult.error,
      });
    }
  }

  return NextResponse.json({
    ok: failed.length === 0,
    dryRun: false,
    clientSlug: result.clientSlug,
    clientName: result.clientName,
    sourceUploadAt: result.sourceUploadAt,
    requested: emails.length,
    sent: sent.length,
    failed: failed.length,
    sentProof: sent,
    failures: failed,
  });
}

function clampBatchLimit(value: unknown) {
  const parsed = Number(value ?? DEFAULT_BATCH_SIZE);
  if (!Number.isFinite(parsed)) return DEFAULT_BATCH_SIZE;
  return Math.min(MAX_BATCH_SIZE, Math.max(1, Math.floor(parsed)));
}
