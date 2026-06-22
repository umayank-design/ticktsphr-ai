"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const engineers = [
  "Mayank Upadhyay",
  "Ravi Kumar",
  "Priya Sharma",
  "Ahmed Khan",
  "Neha Singh",
];

export default function TicketAssignment({
  ticketId,
  organizationId,
  supportGroup,
  subGroup,
  resolverTeam,
  assignedEngineer,
}: {
  ticketId: string;
  organizationId: string;
  supportGroup: string | null;
  subGroup: string | null;
  resolverTeam: string | null;
  assignedEngineer: string | null;
}) {
  const [engineer, setEngineer] = useState(assignedEngineer || "");
  const [loading, setLoading] = useState(false);

  async function assignEngineer() {
    if (!engineer) {
      alert("Please select assigned engineer.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("tickets")
      .update({
        assigned_engineer: engineer,
        status: "Assigned",
      })
      .eq("id", ticketId);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    await supabase.from("ticket_events").insert({
      ticket_id: ticketId,
      organization_id: organizationId,
      event_type: "Engineer Assigned",
      new_value: `
Assigned Engineer: ${engineer}
Status: Assigned
      `,
      created_by: userData.user?.email || "System",
    });

    alert("Engineer assigned successfully.");
    setLoading(false);
    window.location.reload();
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Ticket Assignment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Info label="Support Group" value={supportGroup || "Not assigned"} />
        <Info label="Sub Group" value={subGroup || "Not assigned"} />
        <Info label="Resolver Team" value={resolverTeam || "Not assigned"} />
        <Info
          label="Assignment Source"
          value="AI Auto Assignment"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2">
          Assigned Engineer
        </label>

        <select
          value={engineer}
          onChange={(e) => setEngineer(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white"
        >
          <option value="">Select Engineer</option>

          {engineers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={assignEngineer}
        disabled={loading}
        className="mt-5 bg-cyan-500 text-black px-5 py-3 rounded-lg font-semibold disabled:opacity-60"
      >
        {loading ? "Assigning..." : "Assign Engineer"}
      </button>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}