"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { findDuplicateTickets } from "@/lib/duplicateDetection";

export default function DuplicateTickets({
  description,
  currentTicketId,
}: any) {
  const [duplicates, setDuplicates] = useState<any[]>([]);

  useEffect(() => {
    async function loadDuplicates() {
      const results =
        await findDuplicateTickets(
          description,
          currentTicketId
        );

      setDuplicates(results);
    }

    if (description) {
      loadDuplicates();
    }
  }, [description, currentTicketId]);

  if (duplicates.length === 0) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-6">
      <h2 className="text-xl font-bold mb-4 text-orange-400">
        AI Duplicate Detection
      </h2>

      <p className="text-slate-400">
        No duplicate tickets found for this incident.
      </p>
    </div>
  );
}

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-orange-500 mt-6">
      <h2 className="text-xl font-bold mb-4 text-orange-400">
        AI Duplicate Detection
      </h2>

      <div className="space-y-3">
        {duplicates.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="block bg-slate-800 p-4 rounded-lg hover:bg-slate-700"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  {ticket.ticket_number ||
                    `INC${ticket.id}`}
                </p>

                <p className="text-slate-400 text-sm">
                  {ticket.description}
                </p>
              </div>

              <div className="text-orange-400 font-bold">
                {ticket.match_score}%
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}