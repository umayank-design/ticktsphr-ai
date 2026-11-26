import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CreateTicketBody = {
  organizationId?: unknown;
  customer?: unknown;
  requesterName?: unknown;
  description?: unknown;
  priority?: unknown;
  site?: unknown;
  prediction?: {
    module?: unknown;
    suggestedTeam?: unknown;
    group?: unknown;
    probableRca?: unknown;
    recommendedAction?: unknown;
    confidence?: unknown;
  } | null;
};

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    let body: CreateTicketBody;
    try {
      body = (await request.json()) as CreateTicketBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const organizationId = text(body.organizationId, 128);
    const customer = text(body.customer, 200);
    const requesterName = text(body.requesterName, 200);
    const description = text(body.description, 8000);
    const site = text(body.site, 200);
    const priority = text(body.priority, 2);
    if (!organizationId || !customer || !description || !["P1", "P2", "P3", "P4"].includes(priority)) {
      return NextResponse.json({ error: "Organization, customer, description, and valid priority are required" }, { status: 400 });
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
      console.error("Ticket creation membership validation failed");
      return NextResponse.json({ error: "Unable to validate organization access" }, { status: 500 });
    }
    if (!membership) {
      return NextResponse.json({ error: "You do not have access to this organization" }, { status: 403 });
    }

    const { data: slaData, error: slaError } = await supabase.rpc("get_sla_rule_for_ticket", {
      org_id: membership.organization_id,
      ticket_priority: priority,
    });
    if (slaError) {
      console.error("Ticket creation SLA lookup failed");
      return NextResponse.json({ error: "Unable to determine SLA policy" }, { status: 500 });
    }

    const slaRule = Array.isArray(slaData) ? slaData[0] : slaData;
    if (!slaRule) {
      return NextResponse.json({ error: "No SLA policy is configured for this priority" }, { status: 422 });
    }

    const responseHours = Number(slaRule.response_hours);
    const resolutionHours = Number(slaRule.resolution_hours);
    if (!Number.isFinite(responseHours) || !Number.isFinite(resolutionHours) || responseHours <= 0 || resolutionHours <= 0 || responseHours > 8760 || resolutionHours > 8760) {
      console.error("Ticket creation received an invalid SLA rule");
      return NextResponse.json({ error: "The configured SLA policy is invalid" }, { status: 500 });
    }

    const createdAt = new Date();
    const responseDueAt = new Date(createdAt.getTime() + responseHours * 3600000).toISOString();
    const resolutionDueAt = new Date(createdAt.getTime() + resolutionHours * 3600000).toISOString();
    const hoursLeft = (new Date(resolutionDueAt).getTime() - createdAt.getTime()) / 3600000;
    const slaStatus = hoursLeft <= 2 ? "At Risk" : "On Track";
    const prediction = body.prediction ?? {};
    const ticketNumber = `TKT-${createdAt.getTime()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const { error: insertError } = await supabase.from("tickets").insert({
      ticket_number: ticketNumber,
      customer,
      requester_name: requesterName,
      description,
      priority,
      site,
      status: "Open",
      organization_id: membership.organization_id,
      source_type: "Manual",
      category: text(prediction.module, 100) || "Unclassified",
      assignment_team: text(prediction.suggestedTeam, 200) || "Pending AI Assignment",
      rca: text(prediction.probableRca, 2000) || null,
      ai_category: text(prediction.module, 100) || "Unclassified",
      ai_priority: priority,
      ai_assignment_group: text(prediction.group, 200) || "Unassigned",
      ai_root_cause: text(prediction.probableRca, 2000) || null,
      ai_suggested_resolution: text(prediction.recommendedAction, 4000) || null,
      ai_confidence: typeof prediction.confidence === "number" && Number.isFinite(prediction.confidence)
        ? Math.max(0, Math.min(100, prediction.confidence))
        : 0,
      response_due_at: responseDueAt,
      resolution_due_at: resolutionDueAt,
      sla_status: slaStatus,
    });

    if (insertError) {
      console.error("Ticket insert failed");
      return NextResponse.json({ error: "Unable to create ticket" }, { status: 500 });
    }

    return NextResponse.json({ success: true, ticketNumber }, { status: 201 });
  } catch {
    console.error("Ticket creation request failed");
    return NextResponse.json({ error: "Unable to create ticket" }, { status: 500 });
  }
}
