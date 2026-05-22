import { getClientHub } from "@/lib/client-hub";
import type { ReviewCustomerPacket, ReviewSendLogPacket } from "@/lib/review-automation";
import { listReviewAutomationRecords } from "@/lib/review-automation-store";

export type ReviewSendCandidate = {
  name: string;
  email: string;
  phone: string;
  jobDate: string;
  notes: string;
};

export type ReviewSendCandidateResult =
  | {
      ok: true;
      clientSlug: string;
      clientName: string;
      googleReviewUrl: string;
      sourceUploadAt: string;
      totalCandidates: number;
      candidates: ReviewSendCandidate[];
    }
  | { ok: false; status: number; storageConfigured?: boolean; blocked?: boolean; blocker?: string; error: string };

export async function getReviewSendCandidates(input: {
  clientSlug: string;
  limit?: number;
}): Promise<ReviewSendCandidateResult> {
  const clientSlug = cleanClientSlug(input.clientSlug);
  const limit = Math.min(500, Math.max(1, Math.floor(input.limit ?? 300)));
  if (!clientSlug) {
    return { ok: false, status: 400, error: "Missing client." };
  }

  const client = getClientHub(clientSlug);
  if (!client) {
    return { ok: false, status: 404, error: "Unknown client." };
  }
  if (!client.googleReviewUrl) {
    return {
      ok: false,
      status: 409,
      blocked: true,
      blocker: "google_review_link_missing",
      error: "Add the verified Google review link before building a send batch.",
    };
  }

  const result = await listReviewAutomationRecords({ clientSlug, limit });
  if (!result.ok) {
    return {
      ok: false,
      status: result.configured ? 502 : 503,
      storageConfigured: result.configured,
      error: result.error,
    };
  }

  const sentOrTerminalEmails = new Set(
    result.records
      .filter((record) => record.eventType === "send_log")
      .map((record) => record.payload as ReviewSendLogPacket)
      .filter((log) => ["sent", "bounced", "failed", "followup_sent"].includes(log.status))
      .map((log) => log.customerEmail.toLowerCase()),
  );

  const latestUpload = result.records.find((record) => record.eventType === "customer_upload")?.payload as
    | ReviewCustomerPacket
    | undefined;
  const candidates =
    latestUpload?.rows
      .filter((row) => !row.suppressed)
      .filter((row) => row.email && !sentOrTerminalEmails.has(row.email.toLowerCase()))
      .map((row) => ({
        name: row.name,
        email: row.email,
        phone: row.phone,
        jobDate: row.jobDate,
        notes: row.notes,
      })) ?? [];

  return {
    ok: true,
    clientSlug,
    clientName: client.businessName,
    googleReviewUrl: client.googleReviewUrl,
    sourceUploadAt: latestUpload?.timestamp ?? "",
    totalCandidates: candidates.length,
    candidates,
  };
}

export function cleanClientSlug(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/[^a-z0-9-]/gi, "")
    .slice(0, 80)
    .toLowerCase();
}
