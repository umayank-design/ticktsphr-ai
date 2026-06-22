"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getKnowledgeArticleById,
  incrementKnowledgeUsage,
} from "@/lib/knowledgeBase";

export default function KnowledgeArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      const data = await getKnowledgeArticleById(id);

if (data) {
  await incrementKnowledgeUsage(id);
  const updatedData = await getKnowledgeArticleById(id);
  setArticle(updatedData);
} else {
  setArticle(null);
}

setLoading(false);
      setArticle(data);
      setLoading(false);
    }

    if (id) {
      loadArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        Loading knowledge article...
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <Link href="/knowledge-base" className="text-cyan-400">
          ← Back to Knowledge Base
        </Link>

        <h1 className="text-3xl font-bold mt-8">
          Article not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <Link href="/knowledge-base" className="text-cyan-400">
        ← Back to Knowledge Base
      </Link>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-cyan-400 font-semibold">
              Knowledge Article
            </p>

            <p className="text-slate-500 text-sm mt-1">
              AI Generated Resolution Repository
            </p>
          </div>

          <span className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm">
            Active
          </span>
        </div>

        <h1 className="text-4xl font-bold mt-6">
          {article.title}
        </h1>

        <p className="text-cyan-400 mt-4">
          {article.category || "General"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-sm">Source Ticket</p>

            {article.source_ticket_id ? (
              <Link
                href={`/tickets/${article.source_ticket_id}`}
                className="text-cyan-400 hover:text-cyan-300 mt-2 block"
              >
                Ticket #{article.source_ticket_id}
              </Link>
            ) : (
              <p className="text-white mt-2">Not linked</p>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-sm">Root Cause</p>
            <p className="text-white mt-2">
              {article.root_cause || "Not available"}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-sm">Created Date</p>
            <p className="text-white mt-2">
              {article.created_at
                ? new Date(article.created_at).toLocaleString()
                : "Not available"}
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
  <p className="text-slate-500 text-sm">
    Reuse Count
  </p>

  <p className="text-green-400 mt-2 text-xl font-bold">
    {article.usage_count || 0} Uses
  </p>
</div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Problem Summary
          </h2>

          <p className="text-slate-300 mt-3 leading-7">
            {article.problem_summary}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Resolution
          </h2>

          <pre className="text-green-400 mt-3 whitespace-pre-wrap leading-7">
            {article.resolution}
          </pre>
        </section>

        {article.tags && article.tags.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold">
              Tags
            </h2>

            <div className="flex flex-wrap gap-3 mt-4">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}