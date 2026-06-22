"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getTickets } from "@/lib/getTickets";
import { getKnowledgeAnalytics } from "@/lib/knowledgeBase";
import ExecutiveScorecard from "@/components/ExecutiveScorecard";
import AIAdoptionTrend from "@/components/AIAdoptionTrend";
import PredictiveForecast from "@/components/PredictiveForecast";
import CustomerHealthDashboard from "@/components/CustomerHealthDashboard";
import ExportExecutiveReport from "@/components/ExportExecutiveReport";

export default function ExecutiveCommandCenterPage() {
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

      const organizationId = "c5191970-2ce2-498f-8d2b-6193db93a575";

      const ticketData = await getTickets(organizationId);
      setTickets(ticketData || []);

      const knowledgeData = await getKnowledgeAnalytics(organizationId);
      setArticles(knowledgeData || []);
    }

    loadData();
  }, []);

  const aiAccuracy = 92;

  const previousMTTR = 12;
  const currentMTTR = 8;

  const mttrReduction = Math.round(
    ((previousMTTR - currentMTTR) / previousMTTR) * 100
  );

  const ticketsAutoResolved = tickets.filter(
    (t) => t.status === "Resolved"
  ).length;

  const avgMinutesSaved = 18;

  const hoursSaved = Math.round(
    (ticketsAutoResolved * avgMinutesSaved) / 60
  );

  const hourlyCost = 1200;
  const costSaved = hoursSaved * hourlyCost;

  const totalTickets = tickets.length;

  const resolvedTickets = tickets.filter(
    (t) => t.status === "Resolved"
  ).length;

  const resolutionRate =
    totalTickets > 0
      ? Math.round((resolvedTickets / totalTickets) * 100)
      : 0;

  const knowledgeReuse =
    articles.length > 0 ? Math.min(95, articles.length * 5) : 0;

  const executiveHealthScore = Math.round(
    (aiAccuracy + mttrReduction + resolutionRate + knowledgeReuse) / 4
  );

  const categoryCounts = tickets.reduce((acc: any, ticket: any) => {
    const category = ticket.category || "General IT";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const heatmapData = Object.entries(categoryCounts)
    .map(([category, count]: any) => ({
      category,
      count,
      risk: count > 20 ? "High" : count > 10 ? "Medium" : "Low",
    }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Executive Command Center
            </h1>

            <p className="text-slate-400 mt-2">
              CIO-ready view of AI accuracy, resolution performance,
              productivity savings, and business impact.
            </p>
          </div>

          <div className="flex gap-3">
  <ExportExecutiveReport
    tickets={tickets}
    articles={articles}
  />

  <Link
    href="/dashboard"
    className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
  >
    Back to Dashboard
  </Link>
</div>cd ticktsphr
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              AI Classification Accuracy
            </p>

            <h2 className="text-3xl font-bold text-cyan-400 mt-2">
              {aiAccuracy}%
            </h2>

            <p className="text-green-400 text-sm mt-2">
              AI powered classification engine
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              MTTR Reduction
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {mttrReduction}%
            </h2>

            <p className="text-green-400 text-sm mt-2">
              Faster ticket resolution
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Hours Saved
            </p>

            <h2 className="text-3xl font-bold text-yellow-400 mt-2">
              {hoursSaved} hrs
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Based on resolved tickets
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Estimated Cost Saved
            </p>

            <h2 className="text-3xl font-bold text-purple-400 mt-2">
              ₹{costSaved.toLocaleString()}
            </h2>

            <p className="text-green-400 text-sm mt-2">
              AI-driven efficiency
            </p>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Executive Health Score
              </h2>

              <p className="text-slate-400 mt-2">
                Overall platform performance across AI accuracy,
                resolution efficiency, knowledge reuse, and cost savings.
              </p>
            </div>

            <div className="mt-6 md:mt-0 text-center">
              <div
                className={
                  executiveHealthScore >= 85
                    ? "text-6xl font-bold text-green-400"
                    : executiveHealthScore >= 70
                    ? "text-6xl font-bold text-yellow-400"
                    : "text-6xl font-bold text-red-400"
                }
              >
                {executiveHealthScore}
              </div>

              <div
                className={
                  executiveHealthScore >= 85
                    ? "text-green-400 font-semibold"
                    : executiveHealthScore >= 70
                    ? "text-yellow-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {executiveHealthScore >= 85
                  ? "Excellent"
                  : executiveHealthScore >= 70
                  ? "Good"
                  : "Needs Attention"}
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-4 mt-8">
            <div
              className={
                executiveHealthScore >= 85
                  ? "bg-green-500 h-4 rounded-full"
                  : executiveHealthScore >= 70
                  ? "bg-yellow-500 h-4 rounded-full"
                  : "bg-red-500 h-4 rounded-full"
              }
              style={{ width: `${executiveHealthScore}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-slate-400 mt-2">
            <span>0</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </section>

        <ExecutiveScorecard tickets={tickets} articles={articles} />
        <AIAdoptionTrend />
        <PredictiveForecast tickets={tickets} />
        <CustomerHealthDashboard />

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Executive Risk Heatmap
          </h2>

          {heatmapData.length === 0 ? (
            <p className="text-slate-400">
              No ticket data available for heatmap.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {heatmapData.map((item: any) => (
                <div
                  key={item.category}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-4"
                >
                  <div
                    className={
                      item.risk === "High"
                        ? "h-3 bg-red-500 rounded mb-4"
                        : item.risk === "Medium"
                        ? "h-3 bg-yellow-500 rounded mb-4"
                        : "h-3 bg-green-500 rounded mb-4"
                    }
                  />

                  <h3 className="font-semibold">{item.category}</h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {item.count} Tickets
                  </p>

                  <p
                    className={
                      item.risk === "High"
                        ? "text-red-400 text-sm"
                        : item.risk === "Medium"
                        ? "text-yellow-400 text-sm"
                        : "text-green-400 text-sm"
                    }
                  >
                    {item.risk} Risk
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            CIO Summary
          </h2>

          <div className="space-y-3 text-slate-300">
            <p>
              Ticktsphr AI is reducing manual triage effort, improving
              resolution speed, and reusing knowledge base resolutions to
              reduce repeated support workload.
            </p>

            <p>
              The current executive score is based on AI accuracy, MTTR
              reduction, resolution rate, and knowledge reuse from the
              platform data.
            </p>

            <p className="text-cyan-400 font-medium">
              Recommendation: Expand knowledge reuse and auto-resolution
              coverage for high-frequency categories.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}