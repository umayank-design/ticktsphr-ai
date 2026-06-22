"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getOrganizationTickets } from "@/lib/getOrganizationTickets";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const data = await getOrganizationTickets(user.id);

      setTickets(data);
      setLoading(false);
    }

    loadTickets();
  }, []);

  if (loading) {
    return (
      <main className="p-8 text-white bg-slate-950 min-h-screen">
        Loading tickets...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Tickets
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4">Ticket Number</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Priority</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Assigned Group</th>
              <th className="text-left p-4">Created</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t border-slate-800 hover:bg-slate-900"
              >
                <td className="p-4">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-cyan-400 hover:underline"
                  >
                    {ticket.ticket_number}
                  </Link>
                </td>

                <td className="p-4">
                  {ticket.title}
                </td>

                <td className="p-4">
                  {ticket.ai_priority || ticket.priority}
                </td>

                <td className="p-4">
                  {ticket.status}
                </td>

                <td className="p-4">
                  {ticket.ai_assignment_group ||
                    ticket.assigned_group}
                </td>

                <td className="p-4">
                  {new Date(
                    ticket.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}