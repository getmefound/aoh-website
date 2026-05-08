// In-memory email-based rate limiter.
// Tradeoff: state lost on serverless cold-start. Acceptable pre-launch (low volume).
// Migrate to Upstash Redis (Vercel Marketplace) once volume justifies it.

const buckets = new Map<string, number[]>();
const WINDOW_MS = 24 * 60 * 60 * 1000;

export function checkEmailRate(email: string, limit: number): { ok: boolean; retryAfterSec?: number } {
  const key = email.trim().toLowerCase();
  if (!key) return { ok: true };

  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= limit) {
    const oldestInWindow = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  recent.push(now);
  buckets.set(key, recent);

  if (Math.random() < 0.01) {
    for (const [k, v] of buckets) {
      const fresh = v.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) buckets.delete(k);
      else buckets.set(k, fresh);
    }
  }

  return { ok: true };
}
