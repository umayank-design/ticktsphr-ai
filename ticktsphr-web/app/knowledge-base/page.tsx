"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getKnowledgeArticles } from "@/lib/knowledgeBase";

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadArticles() {
      const data = await getKnowledgeArticles(search);
      setArticles(data);
    }

    loadArticles();
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400">
        Knowledge Base
      </h1>

      <p className="text-slate-400 mt-2">
        Search saved incident resolutions and root causes.
      </p>

      <input
        className="w-full mt-8 p-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
        placeholder="Search knowledge articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {articles.length === 0 ? (
          <p className="text-slate-500">
            No knowledge articles found.
          </p>
        ) : (
          articles.map((article) => (
            <Link
              href={`/knowledge-base/${article.id}`}
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 transition block"
            >
              <h2 className="text-xl font-semibold">
                {article.title}
              </h2>

              <p className="text-sm text-cyan-400 mt-2">
                {article.category || "General"}
              </p>

              <p className="text-slate-400 mt-4">
                {article.problem_summary}
              </p>

              <p className="text-slate-300 mt-4 line-clamp-4">
                <span className="text-slate-500">
                  Resolution:{" "}
                </span>
                {article.resolution}
              </p>
<p className="text-xs text-green-400 mt-4">
  Reused {article.usage_count || 0} times
</p>
              <p className="text-xs text-cyan-400 mt-4">
                View full article →
              </p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}