export default function CustomersPage() {
  const customers = [
    {
      name: "Aster Healthcare",
      industry: "Healthcare",
      plan: "Enterprise",
      status: "Active",
    },
    {
      name: "ABC Manufacturing",
      industry: "Manufacturing",
      plan: "Professional",
      status: "Active",
    },
    {
      name: "XYZ Retail",
      industry: "Retail",
      plan: "Starter",
      status: "Inactive",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        Customer Management
      </h1>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Industry</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.name}
                className="border-t border-slate-800"
              >
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.industry}</td>
                <td className="p-4 text-cyan-400">
                  {customer.plan}
                </td>
                <td className="p-4">{customer.status}</td>
                <td className="p-4">
                  <a
                    href="/customers/aster-healthcare"
                    className="text-cyan-400"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}