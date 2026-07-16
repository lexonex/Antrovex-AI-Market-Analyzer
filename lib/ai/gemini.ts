/**
 * Gemini AI client singleton
 */

import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env";
import { AI_CONFIG } from "../config/ai";
import { logger } from "../logger/logger";
import { AppError, ErrorCode } from "../utils/errors";

class GeminiClient {
  private static instance: GeminiClient;
  private ai: GoogleGenAI | null = null;

  private constructor() {}

  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    return GeminiClient.instance;
  }

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      if (!config.gemini.apiKey) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "GEMINI_API_KEY is missing");
      }
      this.ai = new GoogleGenAI({
        apiKey: config.gemini.apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return this.ai;
  }

  public async analyzeChart(imageBase64: string, prompt: string): Promise<string> {
    const ai = this.getClient();
    
    try {
      const response = await ai.models.generateContent({
        model: AI_CONFIG.MODEL,
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        },
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini");
      }

      return responseText;
    } catch (error: any) {
      logger.error("Gemini API Error", error);
      if (error.message?.includes("quota") || error.status === 429) {
        throw new AppError(ErrorCode.AI_SERVICE_ERROR, "AI service quota exceeded. Please try again later.", 503);
      }
      throw new AppError(ErrorCode.AI_SERVICE_ERROR, `Failed to analyze chart: ${error.message}`, 500);
    }
  }
}

export const geminiClient = GeminiClient.getInstance();
