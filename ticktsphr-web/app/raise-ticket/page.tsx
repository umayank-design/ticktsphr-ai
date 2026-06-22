"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const ORGANIZATION_ID = "c5191970-2ce2-498f-8d2b-6193db93a575";

type SlaRule = {
  response_hours: number;
  resolution_hours: number;
};

type PredictionResult = {
  module: string;
  group: string;
  suggestedTeam: string;
  priority: string;
  probableRca: string;
  recommendedAction: string;
  confidence: number;
  matchedTickets: number;
};

export default function RaiseTicketPage() {
  const [customer, setCustomer] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("P2");
  const [site, setSite] = useState("");

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function addHours(date: Date, hours: number) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  function getSlaStatus(resolutionDueAt: string) {
    const now = new Date();
    const due = new Date(resolutionDueAt);

    if (now > due) return "Breached";

    const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursLeft <= 2) return "At Risk";

    return "On Track";
  }

  async function handlePredictClassification() {
    if (!description.trim()) {
      setMessage("Please enter ticket description first.");
      return;
    }

    setPredicting(true);
    setMessage("");

    try {
      const { data: userData } = await supabase.auth.getUser();

      const userId =
        userData?.user?.id || "manual-ticket-user";

      const response = await fetch("/api/predict-classification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          userId,
          organizationId: ORGANIZATION_ID,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to predict classification.");
      }

      setPrediction(data);

      if (data.priority && data.priority !== "Unclassified") {
        setPriority(data.priority);
      }
    } catch (error: any) {
      console.error("Prediction Error:", error.message);
      setMessage(`Prediction Error: ${error.message}`);
    } finally {
      setPredicting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const createdAt = new Date();

      const { data: slaRule, error: slaError } = await supabase.rpc(
        "get_sla_rule_for_ticket",
        {
          org_id: ORGANIZATION_ID,
          ticket_priority: priority,
        }
      );

      if (slaError) {
        console.error("SLA RPC Error:", slaError.message);
        throw new Error("Unable to fetch SLA rule.");
      }

      const rule: SlaRule | undefined = Array.isArray(slaRule)
        ? slaRule[0]
        : slaRule;

      if (!rule) {
        throw new Error("No SLA rule found for selected priority.");
      }

      const responseDueAt = addHours(
        createdAt,
        Number(rule.response_hours)
      ).toISOString();

      const resolutionDueAt = addHours(
        createdAt,
        Number(rule.resolution_hours)
      ).toISOString();

      const slaStatus = getSlaStatus(resolutionDueAt);
      const ticketNumber = `TKT-${Date.now()}`;

      const { error: insertError } = await supabase.from("tickets").insert({
        ticket_number: ticketNumber,
        customer,
        requester_name: requesterName,
        description,
        priority,
        site,
        status: "Open",
        organization_id: ORGANIZATION_ID,
        source_type: "Manual",

        category: prediction?.module || "Unclassified",
        assignment_team: prediction?.suggestedTeam || "Pending AI Assignment",
        rca: prediction?.probableRca || null,

        ai_category: prediction?.module || "Unclassified",
        ai_priority: prediction?.priority || priority,
        ai_assignment_group: prediction?.group || "Unassigned",
        ai_root_cause: prediction?.probableRca || null,
        ai_suggested_resolution: prediction?.recommendedAction || null,
        ai_confidence: prediction?.confidence || 0,

        response_due_at: responseDueAt,
        resolution_due_at: resolutionDueAt,
        sla_status: slaStatus,
      });

      if (insertError) {
        console.error("Ticket Insert Error:", insertError.message);
        throw new Error(insertError.message);
      }

      setMessage(`Ticket Created Successfully. Ticket Number: ${ticketNumber}`);

      setCustomer("");
      setRequesterName("");
      setDescription("");
      setPriority("P2");
      setSite("");
      setPrediction(null);
    } catch (error: any) {
      console.error("Raise Ticket Error:", error.message);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Raise Ticket</h1>
        <p className="text-slate-400 mb-8">
          Create a new enterprise support ticket with AI classification and SLA tracking.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5"
          >
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Customer
              </label>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                placeholder="Customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Requester Name
              </label>
              <input
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                placeholder="Requester name"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              >
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
                <option value="P4">P4 - Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Site
              </label>
              <input
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                placeholder="Site / Location"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white min-h-36"
                placeholder="Describe the issue"
                required
              />
            </div>

            <button
              type="button"
              onClick={handlePredictClassification}
              disabled={predicting}
              className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg"
            >
              {predicting ? "Generating AI Suggestions..." : "Get AI Suggestions"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 text-black font-semibold py-3 rounded-lg"
            >
              {loading ? "Creating Ticket..." : "Create Ticket"}
            </button>

            {message && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm">
                {message}
              </div>
            )}
          </form>

          <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>

            {!prediction ? (
              <p className="text-slate-400 text-sm">
                Enter a description and click Get AI Suggestions.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400">Module</p>
                  <p className="font-semibold">{prediction.module}</p>
                </div>

                <div>
                  <p className="text-slate-400">Assignment Group</p>
                  <p className="font-semibold">{prediction.group}</p>
                </div>

                <div>
                  <p className="text-slate-400">Suggested Team</p>
                  <p className="font-semibold">{prediction.suggestedTeam}</p>
                </div>

                <div>
                  <p className="text-slate-400">Suggested Priority</p>
                  <p className="font-semibold">{prediction.priority}</p>
                </div>

                <div>
                  <p className="text-slate-400">Probable RCA</p>
                  <p className="font-semibold">{prediction.probableRca}</p>
                </div>

                <div>
                  <p className="text-slate-400">Recommended Action</p>
                  <p className="font-semibold">{prediction.recommendedAction}</p>
                </div>

                <div>
                  <p className="text-slate-400">Confidence</p>
                  <p className="font-semibold">{prediction.confidence}%</p>
                </div>

                <div>
                  <p className="text-slate-400">Matched Tickets</p>
                  <p className="font-semibold">{prediction.matchedTickets}</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}