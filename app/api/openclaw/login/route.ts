const OPENCLAW_TOKEN = "hgIa8rM0e2xzJODyAg1rsOCPRBWKsl3K";
const OPENCLAW_BASE = "https://hubgateway.aioutsourcehub.com";

export async function GET() {
  try {
    // Server-side login POST with automatic redirect following
    const res = await fetch(`${OPENCLAW_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${encodeURIComponent(OPENCLAW_TOKEN)}`,
      redirect: "follow",
      credentials: "include",
    });

    // Extract all cookies from the response chain
    const setCookie = res.headers.get("set-cookie");

    // Return JS redirect to OpenClaw (session preserved via cookie)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Opening OpenClaw...</title>
</head>
<body>
  <script>
    window.location.replace("${OPENCLAW_BASE}/");
  </script>
</body>
</html>
    `;

    const response = new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });

    // Forward all cookies so session persists
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 500 });
  }
}
