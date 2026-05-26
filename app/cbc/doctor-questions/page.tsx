import type { Metadata } from "next";
import { CancerResearchWorkbench } from "@/app/mike-mc/cancer-research/CancerResearchWorkbench";
import { CbcGate } from "../CbcGate";
import { CbcPageShell } from "../CbcPageShell";

export const metadata: Metadata = {
  title: "CBC Doctor Questions",
  description: "Protected oncology question prep.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcDoctorQuestionsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CbcGate error={params.error} nextPath="/cbc/doctor-questions">
      <CbcPageShell
        active="Doctor Questions"
        title="Questions For Oncology"
        subtitle="Dynamic questions, likely answers, and follow-ups based on the current saved case."
      >
        <CancerResearchWorkbench view="doctor" basePath="/cbc" />
      </CbcPageShell>
    </CbcGate>
  );
}
