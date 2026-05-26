import type { Metadata } from "next";
import { CancerResearchWorkbench } from "@/app/mike-mc/cancer-research/CancerResearchWorkbench";
import { CbcGate } from "../CbcGate";
import { CbcPageShell } from "../CbcPageShell";

export const metadata: Metadata = {
  title: "CBC Share Packet",
  description: "Protected CBC summary packet.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcPacketPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CbcGate error={params.error} nextPath="/cbc/packet">
      <CbcPageShell
        active="Share Packet"
        title="Share Packet"
        subtitle="Copy, download, or print a clean case summary for a second opinion or family discussion."
      >
        <CancerResearchWorkbench view="packet" basePath="/cbc" />
      </CbcPageShell>
    </CbcGate>
  );
}
