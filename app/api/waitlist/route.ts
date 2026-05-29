import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validation";
import { createAgentTask } from "@/lib/ops-store";
import { checkEmailRate } from "@/lib/rate-limit";
import { supabaseRest } from "@/lib/supabase-rest";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const { name, email, businessName, website, source } = body as {
    name?: unknown;
    email?: unknown;
    businessName?: unknown;
    website?: unknown; // honeypot
    source?: unknown;
  };

  // Honeypot
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }

  const v = validateEmail(email);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  const normalizedEmail = (email as string).trim().toLowerCase();
  const rate = await checkEmailRate(normalizedEmail, 2);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "Already on the list — we'll be in touch." },
      { status: 429 },
    );
  }

  const resolvedSource =
    typeof source === "string" && source.trim() ? source.trim() : "always-ready-waitlist";

  const submittedAt = new Date().toISOString();

  // Save to agent_tasks so it shows up in the pipeline
  await createAgentTask({
    title: `Waitlist: ${name.trim()} — ${resolvedSource}`,
    kind: "waitlist_signup",
    priority: "normal",
    source: "website_waitlist",
    payload: {
      name: name.trim(),
      email: normalizedEmail,
      businessName: typeof businessName === "string" ? businessName.trim() : "",
      source: resolvedSource,
      submittedAt,
    },
  });

  // Also write a lightweight row directly for pipeline queries
  await supabaseRest("waitlist_signups", {
    method: "POST",
    prefer: "return=minimal,resolution=merge-duplicates",
    body: {
      email: normalizedEmail,
      name: name.trim(),
      business_name: typeof businessName === "string" ? businessName.trim() : "",
      source: resolvedSource,
      status: "pending",
      submitted_at: submittedAt,
    },
  }).catch(() => {
    // Table may not exist yet — agent_task is the fallback, don't fail the request
  });

  return NextResponse.json({ ok: true });
}
