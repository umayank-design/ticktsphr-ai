"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTickets } from "@/lib/getTickets";
import { getKnowledgeAnalytics } from "@/lib/knowledgeBase";

import CategoryChart from "@/components/CategoryChart";
import TeamWorkloadChart from "@/components/TeamWorkloadChart";
import ExecutiveSummaryPanel from "@/components/ExecutiveSummaryPanel";
import KnowledgeReuseKPI from "@/components/KnowledgeReuseKPI";
import ResolutionLeaderboard from "@/components/ResolutionLeaderboard";
import MTTRReductionDashboard from "@/components/MTTRReductionDashboard";
import CostSavingsDashboard from "@/components/CostSavingsDashboard";
import { getCurrentOrganization } from "@/lib/getCurrentOrganization";
// import MostReusedResolutionLeaderboard from "@/components/MostReusedResolutionLeaderboard";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

    
      const org = await getCurrentOrganization(user.id);

if (!org) {
  console.error("No organization found for user");
  return;
}

const organizationId = org.organization_id;

      const ticketData = await getTickets(organizationId);
      console.log("TICKETS:", ticketData);
      setTickets(ticketData);

      const knowledgeData = await getKnowledgeAnalytics(organizationId);
      console.log("ARTICLES:", knowledgeData);
      setArticles(knowledgeData);
    }

    loadData();
  }, []);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length;
  const p2Tickets = tickets.filter((t) => t.priority === "P2").length;

  const categoryCounts = tickets.reduce((acc: any, ticket: any) => {
    const category = ticket.category || "General IT";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const teamCounts = tickets.reduce((acc: any, ticket: any) => {
    const team = ticket.assignment_team || "Service Desk";
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryCounts).map(
    ([name, value]: any) => ({
      name,
      value,
    })
  );

  const teamChartData = Object.entries(teamCounts).map(
    ([team, count]: any) => ({
      team,
      count,
    })
  );

  const stats = [
    { title: "Total Tickets", value: totalTickets },
    { title: "Open Tickets", value: openTickets },
    { title: "Resolved Tickets", value: resolvedTickets },
    { title: "High Priority", value: p2Tickets },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Executive Dashboard</h1>
          <p className="text-cyan-400 mt-2">
            Ticktsphr AI - Predict. Route. Resolve.
          </p>
        </div>

        <div className="flex gap-3">
  <Link
    href="/raise-ticket"
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
  >
    Raise Ticket
  </Link>

  <Link
    href="/tickets"
    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
  >
    Tickets
  </Link>

  <Link
    href="/analytics"
    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
  >
    Analytics
  </Link>

  <Link
    href="/executive-command-center"
    className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-semibold"
  >
    Command Center
  </Link>

  <Link
    href="/billing"
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
  >
    Billing
  </Link>
</div>
      </div>

      <ExecutiveSummaryPanel tickets={tickets} articles={articles} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <p className="text-slate-400">{item.title}</p>
            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {item.value}
            </h2>
            <p className="text-green-400 text-sm mt-2">Live from Supabase</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Category Distribution</h2>
          <CategoryChart data={categoryChartData} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Team Workload</h2>
          <TeamWorkloadChart data={teamChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <KnowledgeReuseKPI />

        <div className="lg:col-span-2">
          <ResolutionLeaderboard />
        </div>
      </div>

      <MTTRReductionDashboard />

      <div className="mt-8">
        <CostSavingsDashboard />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Tickets</h2>

        <div className="space-y-3">
          {tickets.slice(0, 10).map((ticket: any) => (
            <Link
              key={ticket.id}
              href={"/tickets/" + ticket.id}
              className="block p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
            >
              #{ticket.id} - {ticket.category} - {ticket.priority}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}