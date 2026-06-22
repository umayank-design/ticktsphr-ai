import Navbar from "@/components/Navbar";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹9,999",
    period: "/month",
    description: "For small support teams starting with AI incident intelligence.",
    features: [
      "5 Users",
      "AI Ticket Classification",
      "AI Routing",
      "Knowledge Base",
      "Basic Analytics",
    ],
    button: "Get Started",
    highlight: false,
  },
  {
    name: "Professional",
    price: "₹29,999",
    period: "/month",
    description: "For growing IT teams that need RCA, analytics and automation.",
    features: [
      "25 Users",
      "Probable RCA",
      "Similar Incident Detection",
      "Resolution Leaderboard",
      "MTTR Dashboard",
      "Cost Savings Dashboard",
      "API Access",
    ],
    button: "Start Professional",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large enterprises requiring scale, security and integrations.",
    features: [
      "Unlimited Users",
      "SSO / Azure AD",
      "Private AI Models",
      "Custom Integrations",
      "Dedicated Support",
      "Audit Trail",
      "Enterprise SLA",
    ],
    button: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-8 py-16">
        <section className="max-w-7xl mx-auto text-center">
          <p className="text-cyan-400 font-semibold mb-3">
            Pricing
          </p>

          <h1 className="text-5xl font-bold mb-4">
            Simple Pricing. Enterprise Value.
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto mb-14">
            Choose the plan that fits your incident management maturity.
            Scale as your support operations grow.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border bg-slate-900 ${
                  plan.highlight
                    ? "border-cyan-500 scale-105 shadow-lg shadow-cyan-500/10"
                    : "border-slate-800"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-3">
                  {plan.name}
                </h2>

                <p className="text-slate-400 mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-slate-400">
                    {plan.period}
                  </span>
                </div>

                <Link
                  href="/book-demo"
                  className={`block text-center rounded-lg py-3 font-semibold mb-8 ${
                    plan.highlight
                      ? "bg-cyan-500 text-black"
                      : "bg-slate-800 text-white border border-slate-700"
                  }`}
                >
                  {plan.button}
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <span className="text-cyan-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}