// lib/groq.js
// Singleton Groq client — diinisialisasi sekali, reused di semua request
import Groq from "groq-sdk";

let client;

export function getGroqClient() {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY environment variable is not set.");
    }
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

// Model-model Groq yang tersedia (gratis)
export const GROQ_MODELS = {
  LLAMA3_8B:   "llama3-8b-8192",       // Tercepat, ringan
  LLAMA3_70B:  "llama3-70b-8192",      // Paling pintar
  MIXTRAL:     "mixtral-8x7b-32768",   // Context window besar (32k)
  GEMMA2_9B:   "gemma2-9b-it",         // Google Gemma 2
};

// Default model yang dipakai
export const DEFAULT_MODEL = GROQ_MODELS.LLAMA3_70B;
