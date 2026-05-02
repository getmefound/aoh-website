import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Diagnostic } from "@/components/diagnostic";
import { Services } from "@/components/services";
import { StakesBand } from "@/components/stakes-band";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Diagnostic />
        <Services />
        <StakesBand />
      </main>
      <Footer />
    </div>
  );
}
