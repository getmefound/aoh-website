const OPENCLAW_BASE = "https://hubgateway.aioutsourcehub.com";

export async function GET() {
  const token = process.env.OPENCLAW_TOKEN?.trim();
  if (!token) {
    return new Response("OpenClaw login is not configured.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const action = `${OPENCLAW_BASE}/login`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="referrer" content="no-referrer" />
  <title>Opening OpenClaw...</title>
</head>
<body>
  <form id="openclaw-login" method="post" action=${JSON.stringify(action)}>
    <input type="hidden" name="token" value=${JSON.stringify(token)} />
    <noscript>
      <button type="submit">Open OpenClaw</button>
    </noscript>
  </form>
  <script>
    document.getElementById("openclaw-login").submit();
  </script>
</body>
</html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
