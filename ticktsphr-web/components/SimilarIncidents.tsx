"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getKnowledgeArticles } from "@/lib/knowledgeBase";

export default function SimilarIncidents({
  category,
}: {
  category: string;
}) {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadArticles() {
      const data = await getKnowledgeArticles();

      const filtered = data
        .filter(
          (article: any) =>
            article.category &&
            category &&
            article.category.toLowerCase() ===
              category.toLowerCase()
        )
        .slice(0, 5);

      setArticles(filtered);
    }

    loadArticles();
  }, [category]);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Similar Incidents
      </h2>

      <p className="text-slate-400 mb-6">
        Previous resolutions related to this category.
      </p>

      {articles.length === 0 ? (
        <p className="text-slate-500">
          No similar incidents found.
        </p>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/knowledge-base/${article.id}`}
              className="block bg-slate-950 border border-slate-700 rounded-xl p-4 hover:border-cyan-500 transition"
            >
              <h3 className="font-semibold text-cyan-400">
                {article.title}
              </h3>

              <p className="text-slate-400 mt-2 line-clamp-2">
                {article.problem_summary}
              </p>

              <p className="text-green-400 text-sm mt-3">
                View Resolution →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}