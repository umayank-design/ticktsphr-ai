export default function CostSavedKPI() {
  const hoursSaved = 126;
  const hourlyCost = 1200;

  const savings = hoursSaved * hourlyCost;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400 text-sm">
        Estimated Cost Saved
      </p>

      <h2 className="text-3xl font-bold text-purple-400 mt-2">
        ₹{savings.toLocaleString()}
      </h2>

      <p className="text-green-400 text-sm mt-2">
        AI-driven efficiency
      </p>
    </div>
  );
}