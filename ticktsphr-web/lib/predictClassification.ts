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

function getMostFrequent(values: string[]) {
  const counts: Record<string, number> = {};

  values
    .filter(Boolean)
    .forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return {
    value: sorted[0]?.[0] || "Unclassified",
    count: sorted[0]?.[1] || 0,
  };
}
function getMostFrequentText(values: string[]) {
  const counts: Record<string, number> = {};

  values
    .filter(Boolean)
    .forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

  const sorted = Object.entries(counts).sort(
    (a, b) => b[1] - a[1]
  );

  return sorted[0]?.[0] || "No recommendation available";
}

function buildKeywords(description: string) {
  const stopWords = [
    "is",
    "am",
    "are",
    "the",
    "a",
    "an",
    "to",
    "for",
    "in",
    "on",
    "of",
    "and",
    "or",
    "not",
    "getting",
    "unable",
    "please",
    "kindly",
    "issue",
    "error",
  ];

  return description
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length > 1)
    .filter((word) => !stopWords.includes(word))
    .slice(0, 6);
}

export async function predictClassification(
  userId: string,
  description: string,
  organizationId: string
): Promise<PredictionResult> {
  try {
    console.log("Prediction User ID:", userId);
    console.log("Prediction Org ID:", organizationId);

    if (!organizationId) {
      return {
        module: "Unclassified",
        group: "Unassigned",
        suggestedTeam: "Unassigned",
        confidence: 0,
        matchedTickets: 0,
      };
    }

    const keywords = buildKeywords(description);

    console.log("Search Keywords:", keywords);

    if (keywords.length === 0) {
      return {
        module: "Unclassified",
        group: "Unassigned",
        suggestedTeam: "Unassigned",
        confidence: 0,
        matchedTickets: 0,
      };
    }

    const orQuery = keywords
      .map(
        (keyword) =>
          `description.ilike.%${keyword}%,module.ilike.%${keyword}%,probable_rca.ilike.%${keyword}%,recommended_action.ilike.%${keyword}%,suggested_team.ilike.%${keyword}%,assigned_group.ilike.%${keyword}%,matched_keywords.ilike.%${keyword}%`
      )
      .join(",");

    const { data, error } = await supabase
  .from("historical_tickets")
  .select(
    `
    module,
    assigned_group,
    suggested_team,
    priority,
    probable_rca,
    recommended_action,
    matched_keywords
  `
  )
      .eq("organization_id", organizationId)
      .or(orQuery)
      .limit(50);

    console.log("Matches Found:", data?.length);
    console.log("Query Error:", error);

    if (error) {
      return {
        module: "Unclassified",
        group: "Unassigned",
        suggestedTeam: "Unassigned",
        confidence: 0,
        matchedTickets: 0,
      };
    }

    const matches = data || [];

    if (matches.length === 0) {
      return {
        module: "Unclassified",
        group: "Unassigned",
        suggestedTeam: "Unassigned",
        confidence: 0,
        matchedTickets: 0,
      };
    }

    const modulePrediction = getMostFrequent(
      matches.map((m: any) => m.module)
    );

    const groupPrediction = getMostFrequent(
      matches.map((m: any) => m.assigned_group)
    );

    const teamPrediction = getMostFrequent(
      matches.map((m: any) => m.suggested_team)
    );
    const priorityPrediction = getMostFrequent(
  matches.map((m: any) => m.priority)
);
    const probableRcaPrediction = getMostFrequentText(
  matches.map((m: any) => m.probable_rca)
);

const recommendedActionPrediction = getMostFrequentText(
  matches.map((m: any) => m.recommended_action)
);

    const confidence = Math.round(
      (modulePrediction.count / matches.length) * 100
    );

    return {
  module: modulePrediction.value,
  group: groupPrediction.value,
  suggestedTeam: teamPrediction.value,
  priority: priorityPrediction.value,
  probableRca: probableRcaPrediction,
  recommendedAction: recommendedActionPrediction,
  confidence,
  matchedTickets: matches.length,
};
  } catch (err) {
    console.error("Prediction error:", err);

    return {
      module: "Unclassified",
      group: "Unassigned",
      suggestedTeam: "Unassigned",
      confidence: 0,
      matchedTickets: 0,
    };
  }
}