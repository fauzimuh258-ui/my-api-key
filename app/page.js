// app/page.js
// Halaman dokumentasi API yang tampil di root URL
"use client";
import { useState, useEffect } from "react";

const ENDPOINT = "/api/chat";

export default function DocsPage() {
  const [health, setHealth]   = useState(null);
  const [testing, setTesting] = useState(false);
  const [result, setResult]   = useState(null);
  const [apiKey, setApiKey]   = useState("");
  const [prompt, setPrompt]   = useState("Halo! Siapa kamu?");

  useEffect(() => {
    fetch("/api/health").then(r => r.json()).then(setHealth);
  }, []);

  async function runTest() {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch(ENDPOINT, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          system: "Kamu adalah asisten AI yang helpful. Jawab dalam Bahasa Indonesia.",
        }),
      });
      const data = await res.json();
      setResult({ status: res.status, data });
    } catch (e) {
      setResult({ status: "error", data: { error: e.message } });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", background: "#0d0d0d", minHeight: "100vh", color: "#e2e8f0", padding: "40px 20px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: health?.groq_key_set ? "#22c55e" : "#ef4444", boxShadow: `0 0 8px ${health?.groq_key_set ? "#22c55e" : "#ef4444"}` }} />
            <span style={{ color: "#64748b", fontSize: 13 }}>{health ? "API ONLINE" : "Checking..."}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-1px" }}>My Groq API</h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>Personal AI API · Powered by Groq · Deployed on Vercel</p>
        </div>

        {/* Status */}
        {health && (
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: 16, marginBottom: 32, fontSize: 13 }}>
            <div style={{ color: "#64748b", marginBottom: 8 }}>SYSTEM STATUS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["Default Model", health.default_model],
                ["Auth Enabled", health.auth_enabled ? "✅ Yes" : "⚠️ Disabled"],
                ["Groq Key", health.groq_key_set ? "✅ Set" : "❌ Missing"],
                ["Timestamp", new Date(health.timestamp).toLocaleTimeString()],
              ].map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: "#64748b" }}>{k}: </span>
                  <span style={{ color: "#a78bfa" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endpoint Docs */}
        <Section title="ENDPOINT">
          <EndpointBadge method="POST" path="/api/chat" />
          <EndpointBadge method="GET"  path="/api/health" />
        </Section>

        <Section title="REQUEST BODY">
          <CodeBlock>{`{
  "messages": [
    { "role": "user", "content": "Halo!" }
  ],
  "system":     "Kamu adalah asisten helpful.",  // opsional
  "model":      "llama3-70b-8192",               // opsional
  "max_tokens": 1024,                            // opsional (default: 1024)
  "temperature": 0.7,                            // opsional (default: 0.7)
  "stream":     false                            // opsional (default: false)
}`}</CodeBlock>
        </Section>

        <Section title="AVAILABLE MODELS">
          {health?.available_models.map(m => (
            <div key={m} style={{ color: "#22d3ee", fontSize: 13, marginBottom: 4 }}>→ {m}</div>
          ))}
        </Section>

        <Section title="AUTHENTICATION">
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Kirim API key Anda di header:</p>
          <CodeBlock>x-api-key: your_secret_key</CodeBlock>
        </Section>

        <Section title="CURL EXAMPLE">
          <CodeBlock>{`curl -X POST https://YOUR_DOMAIN/api/chat \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_KEY" \\
  -d '{
    "messages": [{ "role": "user", "content": "Jelaskan apa itu Next.js" }],
    "system": "Jawab singkat dalam Bahasa Indonesia."
  }'`}</CodeBlock>
        </Section>

        {/* Live Tester */}
        <Section title="LIVE API TESTER">
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 4 }}>API KEY (kosongkan jika auth disabled)</label>
            <input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="your_secret_key"
              style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: "#64748b", fontSize: 12, marginBottom: 4 }}>PROMPT</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 6, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={runTest}
            disabled={testing}
            style={{ background: testing ? "#1e293b" : "#6d28d9", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", cursor: testing ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600 }}
          >
            {testing ? "Sending..." : "▶ Send Request"}
          </button>

          {result && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: result.status === 200 ? "#22c55e" : "#ef4444", fontSize: 12, marginBottom: 8 }}>
                STATUS: {result.status}
              </div>
              <CodeBlock>{JSON.stringify(result.data, null, 2)}</CodeBlock>
            </div>
          )}
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ color: "#475569", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function EndpointBadge({ method, path }) {
  const colors = { POST: "#7c3aed", GET: "#0891b2" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ background: colors[method], color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{method}</span>
      <code style={{ color: "#e2e8f0", fontSize: 14 }}>{path}</code>
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "14px 16px", overflow: "auto", fontSize: 12, color: "#94a3b8", margin: 0 }}>
      {children}
    </pre>
  );
}
