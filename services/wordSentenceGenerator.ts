import { Stage } from '../types';
import { canTypeWord, generatePseudoWord, COMMON_WORDS_DB } from './patternGenerator';

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Extended German word list for word/sentence mode (a-z, ä, ö, ü; no ß for broad stage compatibility)
const EXTRA_WORDS = [
  "alle", "als", "am", "an", "andere", "auch", "auf", "aus", "bei", "bin", "bis", "dann", "dass", "dem", "den", "der", "des", "die", "dies", "diese", "doch", "dort", "du", "durch", "ein", "eine", "einen", "einer", "eines", "er", "es", "etwas", "euch", "eure", "für", "gehen", "geht", "gemacht", "gesagt", "gut", "habe", "haben", "hat", "hatte", "heute", "hier", "ich", "ihr", "immer", "in", "ist", "ja", "jeder", "jedes", "jetzt", "kann", "kein", "keine", "können", "könnte", "lange", "leben", "machen", "man", "mehr", "mein", "meine", "mich", "mir", "mit", "muss", "nach", "nicht", "noch", "nur", "oder", "ohne", "schon", "sehr", "sein", "seine", "sich", "sie", "sind", "so", "soll", "sollen", "sondern", "sonst", "über", "um", "und", "uns", "unser", "unter", "viel", "von", "vor", "war", "waren", "was", "weg", "weil", "weit", "weiter", "wenn", "wer", "werden", "werde", "wird", "wieder", "will", "wir", "wo", "wollen", "wurde", "wurden", "zu", "zur", "zwei",
  "abend", "arbeit", "augen", "auto", "ball", "baum", "bett", "bild", "brot", "buch", "boden", "brief", "dank", "ding", "eltern", "ende", "erste", "essen", "frage", "freund", "früh", "geld", "geschichte", "gesicht", "glück", "grund", "hand", "haus", "heim", "herz", "hund", "jahr", "kind", "kopf", "kraft", "kreis", "land", "leben", "licht", "luft", "minute", "moment", "mond", "morgen", "name", "nacht", "ort", "platz", "recht", "rest", "raum", "satz", "schule", "stadt", "stunde", "tag", "teil", "tür", "uhr", "vater", "welt", "woche", "wort", "zeit", "zimmer",
  "alt", "arm", "best", "dein", "eigen", "einfach", "ganz", "gut", "gern", "gross", "halb", "hart", "hoch", "klar", "klein", "kurz", "lang", "leicht", "neu", "nächst", "richtig", "schnell", "schwer", "schön", "spät", "stark", "tief", "voll", "wahr", "warm", "weit", "wenig", "wichtig", "wunderbar",
  "arbeiten", "beginnen", "bleiben", "bringen", "denken", "fahren", "finden", "fragen", "geben", "gehen", "halten", "heissen", "kennen", "kommen", "lassen", "leben", "legen", "lesen", "liegen", "machen", "meinen", "nehmen", "nennen", "reden", "sagen", "sehen", "sein", "sitzen", "spielen", "sprechen", "stehen", "stellen", "tragen", "treffen", "tun", "verstehen", "warten", "werden", "wissen", "wohnen", "wollen", "zeigen",
  "ab", "an", "aus", "bei", "bis", "durch", "für", "gegen", "in", "mit", "nach", "ohne", "über", "um", "unter", "von", "vor", "zu", "zwischen",
];

