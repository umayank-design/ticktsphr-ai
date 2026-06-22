export type SlaStatus = "On Track" | "At Risk" | "Breached";

export function addHoursToDate(baseDate: Date, hours: number): Date {
  const result = new Date(baseDate);
  result.setHours(result.getHours() + hours);
  return result;
}

export function calculateResponseDueDate(createdAt: string | Date, responseHours: number): Date {
  return addHoursToDate(new Date(createdAt), responseHours);
}

export function calculateResolutionDueDate(createdAt: string | Date, resolutionHours: number): Date {
  return addHoursToDate(new Date(createdAt), resolutionHours);
}

export function getSlaStatus(resolutionDueAt: string | Date | null): SlaStatus {
  if (!resolutionDueAt) return "On Track";

  const now = new Date();
  const due = new Date(resolutionDueAt);

  if (now > due) return "Breached";

  const totalMs = due.getTime() - now.getTime();
  const hoursRemaining = totalMs / (1000 * 60 * 60);

  if (hoursRemaining <= 2) return "At Risk";

  return "On Track";
}
