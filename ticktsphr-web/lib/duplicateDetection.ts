import { getTickets } from "./getTickets";

export async function findDuplicateTickets(
  description: string,
  currentTicketId?: string
) {
  const tickets = await getTickets();

  const searchWords = description
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2);

  const matches = tickets
    .filter(
      (ticket: any) =>
        String(ticket.id) !== String(currentTicketId)
    )
    .map((ticket: any) => {
      const ticketText = `
        ${ticket.description || ""}
        ${ticket.category || ""}
        ${ticket.rca || ""}
      `.toLowerCase();

      let score = 0;

      searchWords.forEach((word) => {
        if (ticketText.includes(word)) {
          score += 10;
        }
      });

      return {
        ...ticket,
        match_score: Math.min(score, 100),
      };
    })
    .filter((ticket: any) => ticket.match_score > 20)
    .sort(
      (a: any, b: any) =>
        b.match_score - a.match_score
    )
    .slice(0, 5);

  return matches;
}