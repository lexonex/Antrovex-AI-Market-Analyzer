/**
 * Analysis OS v6 - AI Service
 */

import { GoogleGenAI } from "@google/genai";

export class AIService {
  private static instance: AIService;
  private ai: GoogleGenAI | null = null;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing");
      }
      this.ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return this.ai;
  }

  public async generateJson(imageBase64: string, prompt: string): Promise<any> {
    const ai = this.getClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    try {
      // Direct parse attempt
      return JSON.parse(text.trim());
    } catch (e) {
      // Robust extraction fallback
      const cleaned = this.extractJson(text);
      try {
        return JSON.parse(cleaned);
      } catch (innerE) {
        console.error("AIService: Failed to parse JSON even after cleaning", {
          error: innerE,
          text: text.substring(0, 500) + "..."
        });
        throw new Error(`Invalid JSON response from AI: ${innerE instanceof Error ? innerE.message : String(innerE)}`);
      }
    }
  }

  private extractJson(text: string): string {
    // 1. Try markdown code block extraction
    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      return markdownMatch[1].trim();
    }

    // 2. Find the first '{' or '[' and matching last '}' or ']'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');

    let start = -1;
    let end = -1;

    // Determine which structure starts first and ends last
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      start = firstBrace;
      end = lastBrace;
    } else if (firstBracket !== -1) {
      start = firstBracket;
      end = lastBracket;
    }

    if (start !== -1 && end !== -1 && end > start) {
      return text.substring(start, end + 1).trim();
    }

    return text.trim();
  }
}

export const aiService = AIService.getInstance();
