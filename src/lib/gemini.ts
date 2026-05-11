import { GoogleGenerativeAI } from "@google/generative-ai";

// Single Gemini client instance — import this everywhere Gemini is needed
export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
