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

// Meisterklasse (Stage 11): Echte, sinnvolle Texte (Absätze)
const MEISTERKLASSE_TEXTS: string[] = [
  // --- ALLTAG & BUSINESS ---
  "Am Montag beginnt die Schule um 8.00 Uhr. Die Kinder freuen sich auf den Tag, da sie ihre Freunde wiedersehen. Im klassenzimmer ist es hell und freundlich, und der Lehrer hat eine spannende Geschichte vorbereitet. In der Pause essen alle ihr Butterbrot und spielen auf dem Hof.",
  "Die Rechnung beträgt 45,50 Euro inklusive Mehrwertsteuer. Bitte überweisen Sie den Betrag innerhalb von 14 Tagen auf unser Konto. Geben Sie als Verwendungszweck unbedingt Ihre Kundennummer 12345 an, damit wir die Zahlung zuordnen können. Vielen Dank für Ihren Einkauf!",
  "Das Meeting ist am 15. März um 10.00 Uhr im Konferenzraum B. Wir werden die Quartalszahlen besprechen und neue Strategien für das kommende Jahr entwickeln. Bitte bereiten Sie eine kurze Präsentation vor und bringen Sie Ihre Unterlagen mit. Es ist wichtig, dass alle pünktlich erscheinen.",
  "Öffnungszeiten: Mo–Fr 9.00–18.00 Uhr, Sa 9.00–13.00 Uhr. Außerhalb dieser Zeiten können Sie uns eine E-Mail an kontakt@example.de schreiben. Wir melden uns so schnell wie möglich bei Ihnen zurück. Unser Kundenservice freut sich auf Ihre Nachricht.",
  
  // --- WISSEN & TECHNIK ---
  "Im Jahr 1969 betrat der erste Mensch den Mond. Neil Armstrong sprach die berühmten Worte, die in die Geschichte eingingen: 'Ein kleiner Schritt für einen Menschen, aber ein großer Sprung für die Menschheit.' Dieses Ereignis zeigte der Welt, was durch Technik, Mut und Zusammenarbeit möglich ist.",
  "Die Digitalisierung verändert unsere Arbeitswelt rasant. Immer mehr Prozesse werden automatisiert, was neue Chancen, aber auch Herausforderungen mit sich bringt. Es ist wichtig, sich ständig weiterzubilden, um am Ball zu bleiben. Wer offen für Neues ist, wird die Zukunft aktiv mitgestalten können.",
  "Künstliche Intelligenz (KI) ist ein Teilgebiet der Informatik. Sie befasst sich mit der Automatisierung intelligenten Verhaltens und dem maschinellen Lernen. Computer können heute schon Bilder erkennen, Sprachen übersetzen und komplexe Spiele wie Schach oder Go gewinnen.",
  "Das Internet verbindet Milliarden von Menschen weltweit. Innerhalb von Sekunden können Informationen von einem Ende der Welt zum anderen gesendet werden. Soziale Netzwerke ermöglichen es uns, in Kontakt zu bleiben, auch wenn wir weit voneinander entfernt sind. Doch man sollte auch auf seine Daten achten.",

  // --- NATUR & UMWELT ---
  "Der Wald ist ein komplexes Ökosystem, in dem Pflanzen und Tiere in einem empfindlichen Gleichgewicht leben. Bäume kommunizieren über ihre Wurzeln und teilen Nährstoffe miteinander. Ein Spaziergang im Grünen senkt nachweislich den Stresspegel und tut der Seele gut.",
  "Bienen sind für unsere Umwelt unverzichtbar. Sie bestäuben Blüten und sorgen so dafür, dass Obst und Gemüse wachsen können. Ohne diese fleißigen Insekten hätten wir viel weniger Nahrungsmittel zur Verfügung. Deshalb ist es wichtig, bienenfreundliche Blumen zu pflanzen.",
  "Wasser ist die Grundlage allen Lebens. Unser Körper besteht zu einem großen Teil aus Wasser, und wir müssen täglich genug trinken, um gesund zu bleiben. Wir sollten sparsam mit dieser kostbaren Ressource umgehen und sie nicht verschwenden.",
  "Der Klimawandel ist eine der größten Herausforderungen unserer Zeit. Die Temperaturen steigen, und das Wetter wird extremer. Jeder kann einen kleinen Beitrag leisten, indem er Energie spart, weniger Auto fährt oder regionale Produkte kauft.",

  // --- KULTUR & REISEN ---
  "Berlin ist die Hauptstadt von Deutschland und hat rund 3,7 Millionen Einwohner. Die Stadt ist bekannt für ihre bewegte Geschichte, das Brandenburger Tor und die Museumsinsel. Touristen aus aller Welt kommen hierher, um die einzigartige Atmosphäre zu erleben.",
  "Reisen erweitert den Horizont. Wer andere Länder besucht, lernt neue Kulturen, Sprachen und Menschen kennen. Man probiert fremdes Essen, sieht beeindruckende Landschaften und sammelt Erinnerungen, die ein Leben lang bleiben. Die Welt ist wie ein Buch, und wer nicht reist, liest nur eine Seite.",
  "Musik ist eine Sprache, die jeder versteht. Egal ob Klassik, Rock, Pop oder Jazz – Klänge können Gefühle ausdrücken, die Worte oft nicht beschreiben können. Viele Menschen spielen ein Instrument oder singen im Chor, um gemeinsam mit anderen Musik zu machen.",
  "Das Lesen von Büchern ist ein wunderbares Hobby. Man taucht in fremde Welten ein, erlebt Abenteuer und lernt viel über das Leben. Ob spannende Krimis, romantische Liebesromane oder interessante Sachbücher – für jeden Geschmack gibt es das passende Buch.",

  // --- SHORT STORIES / EPISODES ---
  "Es war ein kalter Winterabend im Dezember. Der Schnee fiel leise auf die Dächer der Stadt, und in den Fenstern leuchteten warme Lichter. Thomas saß in seinem Sessel, eine Tasse Tee in der Hand, und lauschte der Stille. Es war der perfekte Moment, um zur Ruhe zu kommen.",
  "Anna lief so schnell sie konnte zum Bahnhof. Der Zug sollte in drei Minuten abfahren, und sie musste ihn unbedingt erreichen. Außer Atem kam sie am Gleis 3 an, gerade als der Schaffner die Tür schließen wollte. 'Noch geschafft!', rief sie erleichtert und sprang hinein.",
  "Der kleine Hund bellte fröhlich, als er den Ball sah. Er rannte über die Wiese, schnappte sich das Spielzeug und brachte es schwanzwedelnd zu seinem Herrchen zurück. 'Braver Hund!', lobte der Mann und warf den Ball erneut weit weg.",
  "Lisa hatte lange für diesen Tag geübt. Heute war das große Konzert in der Stadthalle. Mit zitternden Händen betrat sie die Bühne, doch als sie die ersten Töne auf ihrer Geige spielte, verflog die Aufregung. Die Musik erfüllte den Raum und das Publikum lauschte gebannt."
];

// Generates the content based on pedagogical levels
export const generatePatternLevel = (stage: Stage, subLevelId: number): string => {
  // Meisterklasse (Stage 11): Echte Texte, mehrere Sätze mit Satzzeichen und Zahlen
  if (stage.id === 11) {
    // Pick specific paragraphs to ensure coherence (no shuffling of sentences within)
    // subLevelId 0 = Mega Level = Mix of 2 paragraphs
    // subLevelId 1-5 = Single paragraph of increasing complexity/length logic (simulated by random pick for now)
    
    const count = MEISTERKLASSE_TEXTS.length;
    
    if (subLevelId === 0) {
      const p1 = MEISTERKLASSE_TEXTS[Math.floor(Math.random() * count)];
      let p2 = MEISTERKLASSE_TEXTS[Math.floor(Math.random() * count)];
      while(p1 === p2) p2 = MEISTERKLASSE_TEXTS[Math.floor(Math.random() * count)];
      return p1 + " " + p2;
    }

    // For other sub-levels, pick one coherent text. 
    // Ideally we could sort by length, but random variation is fine for "Practice".
    return MEISTERKLASSE_TEXTS[Math.floor(Math.random() * count)];
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