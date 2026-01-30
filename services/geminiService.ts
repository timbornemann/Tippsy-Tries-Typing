import { GoogleGenAI } from "@google/genai";
import { Level } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Fallback text if API fails or key is missing
const getFallbackText = (levelId: number): string => {
  switch (levelId) {
    case 1: return "f j j f f j f j j f f j j f j f";
    case 2: return "df jk fd kj df jk dd ff jj kk";
    case 3: return "ls df jk sl ld ks sl dk fj ls";
    default: return "Der schnelle braune Fuchs springt über den faulen Hund.";
  }
};

export const generateLevelContent = async (level: Level): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    return getFallbackText(level.id);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Du bist ein Generator für Schreibtrainer-Übungen. 
      ${level.prompt}
      
      Regeln:
      1. Gib NUR den reinen Text zurück, keine Anführungszeichen, keine Markdown-Formatierung.
      2. Achte streng darauf, welche Buchstaben erlaubt sind (außer in höheren Levels).
      3. Keine Nummerierung der Sätze.
      4. Text sollte fließend tippbar sein.
      `,
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    
    // Clean up potentially weird output
    return text.replace(/```/g, '').replace(/\n/g, ' ').trim();
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return getFallbackText(level.id);
  }
};