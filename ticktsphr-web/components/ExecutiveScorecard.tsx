"use client";

interface ExecutiveScorecardProps {
  tickets: any[];
  articles: any[];
}

export default function ExecutiveScorecard({
  tickets,
  articles,
}: ExecutiveScorecardProps) {
  const totalTickets = tickets.length;

  const resolvedTickets = tickets.filter(
    (t) => t.status === "Resolved"
  ).length;

  const resolutionRate =
    totalTickets > 0
      ? Math.round((resolvedTickets / totalTickets) * 100)
      : 0;

  const knowledgeArticles = articles.length;

  const knowledgeReuse =
    knowledgeArticles > 0
      ? Math.min(95, knowledgeArticles * 5)
      : 0;

  const aiAccuracy = 92;

  const mttrReduction = 34;

  const overallScore = Math.round(
    (aiAccuracy +
      mttrReduction +
      knowledgeReuse +
      resolutionRate) /
      4
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Executive Scorecard
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>AI Accuracy</span>
          <span className="text-cyan-400">
            {aiAccuracy}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Resolution Rate</span>
          <span className="text-green-400">
            {resolutionRate}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Knowledge Reuse</span>
          <span className="text-yellow-400">
            {knowledgeReuse}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>MTTR Improvement</span>
          <span className="text-purple-400">
            {mttrReduction}%
          </span>
        </div>

        <hr className="border-slate-700" />

        <div className="flex justify-between text-xl font-bold">
          <span>Overall Score</span>

          <span
            className={
              overallScore >= 85
                ? "text-green-400"
                : overallScore >= 70
                ? "text-yellow-400"
                : "text-red-400"
            }
          >
            {overallScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}