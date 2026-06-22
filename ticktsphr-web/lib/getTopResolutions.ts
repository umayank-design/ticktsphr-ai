import { supabase } from "./supabase";

export async function getTopResolutions() {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .select("id,title,resolution_usage_count")
    .order("resolution_usage_count", { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}