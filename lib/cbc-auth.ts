import { cookies } from "next/headers";
import {
  CBC_SESSION_COOKIE,
  CBC_SESSION_MAX_AGE,
  getCbcSessionToken,
  isValidCbcPin,
  isValidCbcSessionToken,
} from "@/lib/cbc-auth-core";

export async function hasCbcSession() {
  const token = (await cookies()).get(CBC_SESSION_COOKIE)?.value;
  return isValidCbcSessionToken(token);
}

export async function startCbcSession(pin: string) {
  if (!isValidCbcPin(pin)) return false;

  const cookieStore = await cookies();
  cookieStore.set(CBC_SESSION_COOKIE, await getCbcSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CBC_SESSION_MAX_AGE,
  });

  return true;
}

export async function endCbcSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CBC_SESSION_COOKIE);
}
