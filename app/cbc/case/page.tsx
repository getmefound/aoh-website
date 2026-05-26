import type { Metadata } from "next";
import { CancerResearchWorkbench } from "@/app/mike-mc/cancer-research/CancerResearchWorkbench";
import { CbcGate } from "../CbcGate";
import { CbcPageShell } from "../CbcPageShell";

export const metadata: Metadata = {
  title: "CBC Case",
  description: "Protected CBC case editor.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcCasePage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CbcGate error={params.error} nextPath="/cbc/case">
      <CbcPageShell
        active="Case"
        title="Case Notes"
        subtitle="Edit the working case summary CBC uses for chat, doctor questions, and the share packet."
      >
        <CancerResearchWorkbench view="case" basePath="/cbc" />
      </CbcPageShell>
    </CbcGate>
  );
}
