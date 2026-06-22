"use client";

interface ExecutiveSummaryProps {
  tickets: any[];
  articles: any[];
}

export default function ExecutiveSummaryPanel({
  tickets,
  articles,
}: ExecutiveSummaryProps) {
  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const slaRiskTickets = tickets.filter(
    (ticket) =>
      ticket.priority === "P1" ||
      ticket.priority === "P2"
  ).length;

  const categoryCounts = tickets.reduce((acc: any, ticket: any) => {
    const category = ticket.category || "General";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const topCategory =
    Object.entries(categoryCounts).sort(
      (a: any, b: any) => Number(b[1]) - Number(a[1])
    )[0]?.[0] || "N/A";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Executive Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">
            Total Tickets
          </p>
          <p className="text-3xl font-bold text-white">
            {totalTickets}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">
            Open Tickets
          </p>
          <p className="text-3xl font-bold text-yellow-400">
            {openTickets}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">
            Resolved Tickets
          </p>
          <p className="text-3xl font-bold text-green-400">
            {resolvedTickets}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400 text-sm">
            SLA Risk
          </p>
          <p className="text-3xl font-bold text-red-400">
            {slaRiskTickets}
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-white mb-3">
          AI Executive Insight
        </h3>

        <p className="text-slate-300 leading-relaxed">
          Ticktsphr has processed{" "}
          <span className="font-bold text-white">
            {totalTickets}
          </span>{" "}
          tickets. Currently{" "}
          <span className="font-bold text-yellow-400">
            {openTickets}
          </span>{" "}
          remain open while{" "}
          <span className="font-bold text-green-400">
            {resolvedTickets}
          </span>{" "}
          have been resolved.

          The highest volume category is{" "}
          <span className="font-bold text-cyan-400">
            {topCategory}
          </span>
          .

          There are{" "}
          <span className="font-bold text-red-400">
            {slaRiskTickets}
          </span>{" "}
          tickets at risk of SLA breach.

          The knowledge base currently contains{" "}
          <span className="font-bold text-purple-400">
            {articles.length}
          </span>{" "}
          reusable resolutions helping accelerate support operations.
        </p>
      </div>
    </div>
  );
}