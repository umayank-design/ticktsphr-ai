export default function AIAccuracyKPI() {
  const accuracy = 92;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400 text-sm">
        AI Classification Accuracy
      </p>

      <h2 className="text-3xl font-bold text-cyan-400 mt-2">
        {accuracy}%
      </h2>

      <p className="text-green-400 text-sm mt-2">
        +8% vs previous month
      </p>
    </div>
  );
}