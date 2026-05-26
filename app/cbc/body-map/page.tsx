import type { Metadata } from "next";
import { CbcBodyMap } from "@/app/mike-mc/cancer-research/body-map/CbcBodyMap";
import { CbcGate } from "../CbcGate";
import { CbcPageShell } from "../CbcPageShell";

export const metadata: Metadata = {
  title: "CBC Body Map",
  description: "Protected 3D visual map of cancer history and current findings.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CbcBodyMapPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CbcGate error={params.error} nextPath="/cbc/body-map">
      <CbcPageShell
        active="Body Map"
        title="Visual Cancer Map"
        subtitle="Choose a history item, then drag the body to rotate it and see where CBC is placing known findings."
      >
        <CbcBodyMap />
      </CbcPageShell>
    </CbcGate>
  );
}
