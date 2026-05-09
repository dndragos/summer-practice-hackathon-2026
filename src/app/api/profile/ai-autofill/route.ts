import { NextResponse } from "next/server";

// Keyword-based local fallback for when no AI API key is configured
const SPORT_KEYWORDS: Record<string, string[]> = {
  Football:     ["football", "soccer", "fotbal"],
  Basketball:   ["basketball", "baschet", "hoops", "nba"],
  Tennis:       ["tennis", "tenis"],
  Volleyball:   ["volleyball", "volei", "volley"],
  Running:      ["running", "runner", "jogging", "alergare", "run"],
  Swimming:     ["swimming", "inot", "swimmer"],
  Padel:        ["padel"],
  "Table Tennis": ["ping pong", "table tennis", "tenis de masa"],
  Cycling:      ["cycling", "bike", "ciclism", "bicycle"],
  Badminton:    ["badminton"],
};

const SKILL_KEYWORDS: Record<string, string[]> = {
  Beginner:     ["beginner", "incepator", "new", "learning", "just started", "noob"],
  Intermediate: ["intermediate", "mediu", "decent", "ok", "average", "recreational"],
  Advanced:     ["advanced", "avansat", "experienced", "good", "great"],
  Pro:          ["pro", "professional", "expert", "elite", "competitive", "very good"],
};

function localExtract(text: string): { sportName: string; skillLevel: string }[] {
  const lower = text.toLowerCase();
  const results: { sportName: string; skillLevel: string }[] = [];

  // Detect skill level from full text
  let detectedSkill = "Intermediate"; // default
  for (const [level, keywords] of Object.entries(SKILL_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      detectedSkill = level;
      break;
    }
  }

  for (const [sport, keywords] of Object.entries(SPORT_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      results.push({ sportName: sport, skillLevel: detectedSkill });
    }
  }

  return results;
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GITHUB_MODELS_API_KEY || process.env.OPENAI_API_KEY;

    // If no API key, use the local keyword extractor
    if (!apiKey) {
      const data = localExtract(text);
      return NextResponse.json(data);
    }

    // Use real AI when key is available
    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.AI_BASE_URL || "https://models.github.ai/inference",
    });

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
    console.error("AI Autofill Error:", error);
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
  }
}
