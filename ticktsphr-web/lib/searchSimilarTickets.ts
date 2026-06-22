import { supabase } from "@/lib/supabase";
import { getCurrentOrganization } from "@/lib/getCurrentOrganization";

export async function searchSimilarTickets(
  userId: string,
  searchText: string
) {
  const org = await getCurrentOrganization(userId);

  if (!org?.organization_id) {
    return [];
  }

  const cleanSearch = searchText.trim();

  const { data, error } = await supabase
    .from("historical_tickets")
    .select("*")
    .eq("organization_id", org.organization_id)
    .or(
      `description.ilike.%${cleanSearch}%,module.ilike.%${cleanSearch}%,probable_rca.ilike.%${cleanSearch}%,recommended_action.ilike.%${cleanSearch}%,suggested_team.ilike.%${cleanSearch}%,assigned_group.ilike.%${cleanSearch}%`
    )
    .limit(30);

  if (error) {
    console.error("Similar ticket search error:", error.message);
    return [];
  }

  return data || [];
}