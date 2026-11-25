"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { generateResolution } from "@/lib/resolutionEngine";
import { saveResolutionToKnowledgeBase as saveKnowledgeArticle } from "@/lib/knowledgeBase";
import SimilarIncidents from "@/components/SimilarIncidents";
import DuplicateTickets from "@/components/DuplicateTickets";
import TicketComments from "@/components/TicketComments";
import TicketTimeline from "@/components/TicketTimeline";
import TicketAssignment from "@/components/TicketAssignment";
import TicketStatus from "@/components/TicketStatus";

export default function TicketDetails() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("System");
  const [aiResolution, setAiResolution] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email || "System");
    }

    loadUser();
  }, []);

  useEffect(() => {
    async function loadTicket() {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Ticket fetch error:", error.message);
        return;
      }

      setTicket(data);
    }

    if (id) {
      loadTicket();
    }
  }, [id]);

  async function generateAIResolution() {
    if (!ticket) return;

    setLoading(true);

    try {
      const response = await fetch("/api/generate-resolution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId: ticket.id }),
      });

      const data = await response.json();
      setAiResolution(data.resolution || "Unable to generate resolution.");
    } catch (error) {
      console.error(error);
      setAiResolution("Unable to generate resolution.");
    }

    setLoading(false);
  }

  async function handleSaveToKnowledgeBase() {
    if (!ticket) return;

    if (!aiResolution) {
      alert("Please generate an AI resolution first.");
      return;
    }

    try {
      await saveKnowledgeArticle({
        ...ticket,
        ai_resolution: aiResolution,
        resolution: aiResolution,
        root_cause:
          ticket.ai_root_cause ||
          ticket.rca ||
          ticket.root_cause ||
          "Not available",
      });

      alert("Resolution saved to Knowledge Base successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to save resolution to Knowledge Base.");
    }
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <h1 className="text-3xl font-bold">Loading ticket...</h1>
      </main>
    );
  }

  const module = ticket.ai_category || ticket.category || "General";
  const priority = ticket.ai_priority || ticket.priority || "N/A";
  const assignmentGroup =
    ticket.ai_assignment_group || ticket.assigned_group || "Service Desk";
  const assignmentTeam = ticket.assignment_team || "Not assigned";
  const confidence =
    ticket.ai_confidence !== null && ticket.ai_confidence !== undefined
      ? `${ticket.ai_confidence}%`
      : ticket.confidence || "N/A";
  const probableRca =
    ticket.ai_root_cause || ticket.rca || ticket.root_cause || "Not available";
  const suggestedResolution =
    ticket.ai_suggested_resolution || "No AI suggested resolution saved.";

  const ruleBasedResolution = generateResolution(module);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/tickets" className="text-cyan-400 hover:underline">
            ← Back to Tickets
          </Link>

          <h1 className="text-4xl font-bold mt-4">
            Ticket #{ticket.ticket_number || ticket.id}
          </h1>

          <p className="text-slate-400 mt-2">
            {ticket.title || "Untitled Ticket"}
          </p>
        </div>

        <Link
          href="/knowledge-search"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
        >
          AI Knowledge Search
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h2 className="text-xl font-bold mb-4">Ticket Information</h2>

          <div className="space-y-3">
            <p>
              <strong>Ticket Number:</strong>{" "}
              {ticket.ticket_number || ticket.id}
            </p>

            <p>
              <strong>Requestor:</strong>{" "}
              {ticket.requestor_name || ticket.customer || "N/A"}
            </p>

            <p>
              <strong>Requestor Email:</strong>{" "}
              {ticket.requestor_email || "N/A"}
            </p>

            <p>
              <strong>Status:</strong> {ticket.status || "N/A"}
            </p>

            <p>
              <strong>Priority:</strong> {priority}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {ticket.created_at
                ? new Date(ticket.created_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-cyan-800">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            AI Copilot
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Module:</strong> {module}
            </p>

            <p>
              <strong>Assignment Group:</strong> {assignmentGroup}
            </p>

            <p>
              <strong>Assignment Team:</strong> {assignmentTeam}
            </p>

            <p>
              <strong>AI Priority:</strong> {priority}
            </p>

            <p>
              <strong>AI Confidence:</strong> {confidence}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-6">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="text-slate-300 whitespace-pre-wrap">
          {ticket.description || "No description available"}
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-6">
        <h2 className="text-xl font-bold mb-4">AI Probable RCA</h2>
        <p className="text-cyan-400 whitespace-pre-wrap">{probableRca}</p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-6">
        <h2 className="text-xl font-bold mb-4">AI Suggested Resolution</h2>
        <p className="text-green-400 whitespace-pre-wrap">
          {suggestedResolution}
        </p>
      </div>

      <SimilarIncidents category={module} />

      <DuplicateTickets
        description={ticket.description || ""}
        currentTicketId={ticket.id}
      />

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mt-6">
        <h2 className="text-xl font-bold mb-4">Rule-Based Resolution</h2>

        <pre className="text-green-400 whitespace-pre-wrap">
          {ruleBasedResolution}
        </pre>
      </div>

      {aiResolution && (
        <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500 mt-6">
          <h2 className="text-xl font-bold mb-4">
            OpenAI Generated Resolution
          </h2>

          <pre className="text-cyan-400 whitespace-pre-wrap">
            {aiResolution}
          </pre>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={generateAIResolution}
          disabled={loading}
          className="bg-cyan-500 text-black px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Resolution"}
        </button>

        <button
          onClick={handleSaveToKnowledgeBase}
          className="bg-green-500 text-black px-5 py-3 rounded-lg font-semibold"
        >
          Save to Knowledge Base
        </button>

        <button className="bg-orange-500 text-black px-5 py-3 rounded-lg font-semibold">
          Reclassify Ticket
        </button>

        <button className="bg-red-500 text-white px-5 py-3 rounded-lg font-semibold">
          Escalate
        </button>
      </div>

      <TicketAssignment
        ticketId={ticket.id}
        organizationId={ticket.organization_id}
        supportGroup={ticket.support_group}
        subGroup={ticket.sub_group}
        resolverTeam={ticket.resolver_team}
        assignedEngineer={ticket.assigned_engineer}
      />

      <TicketStatus
        ticketId={ticket.id}
        organizationId={ticket.organization_id}
        currentStatus={ticket.status}
        assignedEngineer={ticket.assigned_engineer}
        userEmail={userEmail}
      />

      <TicketTimeline ticketId={ticket.id} />

      <TicketComments
        ticketId={ticket.id}
        organizationId={ticket.organization_id}
      />
    </main>
  );
}