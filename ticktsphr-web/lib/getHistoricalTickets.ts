import { supabase } from "@/lib/supabase";
import { getCurrentOrganization } from "@/lib/getCurrentOrganization";

export async function getHistoricalTickets(userId: string) {
  const org = await getCurrentOrganization(userId);

  if (!org?.organization_id) {
    return [];
  }

  const { data, error } = await supabase
    .from("historical_tickets")
    .select("*")
    .eq("organization_id", org.organization_id)
    .order("imported_at", { ascending: false });

  if (error) {
    console.error("Historical ticket query failed");
    return [];
  }

  return data || [];
}