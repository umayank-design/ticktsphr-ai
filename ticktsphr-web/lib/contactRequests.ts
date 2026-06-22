import { supabase } from "./supabase";

export async function createContactRequest(data: any) {
  const { error } = await supabase
    .from("contact_requests")
    .insert([
      {
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
      },
    ]);

  if (error) {
    console.error("Contact request insert error:", error.message);
    return false;
  }

  return true;
}