import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type ResolutionRequest = { ticketId?: unknown };

const FALLBACK_RESOLUTION = `1. Review the ticket description and confirm the affected user/application.
2. Validate user access, configuration, and recent changes.
3. Check application logs and the reported error.
4. Route the ticket to the support team matching its category.
5. Share the findings, resolution status, and next steps with the requester.`;

export async function POST(req: Request) {
  try {
    let body: ResolutionRequest;
    try {
      body = (await req.json()) as ResolutionRequest;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
    if (!ticketId || ticketId.length > 128) {
      return NextResponse.json({ error: "A valid ticket ID is required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Authentication service is not configured" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Cookie writes may be unavailable in read-only rendering contexts.
          }
        },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Fetch the source ticket; never accept its description or tenant from the caller.
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("id, organization_id, description, ai_category, category, ai_root_cause, rca")
      .eq("id", ticketId)
      .maybeSingle();

    if (ticketError) {
      console.error("Ticket authorization lookup failed");
      return NextResponse.json({ error: "Unable to verify ticket access" }, { status: 500 });
    }
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .eq("organization_id", ticket.organization_id)
      .maybeSingle();

    if (membershipError) {
      console.error("Ticket organization membership validation failed");
      return NextResponse.json({ error: "Unable to verify organization access" }, { status: 500 });
    }
    if (!membership) {
      return NextResponse.json({ error: "You do not have access to this ticket" }, { status: 403 });
    }

    const description = typeof ticket.description === "string" ? ticket.description.trim().slice(0, 8000) : "";
    if (!description) {
      return NextResponse.json({ error: "Ticket has no description to resolve" }, { status: 400 });
    }

    const category = (ticket.ai_category || ticket.category || "Not classified").toString().slice(0, 200);
    const rca = (ticket.ai_root_cause || ticket.rca || "Not available").toString().slice(0, 2000);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ resolution: FALLBACK_RESOLUTION, source: "fallback" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const prompt = `You are an expert ITSM and Oracle Fusion support analyst.

Ticket Description:
${description}

AI Category:
${category}

Probable RCA:
${rca}

Return only clear numbered resolution steps. Do not claim actions were performed.`;

    const result = await model.generateContent(prompt);
    const resolution = result.response.text().trim();
    return NextResponse.json({
      resolution: resolution || FALLBACK_RESOLUTION,
      source: resolution ? "gemini" : "fallback",
    });
  } catch {
    console.error("Resolution generation failed");
    return NextResponse.json({ resolution: FALLBACK_RESOLUTION, source: "fallback" });
  }
}
