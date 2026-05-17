const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "http://2.24.198.207:56006";

export async function GET() {
  // Return HTML form that auto-submits to OpenClaw.
  // Browser handles the POST + redirect natively, so cookies work correctly.
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Logging in to OpenClaw...</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 2rem; }
    .loading { text-align: center; }
    form { display: none; }
  </style>
</head>
<body>
  <div class="loading">
    <p>Connecting to OpenClaw...</p>
  </div>
  <form id="login" method="POST" action="${OPENCLAW_BASE}/login">
    <input type="hidden" name="token" value="${OPENCLAW_TOKEN}">
  </form>
  <script>
    document.getElementById('login').submit();
  </script>
</body>
</html>
  `;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