// Large set of German sentences (without trailing punctuation; punctuation added when stage allows)
const SENTENCES_DB = [
  "Der Mann hat das Haus",
  "Sie ist in der Welt",
  "Das ist gut",
  "Er hat ein Haus",
  "Ich bin hier",
  "Wir sind da",
  "Das Kind spielt",
  "Die Frau liest",
  "Der Tag ist schön",
  "Er geht nach Hause",
  "Sie hat viel Zeit",
  "Das Jahr ist neu",
  "Ich habe das Buch",
  "Du bist gross",
  "Die Tür ist auf",
  "Er sieht den Hund",
  "Wir haben Zeit",
  "Das Haus ist alt",
  "Sie gibt das Buch",
  "Der Kopf tut weh",
  "Die Hand ist warm",
  "Er kommt mit dem Auto",
  "Das Leben ist gut",
  "Sie fragt nach dem Weg",
  "Der Mann und die Frau",
  "Ich gehe in die Stadt",
  "Das Wetter ist schön heute",
  "Er liest ein gutes Buch",
  "Sie hat eine schöne Hand",
  "Wir sind gut in der Schule",
  "Der Hund liegt im Garten",
  "Die Kinder spielen draussen",
  "Er hat viel Arbeit",
  "Sie kommt morgen",
  "Das ist nicht schwer",
  "Ich verstehe das gut",
  "Wir warten auf den Bus",
  "Der Tag war lang",
  "Sie gibt mir das Buch",
  "Er bleibt zu Hause",
  "Die Zeit geht schnell",
  "Das Kind hat Hunger",
  "Wir fahren mit dem Auto",
  "Er denkt an dich",
  "Sie weiss die Antwort",
  "Der Abend ist schön",
  "Ich habe keine Zeit",
  "Die Frau arbeitet viel",
  "Er sitzt im Zimmer",
  "Das Licht ist an",
  "Sie findet den Weg",
  "Wir leben in einer grossen Stadt",
  "Der Mann kennt die Strasse",
  "Die Mutter kocht das Essen",
  "Er bringt uns das Brot",
  "Sie nimmt den Zug",
  "Das Haus hat einen Garten",
  "Ich sehe den Berg",
  "Wir sprechen Deutsch",
  "Der Vater liest die Zeitung",
  "Die Tochter geht zur Schule",
  "Er stellt die Frage",
  "Sie antwortet richtig",
  "Das Buch liegt auf dem Tisch",
  "Wir haben heute frei",
  "Der Freund kommt mit",
  "Die Tür geht auf",
  "Er bleibt eine Woche",
  "Sie hat ein neues Auto",
  "Das Kind lernt schnell",
  "Ich warte auf dich",
  "Wir sind fast da",
  "Der Weg ist nicht weit",
  "Die Sonne scheint",
  "Er trinkt gern Kaffee",
  "Sie schreibt einen Brief",
  "Das ist eine gute Idee",
  "Wir machen das zusammen",
  "Der Junge spielt Ball",
  "Die Familie ist gross",
  "Er holt die Milch",
  "Sie ruft mich an",
  "Das Essen schmeckt gut",
  "Ich bin gleich fertig",
  "Wir gehen ins Kino",
  "Der Lehrer erklärt die Aufgabe",
  "Die Schüler sind still",
  "Er legt das Buch weg",
  "Sie denkt an morgen",
  "Das Fenster ist offen",
  "Wir brauchen mehr Zeit",
  "Der Arzt kommt heute",
  "Die Nacht war lang",
  "Er zeigt mir den Weg",
  "Sie hilft der Mutter",
  "Das Geld reicht nicht",
  "Ich kenne ihn gut",
  "Wir treffen uns morgen",
  "Der Brief ist angekommen",
  "Die Blume ist schön",
  "Er wohnt in der Nähe",
  "Sie läuft schnell",
  "Das Wasser ist kalt",
  "Wir haben Glück",
  "Der Kaffee ist fertig",
  "Die Uhr zeigt sieben",
  "Er nimmt den ersten Zug",
  "Sie bleibt bis morgen",
  "Das Kind schläft schon",
  "Ich habe dich vermisst",
  "Wir sind sehr müde",
  "Der Film war gut",
  "Die Reise war schön",
  "Er fährt mit dem Rad",
  "Sie singt ein Lied",
  "Das Konzert beginnt um acht",
  "Wir essen zusammen",
  "Der Winter ist kalt",
  "Die Blätter fallen",
  "Er öffnet die Tür",
  "Sie schliesst das Fenster",
  "Das Telefon klingelt",
  "Ich rufe dich an",
  "Wir sehen uns bald",
  "Der Sommer ist heiss",
  "Die Vögel singen",
  "Er geht durch den Park",
  "Sie sitzt unter dem Baum",
  "Das ist mein Platz",
  "Wir wohnen hier",
  "Der Junge heisst Tom",
  "Die Frau arbeitet im Büro",
  "Er kommt aus Berlin",
  "Sie geht nach Hause",
  "Das Brot ist frisch",
  "Ich habe Hunger",
  "Wir brauchen Brot",
  "Der Zug fährt ab",
  "Die Tür steht offen",
  "Er sucht seinen Schlüssel",
  "Sie findet ihn nicht",
  "Das ist kein Problem",
  "Wir wissen die Antwort",
  "Der Hund bellt",
  "Die Katze schläft",
  "Er trägt eine Jacke",
  "Sie hat blonde Haare",
  "Das Zimmer ist gross",
  "Ich bin schon da",
  "Wir kommen später",
  "Der Brief liegt auf dem Tisch",
  "Die Kinder sind laut",
  "Er spricht leise",
  "Sie hört Musik",
  "Das Lied ist schön",
  "Wir tanzen gern",
  "Der Tanz war schön",
  "Die Party war gut",
  "Er feiert seinen Geburtstag",
  "Sie schenkt ihm ein Buch",
  "Das Geschenk ist toll",
  "Ich freue mich",
  "Wir gratulieren dir",
  "Der Kuchen schmeckt gut",
  "Die Gäste sind da",
  "Er bedankt sich",
  "Sie verabschiedet sich",
  "Das war ein schöner Tag",
  "Wir hatten viel Spass",
  "Der Morgen ist hell",
  "Die Luft ist frisch",
  "Er atmet tief",
  "Sie lächelt",
  "Das macht mich glücklich",
  "Ich bin zufrieden",
  "Wir haben alles",
  "Der Regen fällt",
  "Die Blumen blühen",
  "Er gießt den Garten",
  "Sie pflückt eine Rose",
  "Das Gras ist grün",
  "Wir spazieren im Park",
  "Der Wald ist dunkel",
  "Die Bäume sind hoch",
  "Er klettert auf den Berg",
  "Sie wandert gern",
  "Das Wetter wird besser",
  "Ich hoffe das",
  "Wir wünschen dir Glück",
  "Der Stern leuchtet",
  "Die Nacht ist still",
  "Er schaut zum Fenster",
  "Sie träumt von der Reise",
  "Das ist ein Traum",
  "Wir planen die Reise",
  "Der Plan ist gut",
  "Die Idee gefällt mir",
  "Er denkt nach",
  "Sie hat Recht",
  "Das stimmt",
  "Ich glaube dir",
  "Wir vertrauen ihm",
  "Der Freund hilft",
  "Die Hilfe kommt",
  "Er dankt ihr",
  "Sie umarmt ihn",
  "Das Herz schlägt",
  "Wir lieben dich",
  "Der Vater arbeitet",
  "Die Mutter ruht sich aus",
  "Er spielt mit dem Kind",
  "Sie backt einen Kuchen",
  "Das Brot duftet",
  "Ich rieche Kaffee",
  "Wir frühstücken zusammen",
  "Der Tisch ist gedeckt",
  "Die Suppe ist heiss",
  "Er isst mit Appetit",
  "Sie trinkt Tee",
  "Das Essen steht bereit",
  "Wir sind satt",
  "Der Gast ist zufrieden",
  "Die Küche ist sauber",
  "Er räumt auf",
  "Sie wäscht das Geschirr",
  "Das Haus ist ordentlich",
  "Ich putze das Zimmer",
  "Wir machen sauber",
  "Der Boden glänzt",
  "Die Wäsche trocknet",
  "Er hängt die Jacke auf",
  "Sie faltet die Kleidung",
  "Das Bett ist gemacht",
  "Wir ruhen uns aus",
  "Der Körper braucht Schlaf",
  "Die Augen sind schwer",
  "Er gähnt",
  "Sie schläft ein",
  "Das Licht geht aus",
  "Ich träume gut",
  "Wir wachen früh auf",
  "Der Wecker klingelt",
  "Die Nacht war kurz",
  "Er streckt sich",
  "Sie öffnet die Augen",
  "Das neue Jahr beginnt",
  "Wir feiern Silvester",
  "Der Schnee fällt",
  "Die Kinder bauen einen Schneemann",
  "Er wirft eine Schneeball",
  "Sie rutscht auf dem Eis",
  "Das Eis ist glatt",
  "Ich trage Handschuhe",
  "Wir frieren",
  "Der Schal ist warm",
  "Die Mütze passt",
  "Er zieht die Jacke an",
  "Sie knöpft den Mantel zu",
  "Das ist warm genug",
  "Wir gehen raus",
  "Der Wind weht stark",
  "Die Wolken ziehen",
  "Er schaut in den Himmel",
  "Sie zeigt auf den Regenbogen",
  "Das ist wunderbar",
  "Ich bin begeistert",
  "Wir genießen den Tag",
  "Der Moment ist perfekt",
  "Die Stille ist schön",
  "Er sagt nichts",
  "Sie nickt",
  "Das reicht",
  "Wir verstehen uns",
];

