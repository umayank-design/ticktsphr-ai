import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
        <section className="max-w-7xl mx-auto text-center py-16">
          <p className="text-cyan-400 font-semibold mb-3">
            About Ticktsphr AI
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Built by Enterprise IT Experts
          </h1>

          <p className="text-slate-400 max-w-3xl mx-auto text-lg">
            Ticktsphr AI was created to help modern IT teams predict, route and
            resolve incidents faster using artificial intelligence, knowledge
            reuse and executive analytics.
          </p>
        </section>

        <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 py-16">
          {[
            [
              "Our Mission",
              "Transform incident management through AI-driven intelligence and automation.",
            ],
            [
              "Our Vision",
              "Become the trusted platform for enterprise incident intelligence and knowledge reuse.",
            ],
            [
              "Our Promise",
              "Help support teams reduce MTTR, improve routing accuracy and preserve organizational knowledge.",
            ],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <p className="text-slate-400">{desc}</p>
            </div>
          ))}
        </section>

        <section className="max-w-7xl mx-auto py-16">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-14">
            <p className="text-cyan-400 font-semibold mb-3">
              Why Ticktsphr?
            </p>

            <h2 className="text-4xl font-bold mb-6">
              From Ticket Handling to Incident Intelligence
            </h2>

            <p className="text-slate-400 max-w-4xl mb-10">
              Traditional service desks rely heavily on manual triage,
              individual experience and disconnected knowledge. Ticktsphr AI
              converts every ticket into intelligence by combining AI
              classification, smart routing, RCA suggestions, similar incident
              discovery and knowledge analytics.
            </p>

            <div className="grid md:grid-cols-5 gap-6">
              {["Predict", "Route", "Resolve", "Learn", "Optimize"].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center"
                  >
                    <h3 className="font-semibold text-cyan-400">{item}</h3>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center py-16">
          <div>
            <p className="text-cyan-400 font-semibold mb-3">
              Founder Perspective
            </p>

            <h2 className="text-4xl font-bold mb-6">
              Designed for Real Enterprise Operations
            </h2>

            <p className="text-slate-400 mb-6">
              Ticktsphr AI is built with practical enterprise experience across
              ERP transformations, IT operations, service management and digital
              support environments.
            </p>

            <p className="text-slate-400">
              The platform focuses on what business leaders care about most:
              faster resolution, reduced support cost, improved visibility and
              reusable organizational knowledge.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6">
              What We Believe
            </h3>

            <div className="space-y-4">
              {[
                "Every resolved ticket should become reusable knowledge.",
                "AI should assist teams, not replace accountability.",
                "Executives need outcomes, not only ticket counts.",
                "Support teams deserve tools that reduce repetitive effort.",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-slate-800 rounded-xl p-4 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-20 text-center">
          <div className="bg-cyan-500 text-black rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">
              Ready to See Ticktsphr in Action?
            </h2>

            <p className="mb-8">
              Book a demo and explore how AI can transform incident management.
            </p>

            <Link
              href="/book-demo"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold inline-block"
            >
              Book Demo
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}