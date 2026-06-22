"use client";

interface Props {
  tickets: any[];
}

export default function PredictiveForecast({
  tickets,
}: Props) {
  const totalTickets = tickets.length;

  const predictedTickets = Math.round(
    totalTickets * 1.15
  );

  const predictedResolved = Math.round(
    predictedTickets * 0.93
  );

  const predictedMTTR = 6.2;
  const categoryCounts = tickets.reduce((acc: any, ticket: any) => {
  const category = ticket.category || "General IT";

  acc[category] = (acc[category] || 0) + 1;

  return acc;
}, {});

const topCategories = Object.entries(categoryCounts)
  .sort((a: any, b: any) => Number(b[1]) - Number(a[1]))
  .slice(0, 3);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Predictive Ticket Forecast
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-slate-400">
            Expected Tickets
          </p>

          <h3 className="text-4xl font-bold text-cyan-400 mt-2">
            {predictedTickets}
          </h3>
        </div>

        <div>
          <p className="text-slate-400">
            Expected Resolved
          </p>

          <h3 className="text-4xl font-bold text-green-400 mt-2">
            {predictedResolved}
          </h3>
        </div>

        <div>
          <p className="text-slate-400">
            Predicted MTTR
          </p>

          <h3 className="text-4xl font-bold text-purple-400 mt-2">
            {predictedMTTR} hrs
          </h3>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-3">
          Confidence Score
        </h3>

        <div className="w-full bg-slate-800 rounded-full h-4">
          <div
            className="bg-cyan-500 h-4 rounded-full"
            style={{ width: "87%" }}
          />
        </div>

        <p className="text-cyan-400 mt-2">
          87% confidence
        </p>
        <div className="mt-8">
  <h3 className="font-semibold mb-3">
    Top Predicted Categories
  </h3>

  <div className="space-y-2">
    {topCategories.map((item: any, index: number) => (
      <div
        key={item[0]}
        className="flex justify-between bg-slate-800 p-3 rounded-lg"
      >
        <span>
          {index + 1}. {item[0]}
        </span>

        <span className="text-cyan-400">
          {item[1]} tickets
        </span>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}