/**
 * Generates typing content focused on real words and sentences when possible,
 * or word-like / sentence-like pseudo content when the stage has few letters.
 */
export function generateWordSentenceLevel(stage: Stage): string {
  const allChars = new Set(stage.chars);
  const useCapitalization = stage.id >= 9;
  const usePunctuation = stage.id >= 10;

  const poolAll = stage.chars.filter((c) => c !== ' ' && c.length === 1);
  const allWords = [...COMMON_WORDS_DB, ...EXTRA_WORDS];
  const possibleWords = allWords.filter((w) => canTypeWord(w, allChars));
  const possibleSentences = SENTENCES_DB.filter((s) => canTypeWord(s, allChars));

  const sentenceCount = 3 + Math.floor(Math.random() * 3); // 3–5 sentences
  const result: string[] = [];

  const capitalize = (w: string) =>
    useCapitalization && w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
  const endPunctuation = () => (usePunctuation ? getRandomItem(['.', '.', '.', '!', '?']) : '');

  if (possibleWords.length >= 3) {
    // Build sentences from words or from predefined sentences
    for (let i = 0; i < sentenceCount; i++) {
      const usePredefined =
        possibleSentences.length > 0 && Math.random() > 0.4;
      if (usePredefined && possibleSentences.length > 0) {
        const raw = getRandomItem(possibleSentences).trim();
        const withCap = useCapitalization && raw.length > 0
          ? raw.charAt(0).toUpperCase() + raw.slice(1)
          : raw;
        result.push(withCap + endPunctuation());
      } else {
        const wordCount = 4 + Math.floor(Math.random() * 6); // 4–9 words per sentence
        const words: string[] = [];
        for (let j = 0; j < wordCount; j++) {
          words.push(getRandomItem(possibleWords));
        }
        const first = capitalize(words[0]);
        const rest = words.slice(1).join(' ');
        result.push(rest ? `${first} ${rest}${endPunctuation()}` : first + endPunctuation());
      }
    }
  } else {
    // Few or no real words: word-like pseudo units, grouped like sentences
    const fallbackPool = poolAll.length > 0 ? poolAll : ['f', 'j'];
    for (let i = 0; i < sentenceCount; i++) {
      const pseudoCount = 2 + Math.floor(Math.random() * 3); // 2–4 "words"
      const pseudoWords: string[] = [];
      for (let j = 0; j < pseudoCount; j++) {
        const len = 2 + Math.floor(Math.random() * 4);
        pseudoWords.push(generatePseudoWord(fallbackPool, len));
      }
      const first = capitalize(pseudoWords[0]);
      const rest = pseudoWords.slice(1).join(' ');
      result.push(rest ? `${first} ${rest}${endPunctuation()}` : first + endPunctuation());
    }
  }

  const out = result.join(' ').trim();
  return out.length > 0 ? out : 'fff jjj fff jjj';
}
