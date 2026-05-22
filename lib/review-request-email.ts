import { SITE_URL } from "@/lib/seo";
import type { ReviewSendCandidate } from "@/lib/review-send-candidates";

export type ReviewRequestEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  feedbackUrl: string;
  unsubscribeUrl: string;
};

export type ReviewEmailSendResult =
  | { ok: true; provider: string; messageId: string; status?: number }
  | { ok: false; provider: string; error: string; status?: number };

type BuildReviewRequestInput = {
  clientSlug: string;
  clientName: string;
  candidate: ReviewSendCandidate;
};

export function buildReviewRequestEmail(input: BuildReviewRequestInput): ReviewRequestEmail {
  const name = firstName(input.candidate.name);
  const feedbackUrl = `${SITE_URL}/review/${input.clientSlug}`;
  const unsubscribeUrl = `${SITE_URL}/review/${input.clientSlug}/unsubscribe?email=${encodeURIComponent(input.candidate.email)}`;
  const greeting = name ? `Hi ${name},` : "Hi,";
  const subject = `Quick favor for ${input.clientName}`;

  const text = `${greeting}

Thanks again for working with ${input.clientName}. If everything went well, would you take a minute to leave quick feedback?

${feedbackUrl}

If there was a problem, the same page lets you send a private note first so the owner can make it right.

Stop review request emails:
${unsubscribeUrl}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7f4;color:#0f172a;font-family:Arial,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
        <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">
          Thanks again for working with ${escapeHtml(input.clientName)}. If everything went well,
          would you take a minute to leave quick feedback?
        </p>
        <p style="margin:24px 0;">
          <a href="${feedbackUrl}" style="display:inline-block;border-radius:8px;background:#065f46;color:#ffffff;padding:12px 18px;text-decoration:none;font-weight:700;">
            Leave feedback
          </a>
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
          If there was a problem, the same page lets you send a private note first so the owner can make it right.
        </p>
      </div>
      <p style="margin:16px 0 0;text-align:center;font-size:12px;line-height:1.5;color:#64748b;">
        <a href="${unsubscribeUrl}" style="color:#475569;">Stop review request emails</a>
      </p>
    </div>
  </body>
</html>`;

  return {
    to: input.candidate.email,
    subject,
    text,
    html,
    feedbackUrl,
    unsubscribeUrl,
  };
}

export async function sendReviewRequestEmail(email: ReviewRequestEmail): Promise<ReviewEmailSendResult> {
  const provider = process.env.AOH_REVIEW_EMAIL_PROVIDER?.trim().toLowerCase() || "resend";
  if (provider !== "resend") {
    return { ok: false, provider, error: `Unsupported review email provider: ${provider}` };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.AOH_REVIEW_REQUEST_FROM_EMAIL?.trim() || process.env.REVIEW_REQUEST_FROM_EMAIL?.trim();
  const replyTo = process.env.AOH_REVIEW_REQUEST_REPLY_TO?.trim() || process.env.REVIEW_REQUEST_REPLY_TO?.trim();
  if (!apiKey || !from) {
    return {
      ok: false,
      provider,
      error: "RESEND_API_KEY and AOH_REVIEW_REQUEST_FROM_EMAIL are required before live review sends.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      text: email.text,
      html: email.html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    cache: "no-store",
  }).catch((error) => {
    return error instanceof Error ? error : new Error("Unknown email provider error.");
  });

  if (response instanceof Error) {
    return { ok: false, provider, error: response.message };
  }

  const data = (await response.json().catch(() => null)) as { id?: string; message?: string; error?: string } | null;
  if (!response.ok) {
    return {
      ok: false,
      provider,
      status: response.status,
      error: data?.message || data?.error || "Email provider rejected the send.",
    };
  }

  return {
    ok: true,
    provider,
    status: response.status,
    messageId: data?.id ?? "",
  };
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
