import { supabase } from "@/lib/supabase";

export async function logAIInteraction({
  organizationId,
  interactionType,
  userMessage,
  aiResponse,
  outcome,
}: {
  organizationId: string;
  interactionType: string;
  userMessage: string;
  aiResponse: string;
  outcome: string;
}) {
  const { error } = await supabase.from("ai_interactions").insert({
    organization_id: organizationId,
    interaction_type: interactionType,
    user_message: userMessage,
    ai_response: aiResponse,
    outcome,
  });

  if (error) {
    console.error("AI interaction log error:", error.message);
  }
}