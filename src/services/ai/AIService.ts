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
      model: "gemini-flash-latest",
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
    
    return JSON.parse(text);
  }
}

export const aiService = AIService.getInstance();
