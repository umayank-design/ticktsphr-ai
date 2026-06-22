import Navbar from "@/components/Navbar";

const features = [
  {
    title: "AI Ticket Classification",
    icon: "🏷️",
    desc: "Automatically classify incidents using AI."
  },
  {
    title: "Smart Routing",
    icon: "🎯",
    desc: "Route tickets to the correct team instantly."
  },
  {
    title: "Probable RCA",
    icon: "🔍",
    desc: "Identify likely root causes before investigation."
  },
  {
    title: "AI Resolution Generator",
    icon: "🤖",
    desc: "Generate suggested resolutions instantly."
  },
  {
    title: "Duplicate Detection",
    icon: "📑",
    desc: "Prevent duplicate ticket storms."
  },
  {
    title: "Knowledge Base",
    icon: "📚",
    desc: "Convert incidents into reusable knowledge."
  }
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl font-bold mb-4">
            Platform Features
          </h1>

          <p className="text-slate-400 mb-12">
            Everything you need to predict, route and resolve incidents faster.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>

                <h2 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h2>

                <p className="text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}