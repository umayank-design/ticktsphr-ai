import { getTopResolutions } from "@/lib/getTopResolutions";

export default async function MostReusedResolutionLeaderboard() {
  const resolutions = await getTopResolutions();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        🏆 Most Reused Resolutions
      </h2>

      <div className="space-y-4">
        {resolutions.map((item: any, index: number) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-slate-800 pb-3"
          >
            <div>
              <p className="font-semibold">
                #{index + 1} {item.title}
              </p>
            </div>

            <div className="text-cyan-400 font-bold">
              {item.resolution_usage_count} Uses
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}