import { supabase } from "@/lib/supabase";

export async function getKnowledgeSuggestion(
  description: string,
  organizationId: string
) {
  if (!organizationId || !description.trim()) return [];

  const keywords = [...new Set(
    description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
  )].slice(0, 5);

  if (keywords.length === 0) return [];

  const orQuery = keywords
    .map((keyword) =>
      `problem_summary.ilike.%${keyword}%,resolution.ilike.%${keyword}%,root_cause.ilike.%${keyword}%`
    )
    .join(",");

  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("*")
    .eq("organization_id", organizationId)
    .or(orQuery)
    .limit(5);

  if (error) {
    console.error("Tenant knowledge suggestion query failed");
    return [];
  }

  return data || [];
}
