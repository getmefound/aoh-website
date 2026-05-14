import crypto from "node:crypto";

export type ReportTokenPayload = {
  email?: string;
  businessName?: string;
  campaign?: "reviews" | "ai" | "organic";
  reportType?: "marketing" | "ai_visibility";
  exp?: number;
};

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function unb64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  return Buffer.from(padded, "base64");
}

export function verifyReportToken(token: string): ReportTokenPayload | null {
  const raw = token.trim();
  if (!raw) return null;

  const secret = process.env.REPORT_LINK_SECRET?.trim();
  if (!secret) return null;

  const [payloadPart, sigPart] = raw.split(".");
  if (!payloadPart || !sigPart) return null;

  const expectedSig = b64url(crypto.createHmac("sha256", secret).update(payloadPart).digest());
  if (expectedSig !== sigPart) return null;

  try {
    const payload = JSON.parse(unb64url(payloadPart).toString("utf8")) as ReportTokenPayload;
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

