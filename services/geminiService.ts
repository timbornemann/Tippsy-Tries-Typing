import { GoogleGenAI } from "@google/genai";
import { Stage } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Fallback text if API fails
const getFallbackText = (): string => {
  return "Der schnelle braune Fuchs springt über den faulen Hund. Übung macht den Meister.";
};

/**
 * Generates content SPECIFICALLY for the "Practice Mode" (Üben)
 * This is only called after a user has mastered the stage.
 */
export const generatePracticeContent = async (stage: Stage): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    return getFallbackText();
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Du bist ein Generator für Schreibtrainer-Übungen.
      
      Kontext: Der Nutzer hat die Stufe "${stage.name}" gemeistert.
      Erlaubte Zeichen/Thema: ${stage.basePrompt}
      Modus: Übungsmodus (Endless/Practice).
      
      Aufgabe:
      Erstelle einen abwechslungsreichen Text.
      - Länge: ca. 200 - 300 Zeichen.
      - Nutze Wörter, wenn möglich (Deutsch).
      - Wenn die Stufe nur wenige Buchstaben hat (z.B. f, j, d, k), erstelle sinnvolle Muster oder Pseudowörter, die gut fließen.
      - Keine Nummerierung, keine Anführungszeichen am Anfang/Ende.
      - Format: Reiner Text.
      `,
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    
    // Clean up potentially weird output
    return text.replace(/```/g, '').replace(/\n/g, ' ').trim();
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return getFallbackText();
  }
};