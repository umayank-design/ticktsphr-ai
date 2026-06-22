import { supabase } from "./supabase";

export async function saveTickets(tickets: any[]) {
  const { data, error } = await supabase
    .from("tickets")
    .insert(tickets)
    .select();

  if (error) {
    console.error("Supabase save error:", error);
    throw error;
  }

  return data;
}