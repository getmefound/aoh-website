const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "https://hubgateway.aioutsourcehub.com";

export async function GET() {
  const action = `${OPENCLAW_BASE}/login`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Opening OpenClaw...</title>
</head>
<body>
  <form id="openclaw-login" method="post" action=${JSON.stringify(action)}>
    <input type="hidden" name="token" value=${JSON.stringify(OPENCLAW_TOKEN)} />
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
    },
  });
}
