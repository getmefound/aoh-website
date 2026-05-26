"use server";

import { redirect } from "next/navigation";
import { endCbcSession, startCbcSession } from "@/lib/cbc-auth";

export async function unlockCbc(formData: FormData) {
  const pin = String(formData.get("pin") ?? "").trim();
  const next = safeNextPath(String(formData.get("next") ?? "/cbc"));
  const ok = await startCbcSession(pin);

  if (!ok) redirect(`${next}?error=Incorrect%20PIN`);
  redirect(next);
}

export async function lockCbc() {
  await endCbcSession();
  redirect("/cbc");
}

function safeNextPath(value: string) {
  if (value === "/cbc" || value.startsWith("/cbc/")) return value;
  return "/cbc";
}
