import { NextResponse } from "next/server";
import { GROQ_MODELS, DEFAULT_MODEL } from "@/lib/groq";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    default_model: DEFAULT_MODEL,
    available_models: Object.values(GROQ_MODELS),
    auth_enabled: !!process.env.MY_API_KEY,
    groq_key_set: !!process.env.GROQ_API_KEY,
  });
}
