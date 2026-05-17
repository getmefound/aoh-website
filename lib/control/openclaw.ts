/**
 * OpenClaw gateway token — stored server-side, never exposed to client
 */
const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "https://hubgateway.aioutsourcehub.com";

export async function getOpenClawLoginUrl(): Promise<string> {
  return `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/openclaw/login`;
}
