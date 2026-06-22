import { supabase } from "@/lib/supabase";

export async function getKnowledgeSuggestion(
  description: string,
  organizationId: string
) {
  const keywords = description
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 3)
    .slice(0, 5);

  const orQuery = keywords
    .map(
      (k) =>
        `problem_summary.ilike.%${k}%,resolution.ilike.%${k}%,root_cause.ilike.%${k}%`
    )
    .join(",");

  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .or(orQuery)
    .limit(5);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}