import { NextResponse } from "next/server";
import { supabaseRest } from "@/lib/supabase-rest";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    await Promise.allSettled([
      supabaseRest("newsletter_subscribers", {
        method: "POST",
        prefer: "resolution=ignore-duplicates",
        body: { email, source: "getmefound.ai/newsletter", created_at: timestamp },
      }),
      pingSlack(email),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

async function pingSlack(email: string): Promise<void> {
  const webhook =
    process.env.SLACK_NEWSLETTER_WEBHOOK_URL?.trim() ||
    process.env.SLACK_CLIENT_INTAKE_WEBHOOK_URL?.trim() ||
    process.env.SLACK_MISSION_CONTROL_WEBHOOK_URL?.trim() ||
    process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhook) return;

  await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: `*Newsletter signup:* ${email}` }),
  }).catch((err) => {
    console.error("Newsletter Slack ping failed", err);
  });
}
