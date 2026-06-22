"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getHistoricalTickets } from "@/lib/getHistoricalTickets";

export default function HistoricalTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTickets() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const data = await getHistoricalTickets(user.id);
      setTickets(data);
    }

    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.ticket_number} ${ticket.description} ${ticket.priority} ${ticket.module} ${ticket.probable_rca} ${ticket.recommended_action}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Historical Tickets</h1>

      <p className="text-slate-400 mb-6">
        View imported historical tickets used for AI learning.
      </p>

      <input
        type="text"
        placeholder="Search description, module, RCA, recommendation..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded bg-slate-900 border border-slate-800 mb-6"
      />

      <div className="mb-4 text-slate-300">
        Showing {filteredTickets.length} of {tickets.length} tickets
      </div>

      <div className="overflow-auto border border-slate-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-3 text-left">Ticket</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Module</th>
              <th className="p-3 text-left">Suggested Team</th>
              <th className="p-3 text-left">RCA</th>
              <th className="p-3 text-left">Recommended Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.slice(0, 100).map((ticket) => (
              <tr key={ticket.id} className="border-t border-slate-800">
                <td className="p-3">{ticket.ticket_number}</td>
                <td className="p-3 max-w-md">{ticket.description}</td>
                <td className="p-3">{ticket.priority}</td>
                <td className="p-3">{ticket.module}</td>
                <td className="p-3">{ticket.suggested_team}</td>
                <td className="p-3">{ticket.probable_rca}</td>
                <td className="p-3">{ticket.recommended_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}