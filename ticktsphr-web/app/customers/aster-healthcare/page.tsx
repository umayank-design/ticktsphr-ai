export default function CustomerDetailPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Aster Healthcare
        </h1>

        <p className="text-cyan-400 mt-2">
          Enterprise Customer Profile
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">Subscription</p>
          <h2 className="text-3xl font-bold text-cyan-400">
            Enterprise
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">Users</p>
          <h2 className="text-3xl font-bold text-cyan-400">
            250
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">Tickets Processed</p>
          <h2 className="text-3xl font-bold text-cyan-400">
            8,560
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <p className="text-slate-400">AI Accuracy</p>
          <h2 className="text-3xl font-bold text-cyan-400">
            96%
          </h2>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">
            Integrations
          </h3>

          <ul className="space-y-3">
            <li>✅ Jira Connected</li>
            <li>✅ ServiceNow Connected</li>
            <li>✅ Azure DevOps Connected</li>
            <li>✅ Email Ingestion Active</li>
          </ul>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">
            Ticket Statistics
          </h3>

          <ul className="space-y-3">
            <li>Open Tickets: 124</li>
            <li>Resolved Tickets: 8,436</li>
            <li>Critical Incidents: 3</li>
            <li>Average Resolution Time: 2.4 hrs</li>
          </ul>
        </div>

      </div>
    </main>
  );
}