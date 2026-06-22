import { supabase } from "@/lib/supabase";

export async function getSubscription(organizationId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("organization_id", organizationId)
    .limit(1);

  if (error) {
    console.error("Subscription fetch error:", error.message);
    return null;
  }

  console.log("SUBSCRIPTION DATA:", data);

  return data && data.length > 0 ? data[0] : null;
}