import { NextResponse } from "next/server";
import { predictClassification } from "@/lib/predictClassification";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { description, userId, organizationId } = body;

    if (!userId || !organizationId) {
      return NextResponse.json(
        { error: "User ID or Organization ID missing" },
        { status: 400 }
      );
    }

    const prediction = await predictClassification(
      userId,
      description,
      organizationId
    );

    return NextResponse.json(prediction);
  } catch (error: any) {
    console.error("Predict classification API error:", error.message);

    return NextResponse.json(
      { error: "Unable to predict classification" },
      { status: 500 }
    );
  }
}