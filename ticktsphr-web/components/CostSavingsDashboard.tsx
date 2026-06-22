"use client";

import { useEffect, useState } from "react";
import { getCostSavingsMetrics } from "@/lib/knowledgeBase";

export default function CostSavingsDashboard() {
  const [metrics, setMetrics] = useState({
    totalReuse: 0,
    hoursSaved: 0,
    analystCostPerHour: 2500,
    monthlySavings: 0,
    annualSavings: 0,
    roiPercent: 0,
  });

  useEffect(() => {
    async function loadMetrics() {
      const data = await getCostSavingsMetrics();
      setMetrics(data);
    }

    loadMetrics();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          💰 Cost Savings Dashboard
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Estimated business value delivered by Ticktsphr AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Hours Saved</p>
          <h3 className="text-3xl font-bold text-cyan-400 mt-2">
            {metrics.hoursSaved}
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Monthly Savings</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-2">
            ₹{metrics.monthlySavings.toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Annual Savings</p>
          <h3 className="text-3xl font-bold text-purple-400 mt-2">
            ₹{metrics.annualSavings.toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">ROI</p>
          <h3 className="text-3xl font-bold text-orange-400 mt-2">
            {metrics.roiPercent}%
          </h3>
        </div>
      </div>

      <div className="mt-5 text-xs text-slate-500">
        Assumptions: 45 minutes saved per knowledge reuse, analyst cost ₹2,500/hour.
      </div>
    </div>
  );
}