import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDemoRequests } from "@/lib/getDemoRequests";
import { getContactRequests } from "@/lib/getContactRequests";
import LogoutButton from "@/components/LogoutButton";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function formatDate(date: string) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .single();

  const organizationId = member?.organization_id;

  const demoRequests = await getDemoRequests(organizationId);
  const contactRequests = await getContactRequests(organizationId);

  const totalDemoRequests = demoRequests.length;
  const totalContactRequests = contactRequests.length;
  const totalLeads = totalDemoRequests + totalContactRequests;

  const latestDemo = demoRequests[0];
  const latestContact = contactRequests[0];

  const latestLead =
    latestDemo && latestContact
      ? new Date(latestDemo.created_at) > new Date(latestContact.created_at)
        ? latestDemo
        : latestContact
      : latestDemo || latestContact;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <p className="text-cyan-400 font-semibold mb-3">
                  Founder CRM
                </p>

                <h1 className="text-5xl font-bold mb-4">
                  Lead Intelligence Dashboard
                </h1>

                <p className="text-slate-400">
                  Track demo requests, contact inquiries and website-generated leads
                  from one internal dashboard.
                </p>
              </div>

              <LogoutButton />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 mb-2">Demo Requests</p>
              <h2 className="text-4xl font-bold text-cyan-400">
                {totalDemoRequests}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Product demo leads
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 mb-2">Contact Requests</p>
              <h2 className="text-4xl font-bold text-cyan-400">
                {totalContactRequests}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                General inquiries
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 mb-2">Total Leads</p>
              <h2 className="text-4xl font-bold text-cyan-400">
                {totalLeads}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Website generated
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 mb-2">Lead Source</p>
              <h2 className="text-3xl font-bold text-cyan-400">
                Website
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Organic SaaS funnel
              </p>
            </div>
          </div>

          {/* Latest Lead */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-cyan-400 font-semibold mb-3">
                  Latest Lead
                </p>

                <h2 className="text-3xl font-bold mb-3">
                  {latestLead?.name || "No leads yet"}
                </h2>

                <p className="text-slate-400">
                  {latestLead
                    ? `${latestLead.company || "Company not provided"} • ${
                        latestLead.email || "Email not provided"
                      }`
                    : "Once visitors submit demo or contact forms, the latest lead will appear here."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <p className="text-slate-500 text-sm">Date</p>
                  <h3 className="font-semibold mt-1">
                    {latestLead ? formatDate(latestLead.created_at) : "N/A"}
                  </h3>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <p className="text-slate-500 text-sm">Status</p>
                  <h3 className="font-semibold mt-1 text-cyan-400">
                    New Lead
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Requests */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">
                  Recent Demo Requests
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Leads who requested a Ticktsphr product demo.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Company</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Team Size</th>
                    <th className="p-4 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {demoRequests.length === 0 ? (
                    <tr>
                      <td className="p-6 text-slate-500" colSpan={6}>
                        No demo requests found.
                      </td>
                    </tr>
                  ) : (
                    demoRequests.map((request: any) => (
                      <tr
                        key={request.id}
                        className="border-b border-slate-800 hover:bg-slate-800/40"
                      >
                        <td className="p-4">{request.name}</td>
                        <td className="p-4">{request.company || "N/A"}</td>
                        <td className="p-4 text-cyan-400">{request.email}</td>
                        <td className="p-4">{request.role || "N/A"}</td>
                        <td className="p-4">{request.team_size || "N/A"}</td>
                        <td className="p-4">
                          {formatDate(request.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact Requests */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold">
                Recent Contact Requests
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                General inquiries from the Contact page.
              </p>
            </div>

            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Company</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Message</th>
                    <th className="p-4 text-left">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {contactRequests.length === 0 ? (
                    <tr>
                      <td className="p-6 text-slate-500" colSpan={5}>
                        No contact requests found.
                      </td>
                    </tr>
                  ) : (
                    contactRequests.map((request: any) => (
                      <tr
                        key={request.id}
                        className="border-b border-slate-800 hover:bg-slate-800/40"
                      >
                        <td className="p-4">{request.name}</td>
                        <td className="p-4">{request.company || "N/A"}</td>
                        <td className="p-4 text-cyan-400">{request.email}</td>
                        <td className="p-4 max-w-md truncate">
                          {request.message || "N/A"}
                        </td>
                        <td className="p-4">
                          {formatDate(request.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}