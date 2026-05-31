# 🚀 My Groq API

Personal AI Chatbot API — dibangun dengan Next.js, powered by Groq (gratis), deploy ke Vercel.

---

## 📁 Struktur Project

```
groq-api/
├── app/
│   ├── api/
│   │   ├── chat/route.js      ← Endpoint utama POST /api/chat
│   │   └── health/route.js    ← GET /api/health (cek status)
│   ├── layout.js
│   └── page.js                ← Halaman dokumentasi + live tester
├── lib/
│   ├── groq.js                ← Groq client singleton
│   └── auth.js                ← Validasi API key
├── .env.example               ← Template env vars
├── .gitignore
└── package.json
```

---

## ⚡ Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local → isi GROQ_API_KEY dan MY_API_KEY

# 3. Jalankan dev server
npm run dev

# API berjalan di: http://localhost:3000/api/chat
```

---

## 🌐 Deploy ke Vercel

### Cara 1 — Via GitHub (Rekomendasi)
1. Push project ini ke GitHub repo baru
2. Buka vercel.com → New Project → Import repo
3. Di bagian **Environment Variables**, tambahkan:
   - `GROQ_API_KEY` = API key dari console.groq.com
   - `MY_API_KEY` = string rahasia buatan Anda sendiri
4. Klik **Deploy** → selesai!

### Cara 2 — Via CLI
```bash
npm i -g vercel
vercel
# Ikuti prompts, set env vars saat diminta
```

---

## 🔑 Cara Dapat Groq API Key (GRATIS)

1. Daftar di https://console.groq.com
2. Klik **API Keys** → **Create API Key**
3. Copy key → paste ke `GROQ_API_KEY` di env

---

## 📡 Cara Pakai API

### Request
```bash
curl -X POST https://YOUR_VERCEL_URL/api/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_MY_API_KEY" \
  -d '{
    "messages": [{ "role": "user", "content": "Halo!" }],
    "system": "Kamu adalah asisten helpful.",
    "model": "llama3-70b-8192"
  }'
```

### Response
```json
{
  "id": "chatcmpl-xxx",
  "model": "llama3-70b-8192",
  "message": {
    "role": "assistant",
    "content": "Halo! Ada yang bisa saya bantu?"
  },
  "finish_reason": "stop",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 15,
    "total_tokens": 35
  }
}
```

### Multi-turn conversation
```json
{
  "messages": [
    { "role": "user",      "content": "Nama saya Fauzi" },
    { "role": "assistant", "content": "Halo Fauzi! Ada yang bisa dibantu?" },
    { "role": "user",      "content": "Siapa nama saya?" }
  ]
}
```

### Streaming
```json
{
  "messages": [{ "role": "user", "content": "Ceritakan tentang AI" }],
  "stream": true
}
```
Response format: Server-Sent Events (SSE)
```
data: {"delta":"Kecerdasan"}
data: {"delta":" buatan"}
data: {"delta":"..."}
data: [DONE]
```

---

## 🤖 Model Tersedia (Semua GRATIS di Groq)

| Model | Kecepatan | Kecerdasan | Context |
|-------|-----------|------------|---------|
| `llama3-70b-8192` | ⚡⚡ | ⭐⭐⭐⭐⭐ | 8K |
| `llama3-8b-8192`  | ⚡⚡⚡ | ⭐⭐⭐ | 8K |
| `mixtral-8x7b-32768` | ⚡⚡ | ⭐⭐⭐⭐ | 32K |
| `gemma2-9b-it`    | ⚡⚡⚡ | ⭐⭐⭐ | 8K |

---

## ⚠️ Edge Cases & Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `401 Invalid API key` | MY_API_KEY salah | Cek header `x-api-key` |
| `GROQ_API_KEY not set` | Env var kosong | Set di Vercel dashboard |
| `429 Rate limit` | Terlalu banyak request | Tunggu beberapa detik |
| `400 invalid model` | Nama model salah | Cek tabel model di atas |
| Build error di Vercel | Node version | Set Node 18.x di Vercel settings |
