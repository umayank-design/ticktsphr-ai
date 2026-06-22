"use client";

import { useEffect, useState } from "react";
import { getMTTRReductionMetrics } from "@/lib/knowledgeBase";

export default function MTTRReductionDashboard() {
  const [metrics, setMetrics] = useState({
    totalReuse: 0,
    estimatedHoursSaved: 0,
    estimatedMinutesSaved: 0,
    reuseRateLabel: "0%",
  });

  useEffect(() => {
    async function loadMetrics() {
      const data = await getMTTRReductionMetrics();
      setMetrics(data);
    }

    loadMetrics();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          MTTR Reduction Dashboard
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Estimated operational impact from AI resolution reuse
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Knowledge Reuses</p>
          <h3 className="text-3xl font-bold text-cyan-400 mt-2">
            {metrics.totalReuse}
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Estimated Hours Saved</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-2">
            {metrics.estimatedHoursSaved}
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Minutes Saved</p>
          <h3 className="text-3xl font-bold text-purple-400 mt-2">
            {metrics.estimatedMinutesSaved}
          </h3>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Reuse Engine Status</p>
          <h3 className="text-3xl font-bold text-orange-400 mt-2">
            {metrics.reuseRateLabel}
          </h3>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-5">
        Assumption: each reused resolution saves approximately 45 minutes of analyst effort.
      </p>
    </div>
  );
}