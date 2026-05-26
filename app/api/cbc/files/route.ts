import { NextResponse } from "next/server";
import { hasCbcSession } from "@/lib/cbc-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await hasCbcSession())) {
    return NextResponse.json({ ok: false, error: "CBC access required." }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);

  return NextResponse.json(
    {
      ok: false,
      uploaded: [],
      skipped: [],
      rejected: files.map((file) => file.name),
      error:
        "Live uploads are disabled so medical files do not get stored on the website. Add files locally, then redeploy CBC's extracted summary.",
    },
    { status: 501 },
  );
}
