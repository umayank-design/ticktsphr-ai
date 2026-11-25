import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const COLUMNS = [
  "ticket_number",
  "customer",
  "requester_name",
  "description",
  "priority",
  "status",
  "category",
  "assignment_team",
  "created_at",
  "response_due_at",
  "resolution_due_at",
  "sla_status",
] as const;

function csvCell(value: unknown): string {
  let text = value == null ? "" : String(value);
  // Prevent spreadsheet formula execution when a CSV is opened in Excel/Sheets.
  if (/^[\s]*[=+@]/.test(text) || /^[\s]*-/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

export async function GET(request: Request) {
  try {
    const organizationId = new URL(request.url).searchParams.get("organizationId")?.trim();
    if (!organizationId || organizationId.length > 128) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: "Authentication service is not configured" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Cookie updates may not be possible in read-only contexts.
          }
        },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (membershipError) {
      console.error("Report membership validation failed");
      return NextResponse.json({ error: "Unable to validate organization access" }, { status: 500 });
    }
    if (!membership) {
      return NextResponse.json({ error: "You do not have access to this organization" }, { status: 403 });
    }

    const { data: tickets, error } = await supabase
      .from("tickets")
      .select(COLUMNS.join(","))
      .eq("organization_id", membership.organization_id)
      .order("created_at", { ascending: false })
      .limit(10000);

    if (error) {
      console.error("Ticket report query failed");
      return NextResponse.json({ error: "Unable to export ticket report" }, { status: 500 });
    }

    const lines = [
      COLUMNS.map(csvCell).join(","),
      ...(tickets ?? []).map((ticket) => {
        const row = ticket as unknown as Record<string, unknown>;
        return COLUMNS.map((column) => csvCell(row[column])).join(",");
      }),
    ];
    return new Response("\uFEFF" + lines.join("\r\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="ticktsphr-ticket-report.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    console.error("Report export failed");
    return NextResponse.json({ error: "Unable to export ticket report" }, { status: 500 });
  }
}
