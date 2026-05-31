import { NextResponse } from "next/server";
import { getGroqClient, DEFAULT_MODEL } from "@/lib/groq";
import { validateApiKey } from "@/lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  const auth = validateApiKey(request);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 401, headers: CORS_HEADERS });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400, headers: CORS_HEADERS });
  }

  const { messages, system, model, max_tokens, stream } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Field 'messages' wajib diisi." }, { status: 400, headers: CORS_HEADERS });
  }

  const groqPayload = {
    model: model || DEFAULT_MODEL,
    messages: system ? [{ role: "system", content: system }, ...messages] : messages,
    max_tokens: max_tokens || 1024,
    temperature: body.temperature ?? 0.7,
  };

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create(groqPayload);
    const choice = completion.choices[0];
    return NextResponse.json({
      id: completion.id,
      model: completion.model,
      message: { role: choice.message.role, content: choice.message.content },
      finish_reason: choice.finish_reason,
      usage: completion.usage,
    }, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    if (err.status === 429) return NextResponse.json({ error: "Rate limit tercapai." }, { status: 429, headers: CORS_HEADERS });
    if (err.status === 401) return NextResponse.json({ error: "GROQ_API_KEY tidak valid." }, { status: 500, headers: CORS_HEADERS });
    return NextResponse.json({ error: "Internal server error.", detail: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}
