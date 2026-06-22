"use client";

import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { getCurrentOrganization } from "@/lib/getCurrentOrganization";

export default function HistoricalImportPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileUpload(event: any) {
    setMessage("File selected. Reading CSV...");

    const file = event.target.files[0];

    if (!file) {
      setMessage("No file selected.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data as any[]);
        setMessage(`CSV loaded successfully. Rows: ${results.data.length}`);
      },
      error: (error) => {
        console.error(error);
        setMessage("CSV read error: " + error.message);
      },
    });
  }

  async function handleImport() {
    try {
      setLoading(true);
      setMessage("Import started...");

      if (rows.length === 0) {
        setMessage("Please upload a CSV file first.");
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("User not logged in.");
        setLoading(false);
        return;
      }

      setMessage("User found. Checking organization...");
      
      const org = await getCurrentOrganization(user.id);

      if (!org?.organization_id) {
        setMessage("No organization found for this user.");
        setLoading(false);
        return;
      }

      setMessage("Organization found. Preparing import...");

      const payload = rows.map((row) => ({
        organization_id: org.organization_id,

        ticket_number: row["Request ID"] || null,
        title: row["Description"] || null,
        description: row["Description"] || null,

        category: row["Request Type"] || null,
        sub_category: row["Module"] || null,
        priority: row["Priority"] || null,
        status: null,

        assigned_group: row["Group"] || null,
        assigned_sub_group: row["Module"] || null,
        resolver_team: row["Suggested Team"] || null,

        resolution: row["Recommended Action"] || null,

        request_type: row["Request Type"] || null,
        requester: row["Requester"] || null,
        site: row["Site"] || null,

        sla_name: row["SLA Name"] || null,
        sla_resolution_time: row["SLA resolution time"] || null,
        sla_response_time: row["SLA response time"] || null,
        sla_violated_group: row["SLA violated group"] || null,
        sla_violated_technician: row["SLA violated technician"] || null,

        suggested_team: row["Suggested Team"] || null,
        module: row["Module"] || null,
        probable_rca: row["Probable RCA"] || null,
        confidence: row["Confidence"] || null,
        matched_keywords: row["Matched Keywords"] || null,
        recommended_action: row["Recommended Action"] || null,
        created_month: row["Created Month"] || null,
        sla_risk: row["SLA Risk"] || null,

        created_date: row["Created Time"] || null,
        resolved_date: null,
      }));

      const { error } = await supabase
        .from("historical_tickets")
        .insert(payload);

      if (error) {
        console.error(error);
        setMessage("Import failed: " + error.message);
        setLoading(false);
        return;
      }

      setMessage("Historical tickets imported successfully.");
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setMessage("Unexpected error: " + err.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">
        Historical Ticket Import
      </h1>

      <p className="text-slate-400 mb-6">
        Upload historical ticket dumps for AI training.
      </p>

      <input
  key={rows.length}
  type="file"
  accept=".csv"
  onChange={(e) => {
    handleFileUpload(e);
  }}
  className="mb-6"
/>

      {message && (
        <div className="bg-yellow-500 text-black border border-yellow-300 rounded-xl p-4 mb-6 font-semibold">
          {message}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        Records Loaded: {rows.length}
      </div>

      {rows.length > 0 && (
        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-cyan-500 text-black px-6 py-3 rounded font-semibold mb-6 disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import Tickets"}
        </button>
      )}

      {rows.length > 0 && (
        <div className="overflow-auto border border-slate-800 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-3 text-left">Request ID</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Group</th>
                <th className="p-3 text-left">Suggested Team</th>
              </tr>
            </thead>

            <tbody>
              {rows.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-t border-slate-800">
                  <td className="p-3">{row["Request ID"] || "-"}</td>
                  <td className="p-3">{row["Description"] || "-"}</td>
                  <td className="p-3">{row["Priority"] || "-"}</td>
                  <td className="p-3">{row["Group"] || "-"}</td>
                  <td className="p-3">{row["Suggested Team"] || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}