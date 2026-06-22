import { supabase } from "@/lib/supabase";

export async function getCurrentOrganization(userId: string) {
  console.log("Searching org for user:", userId);

  const { data, error } = await supabase
    .from("organization_members")
    .select("*")
    .eq("user_id", userId);

  console.log("Organization query result:", data);
  console.log("Organization query error:", error);

  if (error) {
    return null;
  }

  return data?.[0] || null;
}