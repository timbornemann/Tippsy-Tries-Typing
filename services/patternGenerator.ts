import { Stage } from '../types';

// Vowels for pronounceability logic
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü'];

// A small subset of common German words to check against available chars
// If the user has unlocked the letters for these, they will be used.
const COMMON_WORDS_DB = [
  "der", "die", "das", "und", "ist", "in", "den", "von", "zu", "mit", "sich", "auf", "für",
  "nicht", "es", "dem", "an", "auch", "als", "da", "nach", "wie", "wir", "aus", "er", "sie",
  "so", "dass", "was", "wird", "bei", "oder", "ein", "eine", "einer", "nur", "vor", "am", 
  "habe", "hat", "du", "wo", "wenn", "alle", "sind", "ich", "aber", "hier", "man", "ja", "nein",
  "danke", "bitte", "hallo", "gut", "tag", "viel", "zeit", "jahr", "neu", "alt", "klein", "groß",
  "frau", "mann", "kind", "leben", "welt", "haus", "hand", "auge", "kopf", "tür", "auto"
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Checks if a word can be typed with the given allowed characters
const canTypeWord = (word: string, allowedChars: Set<string>): boolean => {
  return word.split('').every(char => allowedChars.has(char.toLowerCase()) || allowedChars.has(char));
};

// Generates a pronounceable pseudo-word
const generatePseudoWord = (pool: string[], length: number): string => {
  if (pool.length === 0) return "";
  
  const vowels = pool.filter(c => VOWELS.includes(c));
  const consonants = pool.filter(c => !VOWELS.includes(c) && c !== ' ');

  // Fallback if we only have consonants (e.g. Stage 1 'f', 'j') or only vowels
  if (vowels.length === 0 || consonants.length === 0) {
    let s = "";
    for(let i=0; i<length; i++) s += getRandomItem(pool.filter(c => c !== ' '));
    return s;
  }

  let word = "";
  let isNextVowel = Math.random() > 0.5;

  for (let i = 0; i < length; i++) {
    if (isNextVowel) {
      word += getRandomItem(vowels);
      isNextVowel = false; // Next should ideally be consonant
    } else {
      word += getRandomItem(consonants);
      // High chance to switch to vowel, small chance to do double consonant
      isNextVowel = Math.random() > 0.3; 
    }
  }
  return word;
};

// Generates the content based on pedagogical levels
export const generatePatternLevel = (stage: Stage, subLevelId: number): string => {
  const allChars = new Set(stage.chars);
  const newChars = stage.newChars.filter(c => c !== 'Shift'); // Exclude control keys from direct generation logic
  
  // If Stage 9+ (Capitalization/Punctuation), we need slightly different logic handled inside
  const useCapitalization = stage.id >= 9;
  
  // Prepare pools
  const poolAll = stage.chars.filter(c => c !== ' ' && c.length === 1);
  const poolNew = newChars.length > 0 ? newChars : poolAll;

  // Filter real words that are possible at this stage
  const possibleRealWords = COMMON_WORDS_DB.filter(w => canTypeWord(w, allChars));

  let result: string[] = [];

  // --- ALGORITHMS ---

  switch (subLevelId) {
    case 0: // MEGA LEVEL (Practice Mode replacement)
      // Generates a long, mixed content (approx 50 words)
      {
        const totalItems = 50;
        for (let i = 0; i < totalItems; i++) {
          const rand = Math.random();
          
          if (possibleRealWords.length > 5 && rand > 0.4) {
             // 60% chance for real word if available
             let w = getRandomItem(possibleRealWords);
             // Random capitalization for practice flow even in earlier levels (optional, but good for flow)
             if (useCapitalization && Math.random() > 0.8) {
               w = w.charAt(0).toUpperCase() + w.slice(1);
             }
             result.push(w);
          } else if (rand > 0.2) {
             // Pseudo word (length 3-8)
             const len = 3 + Math.floor(Math.random() * 6);
             let w = generatePseudoWord(poolAll, len);
             if (useCapitalization && Math.random() > 0.8) {
               w = w.charAt(0).toUpperCase() + w.slice(1);
             }
             result.push(w);
          } else {
             // Rhythm drill (repetition of new chars or fast bigrams)
             // e.g. "ded" or "fff"
             const char = getRandomItem(poolNew.length > 0 ? poolNew : poolAll);
             result.push(char + char + char);
          }
        }
        
        // Add some punctuation at the end if unlocked
        if (stage.id >= 10) {
           return result.join(' ') + getRandomItem(['.', '!', '?', '.', '.']);
        }
      }
      break;

    case 1: // INTRODUCTION: Focus purely on new keys. Rhythmic.
      // Pattern: aa aaa aa aaa (to build muscle memory for location)
      {
        const targetKeys = poolNew;
        for (let i = 0; i < 4; i++) {
          const key = getRandomItem(targetKeys);
          result.push(key + key);
          result.push(key + key + key);
          result.push(key + key);
          result.push(key + key + key + key);
        }
      }
      break;

    case 2: // ANCHORING: Mix new keys with Home Row (F, J) or Space
      // Pattern: f[new]j [new]f[new]
      {
        const anchors = ['f', 'j', ' '];
        for (let i = 0; i < 8; i++) {
          const n = getRandomItem(poolNew);
          const a = getRandomItem(anchors);
          if (a === ' ') {
            result.push(n + n + n); // qqq
          } else {
            result.push(a + n + a); // fqf
            result.push(n + a + n); // qfq
          }
        }
      }
      break;

    case 3: // FLOW: Syllables and Bigrams
      // Generate short 2-3 char pronounceable chunks
      {
        for (let i = 0; i < 12; i++) {
          // 50% chance for a real word if we have enough
          if (possibleRealWords.length > 5 && Math.random() > 0.5) {
             result.push(getRandomItem(possibleRealWords));
          } else {
             // Generate a bigram/trigram using new chars heavily
             let chunk = "";
             if (Math.random() > 0.5) {
                chunk = getRandomItem(poolNew) + getRandomItem(poolAll);
             } else {
                chunk = generatePseudoWord(stage.chars.filter(c => c!==' '), 3);
             }
             result.push(chunk);
          }
        }
      }
      break;

    case 4: // WORDS: Pseudo-words and Real Words
      {
        for (let i = 0; i < 10; i++) {
          // Prefer real words if available
          if (possibleRealWords.length > 0 && Math.random() > 0.4) {
            result.push(getRandomItem(possibleRealWords));
          } else {
            // Generate longer pseudo word (4-7 chars)
            result.push(generatePseudoWord(poolAll, 4 + Math.floor(Math.random() * 4)));
          }
        }
      }
      break;

    case 5: // MASTER: Sentences / Flow
      {
        // Construct a "sentence" structure
        let sentence = [];
        const length = 15 + Math.floor(Math.random() * 5); // Number of "words"
        
        for (let i = 0; i < length; i++) {
           let w = "";
           if (possibleRealWords.length > 0 && Math.random() > 0.3) {
             w = getRandomItem(possibleRealWords);
           } else {
             w = generatePseudoWord(poolAll, 2 + Math.floor(Math.random() * 6));
           }

           // Apply Random Capitalization if allowed (Stage 9+)
           if (useCapitalization && (i === 0 || Math.random() > 0.7)) {
             w = w.charAt(0).toUpperCase() + w.slice(1);
           }
           
           sentence.push(w);
        }
        
        // Add punctuation if Stage 10+
        if (stage.id >= 10) {
           return sentence.join(' ') + getRandomItem(['.', '!', '?']);
        }
        return sentence.join(' ');
      }
  }

  return result.join(' ');
};