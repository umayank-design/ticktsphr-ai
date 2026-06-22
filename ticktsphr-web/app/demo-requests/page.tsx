import Navbar from "@/components/Navbar";
import { getDemoRequests } from "@/lib/getDemoRequests";

export default async function DemoRequestsPage() {
  const requests = await getDemoRequests();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold mb-8">
            Demo Requests
          </h1>

          <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Company</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Team Size</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request: any) => (
                  <tr
                    key={request.id}
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">{request.name}</td>
                    <td className="p-4">{request.company}</td>
                    <td className="p-4">{request.email}</td>
                    <td className="p-4">{request.role}</td>
                    <td className="p-4">{request.team_size}</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      </main>
    </>
  );
}