export default function HoursSavedKPI() {
  const ticketsAutoResolved = 42;
  const avgMinutesSaved = 18;

  const hoursSaved =
    Math.round((ticketsAutoResolved * avgMinutesSaved) / 60);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <p className="text-slate-400 text-sm">
        Hours Saved
      </p>

      <h2 className="text-3xl font-bold text-yellow-400 mt-2">
        {hoursSaved}
      </h2>

      <p className="text-slate-400 text-sm mt-2">
        Productivity gain
      </p>
    </div>
  );
}