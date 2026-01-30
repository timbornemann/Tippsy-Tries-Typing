import { 
  MEISTERKLASSE_TEXTS, 
  PROFI_TEXTS, 
  CODER_TEXTS 
} from './patternGenerator';
import { 
  MEISTERKLASSE_SENTENCES, 
  PROFI_SENTENCES, 
  CODER_SENTENCES,
  SENTENCES_DB,
  generateWordSentenceLevel
} from './wordSentenceGenerator';
import { Stage } from '../types';

/**
 * Service to mix all available content types for Endless Mode (Stage 15).
 * Sources:
 * 1. Pattern Text Paragraphs (Meisterklasse, Profi, Coder)
 * 2. Word/Sentence Arrays (Sentences, Code bits)
 * 3. Generated Random Sentences (from default word list)
 */

export const getRandomChunk = (): string => {
  // Strategy:
  // 40% Chance: Text Paragraph (Long content)
  // 40% Chance: Sentence Array Item (Medium content, single sentence/line)
  // 20% Chance: Generated Sentence Chunk (Random word mix)

  const rand = Math.random();

  if (rand < 0.4) {
    // 1. Text Paragraphs
    const allTexts = [...MEISTERKLASSE_TEXTS, ...PROFI_TEXTS, ...CODER_TEXTS];
    const text = allTexts[Math.floor(Math.random() * allTexts.length)];
    // Return a slightly modified version to avoid exact repetition if possible,
    // or just return as is.
    return text;

  } else if (rand < 0.8) {
    // 2. Sentence Arrays
    // We mix all sentence sources
    const allSentences = [
      ...MEISTERKLASSE_SENTENCES,
      ...PROFI_SENTENCES,
      ...CODER_SENTENCES,
      ...SENTENCES_DB
    ];
    // Return a "block" of 2-3 sentences to make it a worthy chunk
    const count = 2 + Math.floor(Math.random() * 2);
    let chunk = "";
    for(let i=0; i<count; i++) {
        const s = allSentences[Math.floor(Math.random() * allSentences.length)];
        chunk += (i > 0 ? " " : "") + s;
    }
    return chunk;

  } else {
    // 3. Generated Random Content
    // We mock a Stage 15 object to generate a "Level"
    // Stage 15 has all chars unlocked
    const mockStage: Stage = {
      id: 15,
      name: "Endless",
      description: "Endless Mode",
      basePrompt: "Type forever",
      newChars: [],
      chars: [
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        'ä','ö','ü','ß',
        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
        'Ä','Ö','Ü',
        '1','2','3','4','5','6','7','8','9','0',
        '.',',','!','?','-','_',':',';','(',')','[',']','{','}','@','€','$','%','&','/','\\','*','+','=','<','>','|','\'','"'
      ],
      color: "gray"
    };
    
    // Generate a short "level" which is effectively a paragraph of random words
    return generateWordSentenceLevel(mockStage);
  }
};
