"use client";

import { useEffect, useState } from "react";
import { getMostReusedResolutions } from "@/lib/knowledgeBase";
import Link from "next/link";

export default function ResolutionLeaderboard() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const data = await getMostReusedResolutions();
      setArticles(data);
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">
          🏆 Most Reused Resolutions
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Top knowledge articles helping resolve repeat incidents faster
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No reused resolutions yet.
        </p>
      ) : (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/knowledge/${article.id}`}
              className="block bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-cyan-500 transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-cyan-400">
                      #{index + 1}
                    </span>
                    <h3 className="text-white font-semibold line-clamp-1">
                      {article.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {article.problem_summary || article.resolution}
                  </p>
                </div>

                <div className="text-right min-w-[90px]">
                  <p className="text-2xl font-bold text-emerald-400">
                    {article.usage_count || 0}
                  </p>
                  <p className="text-xs text-slate-500">
                    reuses
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}