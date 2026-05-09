import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GITHUB_MODELS_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://models.github.ai/inference",
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const prompt = `You are a sports skill extractor. Given the following raw text from a user, extract their preferred sports and their skill level for each sport. 
Map the skill level to one of the following exact strings: "Beginner", "Intermediate", "Advanced", "Pro".
Return ONLY a valid JSON array of objects. Do NOT wrap it in markdown. Do NOT add any extra text. 
Example Output:
[{"sportName": "Basketball", "skillLevel": "Intermediate"}]

Raw Text:
"${text}"
`;

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let rawJson = response.choices[0].message.content?.trim() || "[]";
    if (rawJson.startsWith("```json")) {
        rawJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
    } else if (rawJson.startsWith("```")) {
        rawJson = rawJson.replace(/```/g, "").trim();
    }

    const data = JSON.parse(rawJson);

    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenAI Autofill Error:", error);
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
  }
}
