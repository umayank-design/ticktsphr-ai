"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { saveTickets } from "@/lib/saveTickets";

export default function UploadPage() {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [analyzedData, setAnalyzedData] = useState<any[]>([]);
  const [saveMessage, setSaveMessage] = useState("");

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setAnalyzedData([]);
    setSaveMessage("");

    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryData = e.target?.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData as any[]);
    };

    reader.readAsBinaryString(file);
  }

  async function analyzeTickets() {
    const results = data.map((ticket, index) => {
      const text = `${ticket.Subject || ""} ${ticket.Description || ""}`.toLowerCase();

      let category = "General IT";
      let priority = "P3";
      let team = "Service Desk";
      let rca = "Further investigation required";
      let confidence = "72%";

      if (
        text.includes("po") ||
        text.includes("purchase") ||
        text.includes("requisition") ||
        text.includes("approval")
      ) {
        category = "Oracle Procurement";
        priority = "P2";
        team = "Oracle SCM Team";
        rca = "Approval rule, buyer assignment, or procurement setup issue";
        confidence = "91%";
      } else if (
        text.includes("login") ||
        text.includes("password") ||
        text.includes("access")
      ) {
        category = "Access Management";
        priority = "P2";
        team = "IAM Team";
        rca = "User account, role, or password issue";
        confidence = "89%";
      } else if (text.includes("vpn") || text.includes("network")) {
        category = "Network";
        priority = "P2";
        team = "Infrastructure Team";
        rca = "VPN gateway, network connectivity, or firewall issue";
        confidence = "86%";
      } else if (
        text.includes("inventory") ||
        text.includes("item") ||
        text.includes("receipt")
      ) {
        category = "Oracle Inventory";
        priority = "P2";
        team = "Oracle SCM Team";
        rca = "Item setup, receiving setup, or inventory organization issue";
        confidence = "88%";
      }

      return {
        ...ticket,
        "AI Category": category,
        "AI Priority": priority,
        "Assignment Team": team,
        "Probable RCA": rca,
        Confidence: confidence,
      };
    });

    setAnalyzedData(results);

    const ticketsForSupabase = results.map((ticket, index) => ({
      ticket_number:
        ticket["Ticket Number"] ||
        ticket["Ticket ID"] ||
        ticket.ID ||
        `TCK-${index + 1}`,

      customer: ticket.Customer || "Demo Customer",

      description:
        ticket.Description ||
        ticket.Subject ||
        "No description available",

      category: ticket["AI Category"],
      priority: ticket["AI Priority"],
      assignment_team: ticket["Assignment Team"],
      rca: ticket["Probable RCA"],
      confidence: ticket.Confidence,
      status: "Open",
    }));

    try {
      await saveTickets(ticketsForSupabase);
      setSaveMessage("Tickets analyzed and saved to Supabase successfully.");
    } catch (error) {
      console.error(error);
      setSaveMessage("Analysis completed, but saving to Supabase failed.");
    }
  }

  const tableData = analyzedData.length > 0 ? analyzedData : data;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Ticket Upload Center</h1>

      <p className="text-cyan-400 mb-8">
        Upload Excel or CSV ticket dumps for AI analysis
      </p>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
        />

        {fileName && (
          <p className="mt-4 text-green-400">Loaded: {fileName}</p>
        )}

        {data.length > 0 && (
          <button
            onClick={analyzeTickets}
            className="mt-6 bg-cyan-500 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Analyze Tickets
          </button>
        )}

        {saveMessage && (
          <p className="mt-4 text-green-400">{saveMessage}</p>
        )}
      </div>

      {tableData.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800">
                {Object.keys(tableData[0]).map((header) => (
                  <th key={header} className="p-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableData.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-t border-slate-800">
                  {Object.values(row).map((value: any, idx) => (
                    <td key={idx} className="p-3">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}