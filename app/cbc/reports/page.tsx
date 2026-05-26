import type { Metadata } from "next";
import { CancerResearchWorkbench } from "@/app/mike-mc/cancer-research/CancerResearchWorkbench";
import { CbcGate } from "../CbcGate";
import { CbcPageShell } from "../CbcPageShell";

export const metadata: Metadata = {
  title: "CBC Reports",
  description: "Protected CBC report translation workspace.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CbcGate error={params.error} nextPath="/cbc/reports">
      <CbcPageShell
        active="Reports"
        title="Report Translator"
        subtitle="Paste pathology, scan, or lab text and have CBC turn it into usable case notes."
      >
        <CancerResearchWorkbench view="reports" basePath="/cbc" />
      </CbcPageShell>
    </CbcGate>
  );
}
