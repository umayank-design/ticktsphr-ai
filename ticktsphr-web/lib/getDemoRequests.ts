import { supabase } from "./supabase";

export async function getDemoRequests(organizationId?: string) {
  let query = supabase
    .from("demo_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Demo request query failed");
    return [];
  }

  return data || [];
}