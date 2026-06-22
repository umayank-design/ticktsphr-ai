export default function CustomerDetailPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Customer Details</h1>
      <p className="text-cyan-400 mb-8">Manage customer users, plan, usage and integrations.</p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Aster Healthcare</h2>
        <p>Industry: Healthcare</p>
        <p>Plan: Enterprise</p>
        <p>Status: Active</p>
      </div>
    </main>
  );
}
