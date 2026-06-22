import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-24 text-center">
          <p className="text-cyan-400 font-semibold mb-4">
            Predict. Route. Resolve.
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AI-powered Incident Intelligence Platform
          </h1>

          <p className="text-slate-400 max-w-3xl mx-auto text-lg mb-10">
            Reduce MTTR, improve routing accuracy and unlock reusable knowledge
            from every incident using AI.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/book-demo"
              className="bg-cyan-500 text-black px-6 py-3 rounded-lg font-semibold"
            >
              Book Demo
            </Link>

            <Link
              href="/features"
              className="border border-slate-700 px-6 py-3 rounded-lg text-white"
            >
              View Platform
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              One Platform. Complete Incident Intelligence.
            </h2>

            <p className="text-slate-400">
              Everything your support team needs to classify, route and resolve faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["🏷️", "AI Classification", "Automatically classify tickets using AI."],
              ["🎯", "Smart Routing", "Route tickets to the right resolver group."],
              ["🔍", "Probable RCA", "Identify likely root causes faster."],
              ["🤖", "Resolution Generator", "Generate AI-powered resolutions."],
              ["📚", "Knowledge Base", "Convert resolved tickets into knowledge."],
              ["📊", "Executive Analytics", "Track MTTR, savings and team performance."],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              How Ticktsphr Works
            </h2>

            <p className="text-slate-400">
              From uploaded ticket to AI-powered resolution intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["1", "Upload Tickets", "Import incident data into the platform."],
              ["2", "AI Analysis", "Classify, route and detect duplicates."],
              ["3", "Resolution Intelligence", "Generate RCA and resolution suggestions."],
              ["4", "Executive Insights", "Track outcomes through dashboards."],
            ].map(([step, title, desc]) => (
              <div
                key={step}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold mb-5">
                  {step}
                </div>

                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Outcomes Section */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-cyan-400 font-semibold mb-3">
                  Executive Outcomes
                </p>

                <h2 className="text-4xl font-bold mb-4">
                  Turn Service Desk Data Into Business Intelligence
                </h2>

                <p className="text-slate-400">
                  Ticktsphr gives leadership visibility into recurring incidents,
                  resolver performance, MTTR trends, knowledge reuse and cost savings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "MTTR Dashboard",
                  "Cost Savings",
                  "Resolution Leaderboard",
                  "Knowledge Analytics",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-cyan-400 font-semibold mb-3">
                Platform Overview
              </p>

              <h2 className="text-5xl font-bold text-white mb-6">
                See Ticktsphr AI In Action
              </h2>

              <p className="text-slate-400 mb-8">
                A single platform that classifies incidents, predicts root causes,
                recommends resolutions and unlocks operational intelligence.
              </p>

              <div className="space-y-5">
                {[
                  ["🏷️", "AI Classification", "Categorize tickets automatically."],
                  ["🎯", "Smart Routing", "Send tickets to the right team instantly."],
                  ["🔍", "Probable RCA", "Identify likely root causes faster."],
                  ["🤖", "AI Resolution", "Generate resolution recommendations."],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-4">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-slate-400 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/book-demo"
                className="inline-block mt-8 bg-cyan-500 text-black px-6 py-3 rounded-lg font-semibold"
              >
                Request Demo
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="bg-slate-950 rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-900 p-4 rounded-lg text-center">
                    <div className="text-cyan-400 text-2xl font-bold">
                      12,847
                    </div>
                    <p className="text-xs text-slate-400">Tickets</p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg text-center">
                    <div className="text-cyan-400 text-2xl font-bold">
                      95%
                    </div>
                    <p className="text-xs text-slate-400">Accuracy</p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg text-center">
                    <div className="text-cyan-400 text-2xl font-bold">
                      40%
                    </div>
                    <p className="text-xs text-slate-400">MTTR ↓</p>
                  </div>
                </div>

                <div className="h-64 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500">
                  Dashboard Preview
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Metrics Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-cyan-400 font-semibold mb-3">
              Business Impact
            </p>

            <h2 className="text-5xl font-bold text-white mb-4">
              Measurable Business Impact
            </h2>

            <p className="text-slate-400 max-w-3xl mx-auto">
              Deliver faster resolutions, lower support costs and unlock
              institutional knowledge across your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              ["40%", "Lower MTTR", "Resolve incidents faster using AI-assisted recommendations."],
              ["60%", "Faster Routing", "Eliminate manual ticket assignment delays."],
              ["70%", "Knowledge Reuse", "Reuse proven resolutions and reduce repetitive effort."],
              ["30%", "Cost Reduction", "Improve efficiency while lowering support costs."],
            ].map(([value, title, desc]) => (
              <div
                key={title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center"
              >
                <div className="text-5xl font-bold text-cyan-400 mb-3">
                  {value}
                </div>

                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industry Coverage Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-cyan-400 font-semibold mb-3">
              Industries We Serve
            </p>

            <h2 className="text-5xl font-bold text-white mb-4">
              Built for Modern Enterprise Operations
            </h2>

            <p className="text-slate-400 max-w-3xl mx-auto">
              Ticktsphr AI helps organizations accelerate incident resolution,
              improve service quality and preserve operational knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              ["🏥", "Healthcare", "Hospitals & Clinics"],
              ["🏭", "Manufacturing", "Plant Operations"],
              ["🛒", "Retail", "Store Support"],
              ["💻", "Technology", "IT Services"],
              ["🏛️", "Government", "Public Sector"],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center hover:border-cyan-500 transition"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold text-lg text-white">{title}</h3>
                <p className="text-slate-500 text-sm mt-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-cyan-400 font-semibold mb-3">
              Customer Confidence
            </p>

            <h2 className="text-5xl font-bold text-white mb-4">
              Built for IT Leaders Who Need Results
            </h2>

            <p className="text-slate-400 max-w-3xl mx-auto">
              Ticktsphr AI is designed for enterprise IT teams who want faster
              resolution, better visibility and reusable knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              [
                "AI-powered classification and routing can significantly reduce manual triage effort and help support teams respond faster.",
                "IT Operations Leader",
                "Healthcare Enterprise",
              ],
              [
                "Similar incident discovery and knowledge reuse can improve first-time resolution and reduce repeated investigation effort.",
                "Service Delivery Manager",
                "Technology Services",
              ],
              [
                "Executive dashboards make it easier to track MTTR, resolution trends, cost savings and support team performance.",
                "Head of IT Support",
                "Enterprise Operations",
              ],
            ].map(([quote, role, industry]) => (
              <div
                key={role}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500 transition"
              >
                <div className="text-cyan-400 text-xl mb-4">
                  ★★★★★
                </div>

                <p className="text-slate-300 mb-8 leading-relaxed">
                  "{quote}"
                </p>

                <div className="border-t border-slate-800 pt-5">
                  <h4 className="font-semibold text-white">{role}</h4>
                  <p className="text-slate-500 text-sm">{industry}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo CTA Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="bg-cyan-500 text-black rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Incident Management?
            </h2>

            <p className="mb-8 max-w-2xl mx-auto">
              Book a demo and see how Ticktsphr AI can help your team predict,
              route and resolve incidents faster.
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