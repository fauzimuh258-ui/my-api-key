// lib/auth.js
// Validasi API key dari header request
// API key disimpan di env var MY_API_KEY (Anda tentukan sendiri)

export function validateApiKey(request) {
  const apiKey = request.headers.get("x-api-key");

  // Jika MY_API_KEY tidak di-set di env, skip auth (mode development)
  if (!process.env.MY_API_KEY) {
    console.warn("⚠️  MY_API_KEY not set. Auth is disabled (dev mode).");
    return { valid: true };
  }

  if (!apiKey) {
    return { valid: false, error: "Missing x-api-key header." };
  }

  if (apiKey !== process.env.MY_API_KEY) {
    return { valid: false, error: "Invalid API key." };
  }

  return { valid: true };
}
