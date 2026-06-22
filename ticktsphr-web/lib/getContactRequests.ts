import { supabase } from "./supabase";

export async function getContactRequests(organizationId?: string) {
  let query = supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Contact requests fetch error:", error.message);
    return [];
  }

  return data || [];
}