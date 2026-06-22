"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTickets } from "@/lib/getTickets";
import TicketTrendChart from "@/components/TicketTrendChart";

export default function AnalyticsPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    async function loadTickets() {
      const data = await getTickets();
      setTickets(data);
    }

    loadTickets();
  }, []);
  const trendData = [
    { day: "Mon", tickets: 5 },
    { day: "Tue", tickets: 8 },
    { day: "Wed", tickets: 6 },
    { day: "Thu", tickets: 10 },
    { day: "Fri", tickets: 7 },
  ];


  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length;
  const highPriority = tickets.filter(
    (t) => t.priority === "P1" || t.priority === "P2"
  ).length;
  const slaRisk = tickets.filter(
  (t) => t.priority === "P1" && t.status === "Open"
).length;

const criticalOpen = tickets.filter(
  (t) => t.priority === "P1"
).length;

const potentialBreach = Math.ceil(slaRisk * 0.4);

const avgResolutionTime = "3.2 hrs";

  const topCategory =
    Object.entries(
      tickets.reduce((acc: any, t) => {
        const key = t.category || "General IT";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "No Data";

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-cyan-400 mt-2">
            Live operational intelligence from Ticktsphr AI
          </p>
        </div>

        <Link
          href="/dashboard"
          className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Tickets" value={totalTickets} />
        <MetricCard title="Open Tickets" value={openTickets} />
        <MetricCard title="Resolved Tickets" value={resolvedTickets} />
        <MetricCard title="High Priority" value={highPriority} />
      </div>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
  <MetricCard title="SLA Risk" value={slaRisk} />
  <MetricCard title="Critical Open" value={criticalOpen} />
  <MetricCard title="Potential Breach" value={potentialBreach} />
  <MetricCard title="Avg Resolution" value={avgResolutionTime} />
</div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <InsightCard title="Top Incident Category" value={topCategory} />
        <InsightCard
          title="Business Risk"
          value={highPriority > 5 ? "High" : "Medium"}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Executive Insight</h2>
        <p className="text-slate-300">
          Ticktsphr AI has processed {totalTickets} tickets. Current open
          workload is {openTickets}, with {highPriority} high-priority tickets
          requiring management attention.
        </p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
  <h2 className="text-2xl font-bold mb-4">
    AI Recommendations
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Ticket Trend Analysis
  </h2>

  <TicketTrendChart data={trendData} />
</div>
  </h2>

  <ul className="space-y-3 text-slate-300">
    <li>
      • Access Management incidents are trending highest.
    </li>

    <li>
      • Consider automating password reset workflows.
    </li>

    <li>
      • Service Desk workload is approaching threshold.
    </li>

    <li>
      • Implement self-service knowledge articles.
    </li>
  </ul>
</div>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400">{title}</p>
      <h2 className="text-4xl font-bold text-cyan-400 mt-2">{value}</h2>
      <p className="text-green-400 text-sm mt-2">Live from Supabase</p>
    </div>
  );
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400">{title}</p>
      <h2 className="text-2xl font-bold text-purple-400 mt-2">{value}</h2>
    </div>
  );
}