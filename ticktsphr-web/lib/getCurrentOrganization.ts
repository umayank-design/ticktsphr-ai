import { supabase } from "@/lib/supabase";

export async function getCurrentOrganization(userId: string) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    // Keep user identifiers and membership data out of browser logs.
    console.error("Unable to load current organization membership");
    return null;
  }

  return data ?? null;
}
