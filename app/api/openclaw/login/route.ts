import { NextResponse } from "next/server";

const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "http://2.24.198.207:56006";

export async function GET() {
  try {
    // POST token to OpenClaw login endpoint
    const res = await fetch(`${OPENCLAW_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${encodeURIComponent(OPENCLAW_TOKEN)}`,
      redirect: "manual",
    });

    // Extract Set-Cookie header from OpenClaw response
    const setCookie = res.headers.get("set-cookie");
    const location = res.headers.get("location");

    // Create redirect response with OpenClaw's cookie
    const redirectUrl = location || `${OPENCLAW_BASE}/`;
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Forward the session cookie
    if (setCookie) {
      redirectResponse.headers.set("set-cookie", setCookie);
    }

    return redirectResponse;
  } catch (error) {
    console.error("OpenClaw login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
