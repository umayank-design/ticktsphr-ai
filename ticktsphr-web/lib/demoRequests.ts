import { supabase } from "./supabase";

export async function createDemoRequest(data: any) {
  const { error } = await supabase
    .from("demo_requests")
    .insert([
      {
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.role,
        team_size: data.teamSize,
        message: data.message,
      },
    ]);

  if (error) {
  console.error("Demo request insert error:", error.message);
  return false;
}

  return true;
}