const SMARTLEAD_API_BASE = "https://server.smartlead.ai/api/v1";

export type SmartleadResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

export async function sendSmartleadThreadReply(input: {
  campaignId: string | number;
  emailStatsId: string;
  emailBody: string;
  toEmail?: string;
  toFirstName?: string;
  replyMessageId?: string;
  replyEmailBody?: string;
  replyEmailTime?: string;
}): Promise<SmartleadResult<unknown>> {
  const apiKey = process.env.SMARTLEAD_API_KEY?.trim();
  if (!apiKey) return { ok: false, status: 0, error: "SMARTLEAD_API_KEY is not configured." };
  if (!input.campaignId) return { ok: false, status: 400, error: "Missing SmartLead campaignId." };
  if (!input.emailStatsId) return { ok: false, status: 400, error: "Missing SmartLead emailStatsId." };

  const url = new URL(`${SMARTLEAD_API_BASE}/campaigns/${encodeURIComponent(String(input.campaignId))}/reply-email-thread`);
  url.searchParams.set("api_key", apiKey);

  const body = {
    email_stats_id: input.emailStatsId,
    email_body: input.emailBody,
    add_signature: false,
    ...(input.toEmail ? { to_email: input.toEmail } : {}),
    ...(input.toFirstName ? { to_first_name: input.toFirstName } : {}),
    ...(input.replyMessageId ? { reply_message_id: input.replyMessageId } : {}),
    ...(input.replyEmailBody ? { reply_email_body: input.replyEmailBody } : {}),
    ...(input.replyEmailTime ? { reply_email_time: input.replyEmailTime } : {}),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  }).catch((error) => errorResult(error instanceof Error ? error.message : "Unknown SmartLead reply error."));

  if (!(response instanceof Response)) return response;

  const text = await response.text().catch(() => "");
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300),
    };
  }

  return { ok: true, status: response.status, data };
}

function errorResult(message: string): SmartleadResult<never> {
  return { ok: false, status: 0, error: message };
}
