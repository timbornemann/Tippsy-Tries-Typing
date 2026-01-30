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

// Fallback text if API fails or key is missing
const getFallbackText = (stageId: number, subLevelId: number): string => {
  if (subLevelId === 5) return "Das ist die Meisterprüfung für diesen Level. Viel Erfolg!";
  switch (stageId) {
    case 1: return "f j j f f j f j j f f j j f j f";
    case 2: return "df jk fd kj df jk dd ff jj kk";
    default: return "Der schnelle braune Fuchs springt über den faulen Hund.";
  }
};

export const generateLevelContent = async (stage: Stage, subLevelId: number): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    return getFallbackText(stage.id, subLevelId);
  }

  let promptModifier = "";
  let lengthConstraint = "ca. 30 Zeichen";

  switch (subLevelId) {
    case 1:
      promptModifier = "Erstelle einfache Wiederholungen und simple Muster. Fokus auf Rhythmus.";
      lengthConstraint = "ca. 20 Zeichen";
      break;
    case 2:
      promptModifier = "Erstelle abwechselnde Kombinationen der Buchstaben.";
      lengthConstraint = "ca. 30 Zeichen";
      break;
    case 3:
      promptModifier = "Bilde, wenn möglich, silbenartige Strukturen oder kurze Pseudowörter.";
      lengthConstraint = "ca. 40 Zeichen";
      break;
    case 4:
      promptModifier = "Erhöhe die Komplexität. Zufälligere Abfolgen, die Konzentration erfordern.";
      lengthConstraint = "ca. 50 Zeichen";
      break;
    case 5:
      promptModifier = "Dies ist die MEISTERPRÜFUNG. Erstelle einen zusammenhängenden Text (oder sehr komplexe Muster), der alles Gelernte abprüft.";
      lengthConstraint = "ca. 100 Zeichen";
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Du bist ein Generator für Schreibtrainer-Übungen. 
      Basis-Anweisung: ${stage.basePrompt}
      Level-Spezifisch: ${promptModifier}
      Länge: ${lengthConstraint}
      
      Regeln:
      1. Gib NUR den reinen Text zurück, keine Anführungszeichen, keine Markdown-Formatierung.
      2. Achte streng darauf, welche Buchstaben erlaubt sind (außer in höheren Stages wo alles erlaubt ist).
      3. Keine Nummerierung.
      4. Sprache: Deutsch (Wörter bevorzugt, wenn mit den Buchstaben möglich).
      `,
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    
    // Clean up potentially weird output
    return text.replace(/```/g, '').replace(/\n/g, ' ').trim();
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return getFallbackText(stage.id, subLevelId);
  }
};