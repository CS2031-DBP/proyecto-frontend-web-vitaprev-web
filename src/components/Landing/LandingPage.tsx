import LandingNavbar from "./LandingNavbar";
import FeaturesSection from "./Features";
import Publico from "./Publico";
import Hero from "./Hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      <header className="w-full border-b border-emerald-100/60 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <LandingNavbar />
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-12">
          <Hero />
        </section>

        <div className="w-full h-20 bg-linear-to-b from-emerald-50 to-white" />

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <FeaturesSection />
        </section>

        <div className="w-full h-20 bg-linear-to-b from-white to-emerald-50" />

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 pb-20">
          <Publico />
        </section>
      </main>
    </div>
  );
}
