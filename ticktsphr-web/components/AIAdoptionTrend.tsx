"use client";

export default function AIAdoptionTrend() {
  const monthlyData = [
    { month: "Jan", adoption: 12 },
    { month: "Feb", adoption: 24 },
    { month: "Mar", adoption: 38 },
    { month: "Apr", adoption: 55 },
    { month: "May", adoption: 72 },
    { month: "Jun", adoption: 89 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        AI Adoption Trend
      </h2>

      <div className="space-y-4">
        {monthlyData.map((item) => (
          <div key={item.month}>
            <div className="flex justify-between mb-1">
              <span>{item.month}</span>
              <span>{item.adoption}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3">
              <div
                className="bg-cyan-500 h-3 rounded-full"
                style={{ width: `${item.adoption}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm mt-6">
        Shows month-over-month growth of AI-assisted ticket resolution.
      </p>
    </div>
  );
}