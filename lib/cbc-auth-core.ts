export const CBC_SESSION_COOKIE = "cbc_access";
export const CBC_SESSION_MAX_AGE = 60 * 60 * 24 * 14;

const DEFAULT_CBC_PIN = "1705";
const SESSION_VERSION = "cbc-session-v1";

export function getCbcAccessPin() {
  return process.env.CBC_ACCESS_PIN?.trim() || DEFAULT_CBC_PIN;
}

export function isValidCbcPin(value: string) {
  return secureCompare(value.trim(), getCbcAccessPin());
}

export async function getCbcSessionToken() {
  const secret =
    process.env.CBC_AUTH_SECRET?.trim() ||
    process.env.GMF_INTERNAL_API_TOKEN?.trim() ||
    "cbc-development-session-secret";
  return hmacSha256(secret, `${SESSION_VERSION}:${getCbcAccessPin()}`);
}

export async function isValidCbcSessionToken(value: string | undefined) {
  if (!value) return false;
  return secureCompare(value, await getCbcSessionToken());
}

async function hmacSha256(secret: string, payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64Url(new Uint8Array(signature));
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function secureCompare(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}
