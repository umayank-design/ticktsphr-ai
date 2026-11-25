import { supabase } from "./supabase";

export async function getTickets(organizationId?: string) {
  let query = supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (organizationId) {
    query = query.eq("organization_id", organizationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Ticket query failed");
    return [];
  }

  return data || [];
}