export default function MTTRReductionKPI() {
  const previousMTTR = 12;
  const currentMTTR = 8;

  const reduction =
    Math.round(
      ((previousMTTR - currentMTTR) / previousMTTR) * 100
    );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400 text-sm">
        MTTR Reduction
      </p>

      <h2 className="text-3xl font-bold text-green-400 mt-2">
        {reduction}%
      </h2>

      <p className="text-green-400 text-sm mt-2">
        Faster ticket resolution
      </p>
    </div>
  );
}