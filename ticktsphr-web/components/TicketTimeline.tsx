"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Event = {
  id: string;
  event_type: string;
  old_value: string | null;
  new_value: string | null;
  created_by: string | null;
  created_at: string;
};

export default function TicketTimeline({
  ticketId,
}: {
  ticketId: string;
}) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
  }, [ticketId]);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("ticket_events")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Timeline fetch error:", error.message);
      return;
    }

    setEvents(data || []);
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Ticket Timeline
      </h2>

      {events.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No timeline events found.
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-l-2 border-cyan-500 pl-4 py-2"
            >
              <div className="flex justify-between">
                <h3 className="text-cyan-400 font-medium">
                  {event.event_type}
                </h3>

                <span className="text-xs text-slate-500">
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </div>

              {event.old_value && (
                <p className="text-sm text-red-400 mt-1">
                  Old: {event.old_value}
                </p>
              )}

              {event.new_value && (
                <p className="text-sm text-green-400 mt-1">
                  New: {event.new_value}
                </p>
              )}

              <p className="text-xs text-slate-500 mt-1">
                By: {event.created_by || "System"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}