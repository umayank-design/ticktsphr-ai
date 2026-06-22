import Link from "next/link";

export default function ProductShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left Side */}

        <div>
          <p className="text-cyan-400 font-semibold mb-3">
            Platform Overview
          </p>

          <h2 className="text-5xl font-bold text-white mb-6">
            See Ticktsphr AI In Action
          </h2>

          <p className="text-slate-400 mb-8">
            A single platform that classifies incidents,
            predicts root causes, recommends resolutions
            and unlocks operational intelligence.
          </p>

          <div className="space-y-5">

            <div className="flex gap-4">
              <span>🏷️</span>
              <div>
                <h3 className="font-semibold">
                  AI Classification
                </h3>

                <p className="text-slate-400 text-sm">
                  Categorize tickets automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span>🎯</span>
              <div>
                <h3 className="font-semibold">
                  Smart Routing
                </h3>

                <p className="text-slate-400 text-sm">
                  Send tickets to the right team instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span>🔍</span>
              <div>
                <h3 className="font-semibold">
                  Probable RCA
                </h3>

                <p className="text-slate-400 text-sm">
                  Identify likely root causes faster.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span>🤖</span>
              <div>
                <h3 className="font-semibold">
                  AI Resolution
                </h3>

                <p className="text-slate-400 text-sm">
                  Generate resolution recommendations.
                </p>
              </div>
            </div>

          </div>

          <Link
            href="/book-demo"
            className="inline-block mt-8 bg-cyan-500 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Request Demo
          </Link>

        </div>

        {/* Right Side Screenshot Placeholder */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <div className="bg-slate-950 rounded-xl p-6">

            <div className="grid grid-cols-3 gap-4 mb-6">

              <div className="bg-slate-900 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">
                  12,847
                </div>
                <p className="text-xs text-slate-400">
                  Tickets
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">
                  95%
                </div>
                <p className="text-xs text-slate-400">
                  Accuracy
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">
                  40%
                </div>
                <p className="text-xs text-slate-400">
                  MTTR ↓
                </p>
              </div>

            </div>

            <div className="h-64 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500">
              Dashboard Preview
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}