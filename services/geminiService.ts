
import { GoogleGenAI, Type } from "@google/genai";
import { VibeResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVibe = async (base64Image: string): Promise<VibeResult> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a social media trend expert and creative writer for Gen Z and Millennial audiences.
    Your task is to analyze the provided image and generate perfectly styled captions and hashtags.
    
    Return a JSON object with:
    1. 'vibe': A short (2-3 word) description of the image's energy.
    2. 'captions': An array of 4 objects, each with 'style' (Short, Witty, Professional, Aesthetic) and 'text'.
    3. 'hashtags': An array of 15 trending, relevant hashtags.
    
    Ensure the captions are engaging, emoji-inclusive, and contextually aware of the image content.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
        { text: "Analyze this image and generate creative social media content." },
      ],
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vibe: { type: Type.STRING },
          captions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                style: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ["style", "text"],
            },
          },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["vibe", "captions", "hashtags"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) throw new Error("Failed to generate content.");
  
  return JSON.parse(resultText) as VibeResult;
};
