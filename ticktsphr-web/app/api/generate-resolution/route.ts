import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type ResolutionRequest = {
  description?: unknown;
  category?: unknown;
  rca?: unknown;
};

const FALLBACK_RESOLUTION = `1. Review the ticket description and confirm the affected user/application.
2. Validate user access, configuration, and recent changes.
3. Check application logs and the reported error.
4. Route the ticket to the support team matching its category.
5. Share the findings, resolution status, and next steps with the requester.`;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(req: Request) {
  try {
    let body: ResolutionRequest;

    try {
      body = (await req.json()) as ResolutionRequest;
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const description = cleanText(body.description, 8000);
    const category = cleanText(body.category, 200);
    const rca = cleanText(body.rca, 2000);

    if (!description) {
      return NextResponse.json({ error: "Ticket description is required" }, { status: 400 });
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
            // Cookie writes may be unavailable in a read-only rendering context.
          }
        },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { resolution: FALLBACK_RESOLUTION, source: "fallback" },
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const prompt = `You are an expert ITSM and Oracle Fusion support analyst.

Ticket Description:
${description}

AI Category:
${category || "Not classified"}

Probable RCA:
${rca || "Not available"}

Return only clear numbered resolution steps. Do not claim actions were performed.`;

    const result = await model.generateContent(prompt);
    const resolution = result.response.text().trim();

    if (!resolution) {
      return NextResponse.json(
        { resolution: FALLBACK_RESOLUTION, source: "fallback" },
        { status: 200 }
      );
    }

    return NextResponse.json({ resolution, source: "gemini" });
  } catch {
    console.error("Resolution generation failed");
    return NextResponse.json(
      { resolution: FALLBACK_RESOLUTION, source: "fallback" },
      { status: 200 }
    );
  }
}
