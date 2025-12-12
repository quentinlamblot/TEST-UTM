import { GoogleGenAI, Type } from "@google/genai";
import { AiSuggestion } from "../types";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real scenario, we handle missing keys gracefully in the UI.

const ai = new GoogleGenAI({ apiKey });

export const generateUtmSuggestions = async (videoTitle: string, platformContext: string): Promise<AiSuggestion[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return [];
  }

  try {
    const prompt = `
      I am a video creator. I have a video titled "${videoTitle}". 
      I plan to post this on "${platformContext || 'social media'}".
      
      Please suggest 3 distinct sets of UTM parameters (source, medium, campaign) that would be effective for tracking this link.
      
      - Source should be the platform (e.g., twitter, linkedin, newsletter).
      - Medium should be the delivery method (e.g., social, email, cpc).
      - Campaign should be a snake_case short code derived from the title.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              medium: { type: Type.STRING },
              campaign: { type: Type.STRING },
              reasoning: { type: Type.STRING, description: "Short explanation why this fits." }
            },
            required: ["source", "medium", "campaign"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const suggestions = JSON.parse(jsonText) as AiSuggestion[];
    return suggestions;

  } catch (error) {
    console.error("Error generating UTM suggestions:", error);
    return [];
  }
};