"use client";

import { useEffect, useState } from "react";
import { getKnowledgeAnalytics } from "@/lib/knowledgeBase";
import KnowledgeCategoryChart from "@/components/KnowledgeCategoryChart";
import KnowledgeGrowthChart from "@/components/KnowledgeGrowthChart";
import RootCauseChart from "@/components/RootCauseChart";

export default function KnowledgeAnalyticsPage() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadArticles() {
      const data = await getKnowledgeAnalytics();
      setArticles(data);
    }

    loadArticles();
  }, []);

  const totalArticles = articles.length;

  const categoryCounts = articles.reduce((acc: any, article: any) => {
    const category = article.category || "General";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const topCategory =
    Object.entries(categoryCounts).sort(
      (a: any, b: any) => Number(b[1]) - Number(a[1])
    )[0]?.[0] || "N/A";

  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const growthData = articles.reduce((acc: any[], article: any) => {
    const month = new Date(article.created_at).toLocaleString("default", {
      month: "short",
    });

    const existing = acc.find((x) => x.month === month);

    if (existing) {
      existing.articles += 1;
    } else {
      acc.push({
        month,
        articles: 1,
      });
    }

    return acc;
  }, []);

  const rootCauseCounts = articles.reduce((acc: any, article: any) => {
    const cause = article.root_cause || "Unknown";
    acc[cause] = (acc[cause] || 0) + 1;
    return acc;
  }, {});

  const rootCauseData = Object.entries(rootCauseCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400">
        Knowledge Analytics
      </h1>

      <p className="text-slate-400 mt-2">
        Insights from AI-generated knowledge articles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Total Articles</p>
          <h2 className="text-4xl font-bold mt-2">{totalArticles}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Top Category</p>
          <h2 className="text-2xl font-bold mt-2">{topCategory}</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">Knowledge Coverage</p>
          <h2 className="text-4xl font-bold mt-2">100%</h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm">AI Resolution Success</p>
          <h2 className="text-4xl font-bold mt-2">95%</h2>
        </div>
      </div>

      <div className="mt-10">
        <KnowledgeCategoryChart data={chartData} />
      </div>

      <div className="mt-8">
        <KnowledgeGrowthChart data={growthData} />
      </div>

      <div className="mt-8">
        <RootCauseChart data={rootCauseData} />
      </div>
    </main>
  );
}