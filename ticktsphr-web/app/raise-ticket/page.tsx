"use client";

import { useEffect, useState } from "react";
import { getCurrentOrganization } from "@/lib/getCurrentOrganization";
import { supabase } from "@/lib/supabase";



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
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [customer, setCustomer] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("P2");
  const [site, setSite] = useState("");

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadOrganization() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setMessage("Please sign in before raising a ticket.");
        return;
      }
      const membership = await getCurrentOrganization(user.id);
      if (!cancelled) {
        if (membership?.organization_id) setOrganizationId(membership.organization_id);
        else setMessage("Your account is not linked to an organization. Contact your administrator.");
      }
    }
    void loadOrganization();
    return () => { cancelled = true; };
  }, []);

  async function handlePredictClassification() {
    if (!organizationId) {
      setMessage("Your account must belong to an organization before requesting AI classification.");
      return;
    }

    if (!description.trim()) {
      setMessage("Please enter ticket description first.");
      return;
    }

    setPredicting(true);
    setMessage("");

    try {
      const response = await fetch("/api/predict-classification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          organizationId,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unexpected prediction error";
      setMessage(`Prediction Error: ${errorMessage}`);
    } finally {
      setPredicting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!organizationId) {
      setMessage("Your account must belong to an organization before creating a ticket.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          customer,
          requesterName,
          description,
          priority,
          site,
          prediction,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create ticket.");

      setMessage(`Ticket Created Successfully. Ticket Number: ${result.ticketNumber}`);
      setCustomer("");
      setRequesterName("");
      setDescription("");
      setPriority("P2");
      setSite("");
      setPrediction(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create ticket.");
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