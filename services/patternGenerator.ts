import { Stage } from '../types';

// Vowels for pronounceability logic
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü'];

// Left/Right hand mapping for flow generation
const LEFT_HAND = new Set(['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'y', 'x', 'c', 'v', 'b']);
const RIGHT_HAND = new Set(['z', 'u', 'i', 'o', 'p', 'ü', 'h', 'j', 'k', 'l', 'ö', 'ä', 'n', 'm']);

// Expanded German common words/fragments
export const COMMON_WORDS_DB = [
  "der", "die", "das", "und", "ist", "in", "den", "von", "zu", "mit", "sich", "auf", "für",
  "nicht", "es", "dem", "an", "auch", "als", "da", "nach", "wie", "wir", "aus", "er", "sie",
  "so", "dass", "was", "wird", "bei", "oder", "ein", "eine", "einer", "nur", "vor", "am", 
  "habe", "hat", "du", "wo", "wenn", "alle", "sind", "ich", "aber", "hier", "man", "ja", "nein",
  "danke", "bitte", "hallo", "gut", "tag", "viel", "zeit", "jahr", "neu", "alt", "klein", "groß",
  "frau", "mann", "kind", "leben", "welt", "haus", "hand", "auge", "kopf", "tür", "auto",
  "weg", "mal", "nun", "gar", "sei", "ihr", "doch", "ob", "tun", "kam", "sah", "gab", "lag"
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Checks if a word can be typed with the given allowed characters (exported for wordSentenceGenerator)
export const canTypeWord = (word: string, allowedChars: Set<string>): boolean => {
  return word.split('').every(char => allowedChars.has(char.toLowerCase()) || allowedChars.has(char));
};

// Generates a pronounceable pseudo-word or rhythmic pattern (exported for wordSentenceGenerator)
export const generatePseudoWord = (pool: string[], length: number): string => {
  if (pool.length === 0) return "";
  
  const vowels = pool.filter(c => VOWELS.includes(c));
  const consonants = pool.filter(c => !VOWELS.includes(c) && c !== ' ');
  const lefts = pool.filter(c => LEFT_HAND.has(c));
  const rights = pool.filter(c => RIGHT_HAND.has(c));

  // Scenario 1: Limited Vowels (Early Stages, e.g. f, j, d, k) -> Rhythm / Hand Alternation
  if (vowels.length === 0 || (vowels.length / pool.length < 0.2 && lefts.length > 0 && rights.length > 0)) {
    let word = "";
    // Start with random hand
    let isLeft = Math.random() > 0.5;
    
    for (let i = 0; i < length; i++) {
      const currentPool = isLeft ? lefts : rights;
      // Fallback if current hand has no keys in pool (shouldn't happen if check passed, but safety first)
      const char = getRandomItem(currentPool.length > 0 ? currentPool : pool);
      word += char;
      
      // Strict alternation ensures rhythm (f -> j -> d -> k)
      isLeft = !isLeft;
    }
    return word;
  }

  // Scenario 2: Standard Vowel-Consonant Flow
  // Fallback if we have only vowels or only consonants (and couldn't alternate hands well)
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

// Meisterklasse (Stage 11): Echte, sinnvolle Texte mit Satzzeichen und Zahlen
const MEISTERKLASSE_TEXTS: string[] = [
  "Am Montag beginnt die Schule um 8.00 Uhr. Die Kinder freuen sich auf den Tag.",
  "Im Jahr 2024 haben wir viel vor. Reisen, lernen, Freunde treffen – das steht auf dem Plan.",
  "Der Zug fährt um 14.30 Uhr ab. Bitte seid pünktlich am Gleis 3!",
  "Kaffee oder Tee? Beides schmeckt gut an einem kalten Wintertag.",
  "Die Adresse lautet: Musterstrasse 42, 12345 Berlin. Schick mir eine Nachricht!",
  "Wir haben am 24. Dezember frei. Frohe Weihnachten an alle!",
  "Die Temperatur sinkt auf minus 5 Grad. Zieht euch warm an.",
  "Kosten: 9,99 Euro pro Person. Kinder unter 6 Jahren zahlen nichts.",
  "Treffen wir uns um 18.00 Uhr? Ich warte vor dem Kino.",
  "Das Buch hat 256 Seiten. Es ist spannend von der ersten bis zur letzten Seite.",
  "Meine Telefonnummer ist 0176-12345678. Ruf mich morgen an!",
  "Der Film dauert 2 Stunden. Er startet um 20.15 Uhr.",
  "In Deutschland leben etwa 84 Millionen Menschen. Die Hauptstadt ist Berlin.",
  "Der Supermarkt hat von 7.00 bis 22.00 Uhr geöffnet. Sonntags bleibt er zu.",
  "Die Rechnung beträgt 45,50 Euro. Zahlen Sie bar oder mit Karte?",
  "Das Meeting ist am 15. März um 10.00 Uhr. Alle sind eingeladen.",
  "Ich habe 3 Geschwister: 2 Schwestern und 1 Bruder. Wir verstehen uns gut.",
  "Der Bus kommt in 5 Minuten. Warte bitte an der Haltestelle!",
  "Öffnungszeiten: Mo–Fr 9.00–18.00, Sa 9.00–13.00. Wir freuen uns auf Ihren Besuch.",
  "Die Prüfung findet am 20. Juni statt. Viel Erfolg allen Teilnehmern!",
  "Es ist 23.59 Uhr – gleich Mitternacht. Guten Rutsch ins neue Jahr!",
  "Der Weg ist 2,5 km lang. Zu Fuss brauchst du etwa 30 Minuten.",
  "Preis: 19,90 Euro (inkl. MwSt.). Bestellung unter www.example.de.",
  "Das Konzert beginnt um 19.30 Uhr. Die Türen öffnen um 18.00 Uhr.",
  "Wir haben 10 Äpfel, 3 Birnen und 1 Kilo Bananen gekauft. Das reicht für die Woche.",
  "Der Arzt hat Termine am 12., 13. und 14. April. Wann passt dir?",
  "Geschwindigkeit: maximal 50 km/h. Hier gilt Tempo 30 für die Sicherheit.",
  "Die Lieferung kommt zwischen 14.00 und 18.00 Uhr. Bitte jemanden zu Hause lassen!",
  "Kapitel 1 – Der Anfang. Es war einmal vor langer Zeit...",
  "Die Durchschnittstemperatur im Juli liegt bei 18–22 Grad. Perfekt für Ausflüge!",
  "Passwort: mindestens 8 Zeichen, mit Zahlen und Sonderzeichen. Bitte merken!",
  "Von 9.00 bis 12.00 Uhr bin ich in Besprechungen. Danach bin ich erreichbar.",
  "Die Strecke ist 120 km lang. Mit dem Auto dauert es etwa 1,5 Stunden.",
  "Angebot gültig bis 31.12.2024. Nur solange der Vorrat reicht!",
  "Die Kinder sind 6, 8 und 11 Jahre alt. Sie gehen in die Grundschule.",
  "Rückruf bitte bis 17.00 Uhr unter 030-123456. Vielen Dank!",
  "Der Roman hat 400 Seiten – ein echter Wälzer. Aber jede Seite lohnt sich.",
  "Eintritt: 5,00 Euro für Erwachsene, 2,50 Euro für Kinder. Familien zahlen 10,00 Euro.",
];

// Generates the content based on pedagogical levels
export const generatePatternLevel = (stage: Stage, subLevelId: number): string => {
  // Meisterklasse (Stage 11): Echte Texte, mehrere Sätze mit Satzzeichen und Zahlen
  if (stage.id === 11) {
    const sentences = MEISTERKLASSE_TEXTS.flatMap((t) => t.split(/(?<=[.!?])\s+/).filter(Boolean));
    const getParagraph = (minSentences: number, maxSentences: number) => {
      const n = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1));
      const shuffled = [...sentences].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, n).join(' ');
    };
    if (subLevelId === 0) {
      return getParagraph(8, 12) + ' ' + getParagraph(6, 10);
    }
    if (subLevelId === 1) return getParagraph(2, 3);
    if (subLevelId === 2) return getParagraph(3, 4);
    if (subLevelId === 3) return getParagraph(5, 6);
    if (subLevelId === 4) return getParagraph(7, 9);
    if (subLevelId === 5) return getParagraph(10, 14);
  }

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

    default:
      // Unbekanntes subLevelId (z. B. Debug): minimaler Inhalt aus poolAll
      if (poolAll.length > 0) {
        for (let i = 0; i < 8; i++) {
          const key = getRandomItem(poolAll);
          result.push(key + key);
          result.push(key + key + key);
        }
      } else {
        result.push('fff', 'jjj', 'fff', 'jjj');
      }
      break;
  }

  const out = result.join(' ').trim();
  return out.length > 0 ? out : (poolAll.length > 0 ? poolAll.slice(0, 3).join(' ') + ' ' + poolAll.slice(0, 3).join(' ') : 'fff jjj fff jjj');
};