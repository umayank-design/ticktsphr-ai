import { supabase } from "@/lib/supabase";

export async function getCurrentOrganization(userId: string) {
  if (!userId) return null;

  // Fail closed when the user belongs to multiple tenants. Selecting the
  // first row silently can make the UI operate in the wrong organization.
  const { data, error } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .limit(2);

  if (error) {
    console.error("Unable to load current organization membership");
    return null;
  }

  if (!data || data.length !== 1) return null;
  return data[0];
}
