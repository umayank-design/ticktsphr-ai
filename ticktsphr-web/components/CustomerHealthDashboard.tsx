"use client";

export default function CustomerHealthDashboard() {
  const customers = [
    {
      name: "Aster Healthcare",
      score: 92,
      status: "Healthy",
    },
    {
      name: "ABC Manufacturing",
      score: 81,
      status: "Good",
    },
    {
      name: "XYZ Retail",
      score: 68,
      status: "Needs Attention",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Customer Health Dashboard
      </h2>

      <div className="space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.name}
            className="bg-slate-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {customer.name}
                </h3>

                <p className="text-slate-400 text-sm">
                  Customer Health Score
                </p>
              </div>

              <div className="text-right">
                <p
                  className={
                    customer.score >= 85
                      ? "text-green-400 text-2xl font-bold"
                      : customer.score >= 70
                      ? "text-yellow-400 text-2xl font-bold"
                      : "text-red-400 text-2xl font-bold"
                  }
                >
                  {customer.score}
                </p>

                <p className="text-slate-400 text-sm">
                  {customer.status}
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
              <div
                className={
                  customer.score >= 85
                    ? "bg-green-500 h-3 rounded-full"
                    : customer.score >= 70
                    ? "bg-yellow-500 h-3 rounded-full"
                    : "bg-red-500 h-3 rounded-full"
                }
                style={{
                  width: `${customer.score}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}