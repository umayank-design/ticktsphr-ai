"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getSubscription } from "@/lib/getSubscription";

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    async function loadSubscription() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const organizationId = "c5191970-2ce2-498f-8d2b-6193db93a575";

      const data = await getSubscription(organizationId);

console.log("SUBSCRIPTION:", data);

setSubscription(data);
    }

    loadSubscription();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Billing & Subscription
            </h1>

            <p className="text-slate-400 mt-2">
              Manage Ticktsphr SaaS plan, renewal, usage limits, and billing status.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {!subscription ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400">
              No subscription found for this organization.
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Current Plan</p>
                <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                  {subscription.plan}
                </h2>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Status</p>
                <h2 className="text-3xl font-bold text-green-400 mt-2">
                  {subscription.status}
                </h2>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Monthly Amount</p>
                <h2 className="text-3xl font-bold text-purple-400 mt-2">
                  ₹{Number(subscription.monthly_amount).toLocaleString()}
                </h2>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400 text-sm">Max Users</p>
                <h2 className="text-3xl font-bold text-yellow-400 mt-2">
                  {subscription.max_users}
                </h2>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Subscription Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
                <div>
                  <p className="text-slate-500 text-sm">Plan</p>
                  <p className="text-lg">{subscription.plan}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Status</p>
                  <p className="text-lg">{subscription.status}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Renewal Date</p>
                  <p className="text-lg">
                    {subscription.renewal_date || "Not set"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Monthly Amount</p>
                  <p className="text-lg">
                    ₹{Number(subscription.monthly_amount).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">User Limit</p>
                  <p className="text-lg">
                    {subscription.max_users} users
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Billing Mode</p>
                  <p className="text-lg">
                    Manual / Demo Billing
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-cyan-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400">
                  Starter
                </h3>
                <p className="text-3xl font-bold mt-4">₹4,999</p>
                <p className="text-slate-400 mt-2">per month</p>
                <p className="text-slate-300 mt-4">
                  Basic ticket classification and dashboard access.
                </p>
              </div>

              <div className="bg-slate-900 border border-purple-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-400">
                  Professional
                </h3>
                <p className="text-3xl font-bold mt-4">₹14,999</p>
                <p className="text-slate-400 mt-2">per month</p>
                <p className="text-slate-300 mt-4">
                  AI routing, RCA, knowledge reuse, executive dashboards.
                </p>
              </div>

              <div className="bg-slate-900 border border-yellow-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-400">
                  Enterprise
                </h3>
                <p className="text-3xl font-bold mt-4">Custom</p>
                <p className="text-slate-400 mt-2">annual contract</p>
                <p className="text-slate-300 mt-4">
                  Multi-tenant analytics, SSO, SLA reports, and integrations.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}