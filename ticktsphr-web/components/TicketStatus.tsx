"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  ticketId: number;
  organizationId: string;
  currentStatus: string;
  assignedEngineer?: string;
  userEmail?: string;
}

const allowedStatuses = [
  "Open",
  "Assigned",
  "Working",
  "Pending Inputs",
  "Resolved",
  "Closed",
];

const allowedTransitions: Record<string, string[]> = {
  Open: ["Assigned"],
  Assigned: ["Working"],
  Working: ["Pending Inputs", "Resolved"],
  "Pending Inputs": ["Working"],
  Resolved: ["Closed"],
  Closed: [],
};

export default function TicketStatus({
  ticketId,
  organizationId,
  currentStatus,
  assignedEngineer,
  userEmail,
}: Props) {
  const [status, setStatus] = useState(currentStatus || "Open");
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    const fromStatus = currentStatus || "Open";
    const toStatus = status;

    if (toStatus === fromStatus) {
      alert("Status is already the same.");
      return;
    }

    const validNextStatuses = allowedTransitions[fromStatus] || [];

    if (!validNextStatuses.includes(toStatus)) {
      alert(`Invalid status change: ${fromStatus} → ${toStatus}`);
      return;
    }

    if (
      toStatus === "Working" &&
      (!assignedEngineer || assignedEngineer.trim() === "")
    ) {
      alert("Assign an engineer before moving to Working.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("tickets")
      .update({
        status: toStatus,
        status_updated_at: new Date().toISOString(),
        status_updated_by: userEmail || "System",
      })
      .eq("id", ticketId);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { error: eventError } = await supabase.from("ticket_events").insert({
      organization_id: organizationId,
      ticket_id: String(ticketId),
      event_type: "Status Changed",
      old_value: fromStatus,
      new_value: toStatus,
      created_by: userEmail || "System",
      created_at: new Date().toISOString(),
    });

    if (eventError) {
      console.error("Timeline event error:", eventError.message);
    }

    alert("Status updated successfully.");
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Ticket Status
      </h3>

      <p className="text-slate-400 mb-3">
        Current Status:{" "}
        <span className="text-cyan-400 font-semibold">
          {currentStatus || "Open"}
        </span>
      </p>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full bg-slate-800 text-white p-3 rounded"
      >
        {allowedStatuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <p className="text-xs text-slate-500 mt-3">
        Allowed next status:{" "}
        {(allowedTransitions[currentStatus || "Open"] || []).length > 0
          ? (allowedTransitions[currentStatus || "Open"] || []).join(", ")
          : "No further transition allowed"}
      </p>

      <button
        onClick={updateStatus}
        disabled={loading}
        className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}