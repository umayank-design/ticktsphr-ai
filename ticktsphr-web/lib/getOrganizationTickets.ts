import { supabase } from "@/lib/supabase";
import { getCurrentOrganization } from "@/lib/getCurrentOrganization";

export async function getOrganizationTickets(userId: string) {
  const org = await getCurrentOrganization(userId);

  if (!org) return [];

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("organization_id", org.organization_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return data || [];
}