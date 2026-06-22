"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getKnowledgeSuggestion } from "@/lib/getKnowledgeSuggestion";
import { logAIInteraction } from "@/lib/logAIInteraction";

const ORGANIZATION_ID = "c5191970-2ce2-498f-8d2b-6193db93a575";

type Stage = "description" | "knowledge" | "site" | "confirm" | "done";

type ChatMessage = {
  sender: "bot" | "user";
  text: string;
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

type SlaRule = {
  response_hours: number;
  resolution_hours: number;
};

export default function ChatTicketPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("description");

  const [description, setDescription] = useState("");
  const [site, setSite] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [knowledgeSuggestion, setKnowledgeSuggestion] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Hi, I’m Ticktsphr AI. Please describe the issue you are facing.",
      },
    ]);
  }, []);

  function addMessage(sender: "bot" | "user", text: string) {
    setMessages((prev) => [...prev, { sender, text }]);
  }

  function safePriority(value?: string) {
    return ["P1", "P2", "P3", "P4"].includes(value || "") ? value! : "P2";
  }

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

  function generateTicketTitle(text: string) {
    const cleaned = text.replace(/\s+/g, " ").trim();
    const lower = cleaned.toLowerCase();

    if (
      lower.includes("purchase requisition") ||
      lower.includes("pr ") ||
      lower.includes("approval")
    ) {
      return "Purchase Requisition Creation Failure Due to Approval Issue";
    }

    if (lower.includes("invoice")) {
      return "Invoice Processing Issue";
    }

    if (lower.includes("receiving") || lower.includes("receipt")) {
      return "Receiving Transaction Failure";
    }

    if (lower.includes("inventory") || lower.includes("stock")) {
      return "Inventory Transaction Issue";
    }

    if (lower.includes("sales order") || lower.includes("order")) {
      return "Sales Order Processing Issue";
    }

    return cleaned.length > 90 ? `${cleaned.slice(0, 87)}...` : cleaned;
  }

  async function predictIssue(issueDescription: string) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || "chat-ticket-user";

    const response = await fetch("/api/predict-classification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: issueDescription,
        userId,
        organizationId: ORGANIZATION_ID,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to predict classification.");
    }

    return data as PredictionResult;
  }

  async function createTicket() {
    if (!prediction) {
      throw new Error("AI prediction is missing.");
    }

    const finalPriority = safePriority(prediction.priority);
    const createdAt = new Date();

    const { data: slaRule, error: slaError } = await supabase.rpc(
      "get_sla_rule_for_ticket",
      {
        org_id: ORGANIZATION_ID,
        ticket_priority: finalPriority,
      }
    );

    if (slaError) {
      throw new Error(slaError.message);
    }

    const rule: SlaRule | undefined = Array.isArray(slaRule)
      ? slaRule[0]
      : slaRule;

    if (!rule) {
      throw new Error("No SLA rule found.");
    }

    const responseDueAt = addHours(
      createdAt,
      Number(rule.response_hours)
    ).toISOString();

    const resolutionDueAt = addHours(
      createdAt,
      Number(rule.resolution_hours)
    ).toISOString();

    const ticketNumber = `TKT-${Date.now()}`;

    const { error: insertError } = await supabase.from("tickets").insert({
      ticket_number: ticketNumber,
      ticket_title: ticketTitle,
      customer: "Chatbot User",
      requester_name: "Chatbot User",
      description,
      priority: finalPriority,
      site,
      status: "Open",
      organization_id: ORGANIZATION_ID,
      source_type: "AI Chatbot",
      source_channel: "Chat",
      ticket_creation_mode: "AI Assisted",

      category: prediction.module || "Unclassified",
      assignment_team: prediction.suggestedTeam || "Pending AI Assignment",
      rca: prediction.probableRca || null,

      ai_category: prediction.module || "Unclassified",
      ai_priority: finalPriority,
      ai_assignment_group: prediction.group || "Unassigned",
      ai_root_cause: prediction.probableRca || null,
      ai_suggested_resolution: prediction.recommendedAction || null,
      ai_confidence: prediction.confidence || 0,

      response_due_at: responseDueAt,
      resolution_due_at: resolutionDueAt,
      sla_status: getSlaStatus(resolutionDueAt),
    });

    if (insertError) {
      console.error("Ticket insert error:", insertError);
      throw new Error(insertError.message);
    }

    return {
      ticketNumber,
      responseHours: rule.response_hours,
      resolutionHours: rule.resolution_hours,
    };
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading || stage === "done") return;

    addMessage("user", text);
    setInput("");

    if (["cancel", "stop", "exit", "close"].includes(text.toLowerCase())) {
      addMessage("bot", "Ticket creation cancelled. No ticket has been created.");

      await logAIInteraction({
        organizationId: ORGANIZATION_ID,
        interactionType: "AI Chat Cancelled",
        userMessage: description || text,
        aiResponse: "Ticket creation cancelled by user",
        outcome: "Cancelled",
      });

      setStage("done");
      return;
    }

    try {
      if (stage === "description") {
        setLoading(true);

        const title = generateTicketTitle(text);
        setDescription(text);
        setTicketTitle(title);

        addMessage(
          "bot",
          "Thanks. I’m analyzing the issue and checking similar incidents..."
        );

        const predicted = await predictIssue(text);
        setPrediction(predicted);

        const suggestions = await getKnowledgeSuggestion(text, ORGANIZATION_ID);
        setKnowledgeSuggestion(suggestions);

        if (suggestions.length > 0) {
          const topSuggestion = suggestions[0];

          const aiResponse = `Knowledge suggestion offered. Recommended Resolution: ${
            topSuggestion.resolution || "No resolution available"
          }`;

          await logAIInteraction({
            organizationId: ORGANIZATION_ID,
            interactionType: "Knowledge Suggestion Offered",
            userMessage: text,
            aiResponse,
            outcome: "Suggestion Offered",
          });

          addMessage(
            "bot",
            `I generated this ticket title:

${title}

AI Analysis:
Module: ${predicted.module}
Priority: ${safePriority(predicted.priority)}
Suggested Team: ${predicted.suggestedTeam}
Probable RCA: ${predicted.probableRca}
Confidence: ${predicted.confidence}%
Matched Tickets: ${predicted.matchedTickets}

Knowledge Base Match Found.

Recommended Resolution:
${topSuggestion.resolution || "No resolution available"}

Did this solve your issue?

Type YES if resolved.
Type NO if you want me to create a ticket.`
          );

          setStage("knowledge");
          return;
        }

        await logAIInteraction({
          organizationId: ORGANIZATION_ID,
          interactionType: "AI Classification",
          userMessage: text,
          aiResponse: `Module: ${predicted.module}, Priority: ${safePriority(
            predicted.priority
          )}, Team: ${predicted.suggestedTeam}`,
          outcome: "No Knowledge Match",
        });

        addMessage(
          "bot",
          `I generated this ticket title:

${title}

AI Analysis:
Module: ${predicted.module}
Priority: ${safePriority(predicted.priority)}
Suggested Team: ${predicted.suggestedTeam}
Probable RCA: ${predicted.probableRca}
Confidence: ${predicted.confidence}%
Matched Tickets: ${predicted.matchedTickets}

No matching knowledge article was found.

Please share the site or location for this issue.`
        );

        setStage("site");
        return;
      }

      if (stage === "knowledge") {
        if (text.toLowerCase() === "yes" || text.toLowerCase() === "y") {
          const topSuggestion = knowledgeSuggestion[0];

          await supabase.from("ticket_avoidance_log").insert({
            organization_id: ORGANIZATION_ID,
            issue_description: description,
            suggested_resolution: topSuggestion?.resolution || null,
            ai_confidence: prediction?.confidence || 0,
            resolved_by_ai: true,
          });

          await logAIInteraction({
            organizationId: ORGANIZATION_ID,
            interactionType: "Knowledge Deflection",
            userMessage: description,
            aiResponse: topSuggestion?.resolution || "Knowledge suggestion accepted",
            outcome: "Ticket Avoided",
          });

          addMessage(
            "bot",
            "Great. The issue was resolved using the Ticktsphr Knowledge Base. No ticket has been created."
          );

          setStage("done");
          return;
        }

        if (text.toLowerCase() === "no" || text.toLowerCase() === "n") {
          await logAIInteraction({
            organizationId: ORGANIZATION_ID,
            interactionType: "Knowledge Deflection",
            userMessage: description,
            aiResponse: "User rejected knowledge suggestion and requested ticket creation",
            outcome: "Proceed To Ticket",
          });

          addMessage(
            "bot",
            "Understood. Please provide the site/location so I can create the ticket."
          );

          setStage("site");
          return;
        }

        addMessage("bot", "Please type YES if resolved, or NO to create a ticket.");
        return;
      }

      if (stage === "site") {
        setSite(text);

        addMessage(
          "bot",
          `Thanks. I am ready to create the ticket.

Title: ${ticketTitle}
Site: ${text}
Priority: ${safePriority(prediction?.priority)}
Team: ${prediction?.suggestedTeam || "Pending AI Assignment"}

Type YES to create the ticket, or Cancel to stop.`
        );

        setStage("confirm");
        return;
      }

      if (stage === "confirm") {
        if (!["yes", "y", "create", "submit"].includes(text.toLowerCase())) {
          addMessage(
            "bot",
            "No ticket has been created. Type YES to create it or Cancel to stop."
          );
          return;
        }

        setLoading(true);
        addMessage("bot", "Creating the ticket now...");

        const result = await createTicket();

        await logAIInteraction({
          organizationId: ORGANIZATION_ID,
          interactionType: "AI Ticket Creation",
          userMessage: description,
          aiResponse: `Ticket created: ${result.ticketNumber}`,
          outcome: "Ticket Created",
        });

        addMessage(
          "bot",
          `Ticket created successfully.

Ticket Number: ${result.ticketNumber}
Title: ${ticketTitle}
Response SLA: ${result.responseHours} hour(s)
Resolution SLA: ${result.resolutionHours} hour(s)`
        );

        setStage("done");
      }
    } catch (error: any) {
      console.error("Chat ticket error:", error);
      addMessage("bot", `Error: ${error.message}`);

      await logAIInteraction({
        organizationId: ORGANIZATION_ID,
        interactionType: "AI Chat Error",
        userMessage: description || text,
        aiResponse: error.message,
        outcome: "Error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Ticktsphr AI Chat Ticket</h1>
        <p className="text-slate-400 mb-6">
          Describe your issue. Ticktsphr AI will classify it, suggest a fix,
          generate a title, calculate SLA, and create a ticket only if needed.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="h-[560px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-2xl px-5 py-4 text-sm ${
                    message.sender === "user"
                      ? "bg-cyan-500 text-black"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-slate-400">
                Ticktsphr AI is thinking...
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 p-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={stage === "done"}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
              placeholder={
                stage === "done"
                  ? "Conversation completed"
                  : stage === "knowledge"
                  ? "Type YES if resolved, or NO to create ticket..."
                  : stage === "confirm"
                  ? "Type YES to create or Cancel to stop..."
                  : "Type your message..."
              }
            />

            <button
              onClick={handleSend}
              disabled={loading || stage === "done"}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-black font-semibold px-6 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          Type Cancel anytime before ticket creation to stop the process.
        </p>
      </div>
    </main>
  );
}