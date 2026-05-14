import { redirect } from "next/navigation";

export default async function TokenEntryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/?t=${encodeURIComponent(token)}`);
}

