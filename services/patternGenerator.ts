import { Stage } from '../types';

// Helper to get allowed chars if the stage config is empty (e.g. Stage 9/10)
const getAllowedChars = (stage: Stage): string[] => {
  if (stage.chars.length > 0) return stage.chars.filter(c => c !== ' ');

  // Fallbacks for advanced stages defined in constants but having empty char arrays
  // In a real app, these should probably be explicitly defined in constants.ts
  if (stage.id === 9) { // Uppercase
    return ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M'];
  }
  if (stage.id === 10) { // Punctuation/Numbers
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '-', '?', '!'];
  }
  return ['f', 'j']; // Fallback
};

const getRandomChar = (chars: string[]) => chars[Math.floor(Math.random() * chars.length)];

export const generatePatternLevel = (stage: Stage, subLevelId: number): string => {
  const chars = getAllowedChars(stage);
  const pool = chars.length > 0 ? chars : ['f', 'j'];
  
  let result = [];
  const targetLength = subLevelId === 5 ? 150 : 20 + (subLevelId * 10); // Level 5 is longer (Master)

  // Difficulty Algorithms
  switch (subLevelId) {
    case 1: // Intro: Simple Repetition (e.g. f f f j j j)
      for (let i = 0; i < 6; i++) {
        const c = getRandomChar(pool);
        result.push(c, c, c); // Triplets
      }
      break;

    case 2: // Pairs & Alternating (e.g. fj jf ff jj)
      for (let i = 0; i < 10; i++) {
        const c1 = getRandomChar(pool);
        const c2 = getRandomChar(pool);
        result.push(c1 + c2);
        result.push(c2 + c1);
      }
      break;

    case 3: // Short Random Groups (3-4 chars)
      for (let i = 0; i < 10; i++) {
        let group = "";
        for (let j = 0; j < 3 + Math.floor(Math.random() * 2); j++) {
           group += getRandomChar(pool);
        }
        result.push(group);
      }
      break;

    case 4: // Pseudo-words (mix of known chars)
      for (let i = 0; i < 12; i++) {
        let word = "";
        const len = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < len; j++) {
          word += getRandomChar(pool);
        }
        result.push(word);
      }
      break;

    case 5: // Master: Complex mix, longer duration
      for (let i = 0; i < 20; i++) {
        let word = "";
        const len = 2 + Math.floor(Math.random() * 6);
        for (let j = 0; j < len; j++) {
          word += getRandomChar(pool);
        }
        result.push(word);
      }
      break;

    default:
      return "f j";
  }

  // Join with spaces and trim to approximate length if needed, though the loop counts control it mostly
  return result.join(' ');
};