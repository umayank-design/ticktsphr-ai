"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { searchSimilarTickets } from "@/lib/searchSimilarTickets";

export default function SimilarTicketSearchPage() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!searchText.trim()) {
      alert("Please enter search text.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in.");
      setLoading(false);
      return;
    }

    const data = await searchSimilarTickets(user.id, searchText);
    setResults(data);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">
        Similar Ticket Search
      </h1>

      <p className="text-slate-400 mb-6">
        Search historical tickets to find similar issues and recommended actions.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Example: Oracle PR not able to create"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 p-3 rounded bg-slate-900 border border-slate-800"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-cyan-500 text-black px-6 py-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mb-4 text-slate-300">
        Results Found: {results.length}
      </div>

      <div className="space-y-4">
        {results.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">
                Ticket #{ticket.ticket_number}
              </h2>

              <span className="text-cyan-400">
                {ticket.priority}
              </span>
            </div>

            <p className="text-slate-300 mb-3">
              {ticket.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Module</p>
                <p>{ticket.module || "-"}</p>
              </div>

              <div>
                <p className="text-slate-500">Suggested Team</p>
                <p>{ticket.suggested_team || "-"}</p>
              </div>

              <div>
                <p className="text-slate-500">Group</p>
                <p>{ticket.assigned_group || "-"}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 text-sm">Probable RCA</p>
              <p>{ticket.probable_rca || "-"}</p>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 text-sm">Recommended Action</p>
              <p>{ticket.recommended_action || "-"}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}