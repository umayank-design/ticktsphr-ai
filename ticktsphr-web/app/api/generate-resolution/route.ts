import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, category, rca } = body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found");
    }

    console.log(
      "Gemini Key Loaded:",
      process.env.GEMINI_API_KEY.substring(0, 10)
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
});
    const prompt = `
You are an expert ITSM and Oracle Fusion support analyst.

Ticket Description:
${description}

AI Category:
${category}

Probable RCA:
${rca}

Return only clear numbered resolution steps.
`;

    const result = await model.generateContent(prompt);
    const resolution = result.response.text();

    return NextResponse.json({ resolution, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini resolution error:", error);

    return NextResponse.json({
      resolution: `
1. Review the ticket description and confirm the affected user/application.
2. Validate user access, configuration, and recent changes.
3. Check application logs and error messages.
4. Assign the ticket to the correct support team based on category.
5. Update the requester with resolution status and next steps.

Probable fallback resolution generated because Gemini API failed.
`,
      source: "mock-fallback",
      error: error.message || "Failed to generate resolution",
    });
  }
}