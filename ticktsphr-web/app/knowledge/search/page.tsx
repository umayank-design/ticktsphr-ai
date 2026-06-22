"use client";

import { useState } from "react";
import Link from "next/link";
import { searchSimilarKnowledgeArticles } from "@/lib/knowledgeBase";

export default function KnowledgeSearchPage() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);

    const data = await searchSimilarKnowledgeArticles(searchText);
    setResults(data);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mb-8">
        <Link href="/knowledge" className="text-cyan-400 hover:underline">
          ← Back to Knowledge Base
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          AI Semantic Knowledge Search
        </h1>

        <p className="text-slate-400 mt-2">
          Search past incidents, root causes, and reusable resolutions.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <textarea
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Example: VPN not connecting after password reset"
          className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-4 text-white"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find Similar Resolutions"}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((article) => (
          <div
            key={article.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {article.title}
                </h2>

                <p className="text-slate-400 mt-1">
                  Category: {article.category || "General"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400">Match Score</p>
                <p className="text-2xl font-bold text-green-400">
                  {article.match_score}%
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 text-sm">Root Cause</p>
              <p className="text-slate-300">
                {article.root_cause || "Not available"}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 text-sm">Resolution</p>
              <p className="text-slate-300 whitespace-pre-line">
                {article.resolution}
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                href={`/knowledge/${article.id}`}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
              >
                Open Article
              </Link>

              {article.source_ticket_id && (
                <Link
                  href={`/tickets/${article.source_ticket_id}`}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
                >
                  Source Ticket
                </Link>
              )}
            </div>
          </div>
        ))}

        {!loading && results.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-400">
            No search results yet. Enter an issue description and search.
          </div>
        )}
      </div>
    </main>
  );
}