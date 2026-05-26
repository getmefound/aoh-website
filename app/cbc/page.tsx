import type { Metadata } from "next";
import { CancerResearchWorkbench } from "@/app/mike-mc/cancer-research/CancerResearchWorkbench";
import { CbcGate } from "./CbcGate";
import { CbcPageShell } from "./CbcPageShell";

export const metadata: Metadata = {
  title: "CBC",
  description: "Protected Cancer Battle Companion workspace.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CbcGate error={params.error} nextPath="/cbc">
      <CbcPageShell active="Home">
        <CancerResearchWorkbench basePath="/cbc" />
      </CbcPageShell>
    </CbcGate>
  );
}
