import type { SupabaseClient } from "@supabase/supabase-js";

type HistoricalTicket = {
  module: string | null;
  assigned_group: string | null;
  suggested_team: string | null;
  priority: string | null;
  probable_rca: string | null;
  recommended_action: string | null;
};

export type PredictionResult = {
  module: string;
  group: string;
  suggestedTeam: string;
  priority: string;
  probableRca: string;
  recommendedAction: string;
  confidence: number;
  matchedTickets: number;
};

const EMPTY_PREDICTION: PredictionResult = {
  module: "Unclassified",
  group: "Unassigned",
  suggestedTeam: "Unassigned",
  priority: "Unassigned",
  probableRca: "No recommendation available",
  recommendedAction: "No recommendation available",
  confidence: 0,
  matchedTickets: 0,
};

function mostFrequent(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (value?.trim()) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  const winner = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    value: winner?.[0] ?? "Unclassified",
    count: winner?.[1] ?? 0,
  };
}

function mostFrequentText(values: Array<string | null | undefined>) {
  return mostFrequent(values).value === "Unclassified"
    ? "No recommendation available"
    : mostFrequent(values).value;
}

function buildKeywords(description: string): string[] {
  const stopWords = new Set([
    "is", "am", "are", "the", "a", "an", "to", "for", "in", "on",
    "of", "and", "or", "not", "getting", "unable", "please", "kindly",
    "issue", "error",
  ]);

  return [...new Set(
    description
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 1 && !stopWords.has(word))
  )].slice(0, 6);
}

export async function predictClassification(
  supabase: SupabaseClient,
  description: string,
  organizationId: string
): Promise<PredictionResult> {
  if (!organizationId.trim() || !description.trim()) {
    return EMPTY_PREDICTION;
  }

  const keywords = buildKeywords(description);
  if (keywords.length === 0) {
    return EMPTY_PREDICTION;
  }

  const orQuery = keywords
    .map((keyword) =>
      [
        `description.ilike.%${keyword}%`,
        `module.ilike.%${keyword}%`,
        `probable_rca.ilike.%${keyword}%`,
        `recommended_action.ilike.%${keyword}%`,
        `suggested_team.ilike.%${keyword}%`,
        `assigned_group.ilike.%${keyword}%`,
        `matched_keywords.ilike.%${keyword}%`,
      ].join(",")
    )
    .join(",");

  const { data, error } = await supabase
    .from("historical_tickets")
    .select(
      "module, assigned_group, suggested_team, priority, probable_rca, recommended_action"
    )
    .eq("organization_id", organizationId)
    .or(orQuery)
    .limit(50);

  if (error || !data?.length) {
    // Do not log tenant identifiers or raw database errors.
    if (error) console.error("Historical ticket classification query failed");
    return EMPTY_PREDICTION;
  }

  const matches = data as HistoricalTicket[];
  const modulePrediction = mostFrequent(matches.map((ticket) => ticket.module));

  return {
    module: modulePrediction.value,
    group: mostFrequent(matches.map((ticket) => ticket.assigned_group)).value,
    suggestedTeam: mostFrequent(matches.map((ticket) => ticket.suggested_team)).value,
    priority: mostFrequent(matches.map((ticket) => ticket.priority)).value,
    probableRca: mostFrequentText(matches.map((ticket) => ticket.probable_rca)),
    recommendedAction: mostFrequentText(matches.map((ticket) => ticket.recommended_action)),
    confidence: Math.round((modulePrediction.count / matches.length) * 100),
    matchedTickets: matches.length,
  };
}
