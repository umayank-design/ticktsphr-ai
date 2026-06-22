"use client";

import { useEffect, useState } from "react";
import { getKnowledgeReuseKPI } from "@/lib/knowledgeBase";

export default function KnowledgeReuseKPI() {
  const [kpi, setKpi] = useState({
    totalReuse: 0,
    reusedArticles: 0,
  });

  useEffect(() => {
    async function loadKPI() {
      const data = await getKnowledgeReuseKPI();
      setKpi(data);
    }

    loadKPI();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <p className="text-sm text-slate-400">Knowledge Reuse</p>

      <h2 className="text-4xl font-bold text-emerald-400 mt-2">
        {kpi.totalReuse}
      </h2>

      <p className="text-sm text-slate-400 mt-2">
        Total resolution reuses from knowledge base
      </p>

      <div className="mt-4 text-sm text-cyan-400">
        {kpi.reusedArticles} articles reused
      </div>
    </div>
  );
}