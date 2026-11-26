
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { predictClassification } from "@/lib/predictClassification";

type PredictionRequest = {
  description?: unknown;
  organizationId?: unknown;
};

export async function POST(req: Request) {
  try {
    let body: PredictionRequest;

    try {
      body = (await req.json()) as PredictionRequest;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const organizationId =
      typeof body.organizationId === "string"
        ? body.organizationId.trim()
        : "";

    if (!description || description.length > 8000) {
      return NextResponse.json(
        { error: "Ticket description must be between 1 and 8000 characters" },
        { status: 400 }
      );
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Authentication service is not configured" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Cookie updates may be unavailable in some rendering contexts.
            }
          },
        },
      }
    );

    // Verify the authenticated user using Supabase Auth.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Confirm the authenticated user belongs to the requested tenant.
    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (membershipError) {
      console.error("Organization membership validation failed");

      return NextResponse.json(
        { error: "Unable to validate organization access" },
        { status: 500 }
      );
    }

    if (!membership) {
      return NextResponse.json(
        { error: "You do not have access to this organization" },
        { status: 403 }
      );
    }

    // Never trust a user ID supplied by the browser.
    const prediction = await predictClassification(
      supabase,
      description,
      membership.organization_id
    );

    return NextResponse.json(prediction);
  } catch {
    console.error("Prediction request failed");

    return NextResponse.json(
      { error: "Unable to predict classification" },
      { status: 500 }
    );
  }
}
