import { Stage, Language } from '../types';
import { canTypeWord, generatePseudoWord, COMMON_WORDS_DB_BY_LANGUAGE, CODER_TEXTS } from './patternGenerator';

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Extended word lists
const EXTRA_WORDS_DE = [
  // --- STAGE 1-3 Support (f, j, d, k, s, l, a, ö + space) ---
  "da", "das", "dass", "als", "all", "alle", "alles", "als", "ja", "saal", "aal", "lass", "fass", "fall", "falls", "kahl", "fahl", "ska", "as", "ass", "ad", "ade", "fee", "see", "seele", "lesen", "lese", "las", "lasen", "fss", "jks", "aff", "affe", "fad", "fade", "fadel", "faden", "fall", "falle", "fallen", "sassa", "sass", "sel", "selle", "seea", "kakaks", "kaskade", "kaskaden", "kelle", "keller", "klasse", "klage", "klagen", "klag",

  // --- STAGE 5 (g, h) ---
  "gas", "glas", "hals", "hagel", "haag", "sag", "sah", "sahen", "jah", "jagd", "jagen", "jagt", "hallo", "halle", "halde", "hafe", "hafen", "hafer", "hag", "hager", "hase", "hasen", "geh", "gehe", "gehen", "gehst", "geht", "gehege", "gehalt", "gehalte", "gehalten", "gehassel", "gehalles", "gejage", "gejagt", "gesagt", "glas", "glase", "glasklar", "glatt",

  // --- STAGE 6 (q, w, e, r, t) ---
  "der", "die", "des", "dem", "den", "wer", "wo", "was", "wie", "wir", "war", "waren", "warst", "wart", "warten", "warte", "wartet", "wert", "werte", "werten", "wetter", "wett", "wette", "wetten", "wer", "werde", "werden", "werdet", "weg", "wege", "wegen", "weder", "leer", "leere", "leeren", "tee", "teer", "teere", "teeren", "teeres", "rehe", "sehr", "werfen", "fegen", "lesen", "fegt", "fegte", "fegten", "fest", "feste", "festen", "fett", "fette", "fettes", "retten", "retter", "rettet", "rest", "reste", "resten", "raster", "rast", "raste", "rasten", "rate", "raten", "ratet", "ratte", "ratten", "rar", "rare", "rares", "rart", "rad", "rade", "rades", "radler", "rot", "rote", "rotes", "rotter", "rater", "tat", "taten", "tatest", "tatet", "tag", "tage", "tagen", "tags", "tages", "tal", "tale", "taler", "tar", "tare",

  // --- STAGE 7 (z, u, i, o, p, ü) ---
  "zu", "zur", "zum", "zug", "zuge", "zuges", "züge", "zügen", "zeit", "zeiten", "zeig", "zeige", "zeigen", "zeugt", "zeuge", "zeugen", "zart", "zarte", "zartes", "zoo", "zoos", "zopf", "zöpfe", "zöpfen", "zoll", "zölle", "zöllen", "ziel", "ziele", "zielen", "zier", "ziere", "zieren", "ziert", "zierat", "uhr", "uhren", "us", "usa", "unter", "unten", "und", "uns", "unser", "unsere", "unserem", "unseren", "unserer", "unseres", "ufer", "ufern", "um", "ums", "im", "in", "ins", "ist", "isst", "iss", "irre", "irren", "irr", "irrt", "oder", "oben", "ohne", "ort", "orte", "orten", "ofen", "öfen", "post", "posten", "pol", "pole", "polen", "poller", "pa", "paar", "paare", "paaren", "part", "parte", "parten", "pate", "paten", "patin", "pfad", "pfade", "pforte", "pfote", "pfoten", "pur", "pure", "puren", "pures", "putz", "putzen", "putzt", "putzte", "übel", "üben", "über", "übt", "übte", "übten",

  // --- STAGE 8 (y, x, c, v, b, n, m) & REST ---
  "man", "mal", "mir", "mich", "mit", "mehr", "mein", "meine", "meinen", "meiner", "meines", "mutter", "mut", "mutig", "müde", "müden", "müdes", "mund", "munde", "maus", "mäuse", "mäusen", "mauer", "mauern", "mann", "männer", "männern", "nur", "nun", "nie", "nimmer", "nicht", "nichts", "noch", "nach", "nase", "nasen", "nass", "nasse", "nassen", "nein", "neu", "neue", "neuen", "neuer", "neues", "nam", "name", "namen", "nannte", "nannten", "nah", "nahe", "nahen", "naht", "nahte", "nahten", "nacht", "nächte", "nächten", "von", "vor", "viel", "viele", "vielen", "vieles", "vielleicht", "vier", "viertel", "voll", "volle", "vollen", "voller", "volles", "vogel", "vögel", "vögeln", "boot", "boote", "booten", "bei", "bis", "bist", "bin", "birne", "birnen", "berg", "berge", "bergen", "bad", "bade", "baden", "buch", "bücher", "büchern", "bach", "bäche", "bächen", "backen", "backt", "backte", "backten", "ball", "bälle", "bällen", "blau", "blaue", "blauen", "blaues", "blume", "blumen", "blut", "blute", "bluten", "club", "clubs", "cafe", "cafes", "clown", "clowns", "couch", "couches", "creme", "cremen", "cremes", "computer", "computern", "box", "boxen", "boxte", "boxten", "text", "texte", "texten", "taxi", "taxis", "axt", "äxte", "äxten", "extra", "extras", "typ", "typen", "typisch", "typische", "typischen", "system", "systeme", "systemen",

  // Generic High Frequency
  "alle", "als", "am", "an", "andere", "auch", "auf", "aus", "bei", "bin", "bis", "dann", "dass", "dem", "den", "der", "des", "die", "dies", "diese", "doch", "dort", "du", "durch", "ein", "eine", "einen", "einer", "eines", "er", "es", "etwas", "euch", "eure", "für", "gehen", "geht", "gemacht", "gesagt", "gut", "habe", "haben", "hat", "hatte", "heute", "hier", "ich", "ihr", "immer", "in", "ist", "ja", "jeder", "jedes", "jetzt", "kann", "kein", "keine", "können", "könnte", "lange", "leben", "machen", "man", "mehr", "mein", "meine", "mich", "mir", "mit", "muss", "nach", "nicht", "noch", "nur", "oder", "ohne", "schon", "sehr", "sein", "seine", "sich", "sie", "sind", "so", "soll", "sollen", "sondern", "sonst", "über", "um", "und", "uns", "unser", "unter", "viel", "von", "vor", "war", "waren", "was", "weg", "weil", "weit", "weiter", "wenn", "wer", "werden", "werde", "wird", "wieder", "will", "wir", "wo", "wollen", "wurde", "wurden", "zu", "zur", "zwei",
  "abend", "arbeit", "augen", "auto", "ball", "baum", "bett", "bild", "brot", "buch", "boden", "brief", "dank", "ding", "eltern", "ende", "erste", "essen", "frage", "freund", "früh", "geld", "geschichte", "gesicht", "glück", "grund", "hand", "haus", "heim", "herz", "hund", "jahr", "kind", "kopf", "kraft", "kreis", "land", "leben", "licht", "luft", "minute", "moment", "mond", "morgen", "name", "nacht", "ort", "platz", "recht", "rest", "raum", "satz", "schule", "stadt", "stunde", "tag", "teil", "tür", "uhr", "vater", "welt", "woche", "wort", "zeit", "zimmer",
  "alt", "arm", "best", "dein", "eigen", "einfach", "ganz", "gut", "gern", "gross", "halb", "hart", "hoch", "klar", "klein", "kurz", "lang", "leicht", "neu", "nächst", "richtig", "schnell", "schwer", "schön", "spät", "stark", "tief", "voll", "wahr", "warm", "weit", "wenig", "wichtig", "wunderbar",
  "arbeiten", "beginnen", "bleiben", "bringen", "denken", "fahren", "finden", "fragen", "geben", "gehen", "halten", "heissen", "kennen", "kommen", "lassen", "leben", "legen", "lesen", "liegen", "machen", "meinen", "nehmen", "nennen", "reden", "sagen", "sehen", "sein", "sitzen", "spielen", "sprechen", "stehen", "stellen", "tragen", "treffen", "tun", "verstehen", "warten", "werden", "wissen", "wohnen", "wollen", "zeigen",
  // --- SPECIAL CHARS (Stage 12) ---
  "groß", "weiß", "heiß", "süß", "fuß", "spaß", "maß", "straße", "grüße", "fließen", "außen", "schießen", "schließlich", "regelmäßig",
  "email@test.de", "info@web.de", "100%", "50%", "19,99€", "10€", "(neu)", "(alt)", "§123", "a+b", "x=y", "#hashtag", "@user"
];

const EXTRA_WORDS_EN = [
  // Early stages support
  "do", "did", "dad", "add", "all", "fall", "call", "sill", "sill", "salsa", "lead", "lad", "salt", "lass", "jazz", "fad", "safe", "fads", "leaf", "self", "sell", "lease", "sealed", "less", "lead",

  // Stage 5 (g, h)
  "has", "had", "hag", "half", "hall", "hall", "glass", "hash", "shed", "shade", "shag", "lag", "lagged", "flag", "flags", "halls", "fresh", "she", "his", "he", "her", "here",

  // Stage 6 (q, w, e, r, t)
  "were", "where", "what", "when", "then", "there", "their", "rest", "treat", "treats", "rate", "rates", "trade", "trader", "red", "tree", "west", "test", "tests", "text", "texts", "read", "reads", "tread", "treads",

  // Stage 7 (y, u, i, o, p)
  "you", "your", "yours", "youth", "unit", "units", "input", "output", "open", "opens", "option", "options", "point", "points", "prior", "prior", "pure", "pursue", "user", "users", "join", "joins", "joiner", "joiners",

  // Stage 8 (z, x, c, v, b, n, m)
  "man", "men", "name", "names", "mine", "mind", "mindset", "move", "moves", "movie", "movies", "base", "basic", "box", "boxes", "zone", "zebra", "zero", "next", "index", "value", "values", "cave", "caves", "code", "codes",

  // Generic high frequency
  "about", "after", "again", "air", "along", "also", "always", "among", "animal", "answer", "area", "away", "back", "because", "before", "below", "between", "book", "both", "boy", "but", "by", "call", "car", "carry", "change", "children", "city", "close", "country", "course", "day", "different", "does", "end", "enough", "every", "example", "family", "far", "father", "few", "food", "form", "found", "friend", "get", "give", "good", "great", "group", "hand", "head", "help", "home", "house", "important", "keep", "kind", "last", "learn", "letter", "life", "line", "little", "live", "long", "look", "make", "man", "mean", "men", "mother", "move", "much", "name", "need", "new", "next", "number", "off", "old", "only", "open", "over", "people", "place", "play", "point", "put", "read", "right", "same", "say", "see", "seem", "set", "show", "small", "sound", "spell", "still", "study", "such", "take", "tell", "than", "thing", "think", "this", "those", "time", "together", "under", "until", "use", "want", "water", "well", "went", "where", "while", "word", "work", "world", "write", "year",
  // --- SPECIAL CHARS (Stage 12) ---
  "email@test.com", "info@example.com", "100%", "50%", "$19.99", "$10", "(new)", "(old)", "#123", "a+b", "x=y", "#hashtag", "@user"
];

const EXTRA_WORDS_BY_LANGUAGE: Record<Language, string[]> = {
  de: EXTRA_WORDS_DE,
  en: EXTRA_WORDS_EN,
};

// Large set of sentences (without trailing punctuation; punctuation added when stage allows)
const SENTENCES_DB_DE = [
  // --- SIMPLE (f, j, d, k, s, l, a, ö) ---
  "das das das", "ja ja ja", "lass das", "das all", "als das", "ja das", "da da da", "das fass", "lass alle", "das saal", "al al al", "das aal",

  // --- SIMPLE+ (g, h) ---
  "hallo hase", "das glas", "sag ja", "geh da", "geh weg", "hallo alle", "das gas", "sah das", "sag das", "ja das geht", "alle gehen", "hals und bein", "hase und igel", "hallo du da", "geh nach hause", "geh in das haus",

  // --- MEDIUM (q, w, e, r, t) ---
  "der tee war gut", "wer ist da", "was ist das", "wo ist er", "wir warten", "es ist warm", "er war da", "sie war weg", "es wird gut", "das wetter ist gut", "wer war da", "wo warst du", "was wer wo", "tee oder kaffee", "kaffee oder tee", "alle sind da", "er starrt", "sie wartet", "es regnet", "rate mal", "das alte haus", "der alte mann", "die alte frau", "ein neues rad", "ein rotes rad", "das feld ist leer", "der keller ist dunkel", "rette sich wer kann", "wer hat recht", "das ist der rest",

  // --- ADVANCED (z, u, i, o, p, ü, + rest) ---
  "zu hause ist es am besten", "zeit ist geld", "zug um zug", "ziel in sicht", "zart und fein", "wir sind im zoo", "unter der brücke", "auf und ab", "um und auf", "hin und her", "rund herum", "oben und unten", "pfui spinne", "post für dich", "pure freue", "übung macht den meister", "über den wolken", "unter dem meer", "polizei und feuerwehr", "pause machen", "platz nehmen", "purzelbaum schlagen", "pilze sammeln",

  // --- ORIGINAL COMPREHENSIVE SET ---
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
  "docker-compose up -d",
  "python3 script.py --verbose"
];

const SENTENCES_DB_EN = [
  "dad dad dad", "yes yes yes", "leave it", "all good", "as is", "yes that", "go go go", "the fall", "let all", "the hall", "all all", "the eel",
  "hello hare", "the glass", "say yes", "go there", "go away", "hello all", "the gas", "saw that", "say that", "yes it goes", "all go", "neck and leg", "hare and hedgehog", "hello you", "go home", "go in the house",
  "the tea was good", "who is there", "what is this", "where is he", "we wait", "it is warm", "he was there", "she was away", "it will be good", "the weather is good", "who was there", "where were you", "what who where", "tea or coffee", "coffee or tea", "all are here", "he stares", "she waits", "it rains", "guess", "the old house", "the old man", "the old woman", "a new bike", "a red bike", "the field is empty", "the cellar is dark", "every man for himself", "who is right", "this is the rest",
  "home is best", "time is money", "train by train", "goal in sight", "soft and fine", "we are at the zoo", "under the bridge", "up and down", "on and up", "back and forth", "around and around", "above and below", "yuck spider", "post for you", "pure joy", "practice makes perfect", "above the clouds", "under the sea", "police and fire", "take a break", "take a seat", "do a somersault", "collect mushrooms",
  "The man has the house",
  "She is in the world",
  "This is good",
  "He has a house",
  "I am here",
  "We are there",
  "The child plays",
  "The woman reads",
  "The day is beautiful",
  "He goes home",
  "She has a lot of time",
  "The year is new",
  "I have the book",
  "You are tall",
  "The door is open",
  "He sees the dog",
  "We have time",
  "The house is old",
  "She gives the book",
  "docker-compose up -d",
  "python3 script.py --verbose"
];

export const SENTENCES_DB_BY_LANGUAGE: Record<Language, string[]> = {
  de: SENTENCES_DB_DE,
  en: SENTENCES_DB_EN,
};

/**
 * --- MEISTERKLASSE (Stage 11) ---
 * Complex sentences, punctuation, capitalization.
 */
const MEISTERKLASSE_SENTENCES_DE = [
  "Das Wetter ändert sich schnell.",
  "Ich glaube, es wird bald regnen.",
  "Kannst du mir bitte das Salz geben?",
  "Wir fahren morgen in den Urlaub!",
  "Achtung, der Hund beißt manchmal.",
  "Warum hast du das nicht gesagt?",
  "Es ist schon spät; wir müssen gehen.",
  "Die Prüfung war schwerer als gedacht.",
  "Er läuft jeden Morgen zehn Kilometer.",
  "Sie liest gerne spannende Bücher.",
  "Das Essen schmeckt wirklich gut.",
  "Habt ihr die Hausaufgaben gemacht?",
  "Der Zug hat leider Verspätung.",
  "Ich freue mich auf das Wochenende.",
  "Wo hast du deine Schlüssel gelassen?",
  "Das Konzert beginnt um acht Uhr.",
  "Wir haben viel Spaß zusammen.",
  "Der Film war sehr interessant.",
  "Kommst du heute Abend vorbei?",
  "Das ist eine gute Idee!",
  "Ich verstehe die Frage nicht ganz.",
  "Er arbeitet als Lehrer in Berlin.",
  "Sie singt wunderschön im Chor.",
  "Der Kaffee ist noch zu heiß.",
  "Wir spielen gerne Brettspiele.",
  "Das Auto muss in die Werkstatt.",
  "Ich habe meinen Regenschirm vergessen.",
  "Der Himmel ist heute strahlend blau.",
  "Wir gehen oft im Wald spazieren.",
  "Das Leben ist voller Überraschungen."
];

const MEISTERKLASSE_SENTENCES_EN = [
  "The weather changes quickly.",
  "I think it will rain soon.",
  "Could you please pass me the salt?",
  "We are going on vacation tomorrow!",
  "Careful, the dog sometimes bites.",
  "Why didn’t you say that?",
  "It’s already late; we have to go.",
  "The exam was harder than expected.",
  "He runs ten kilometers every morning.",
  "She likes reading exciting books.",
  "The food tastes really good.",
  "Did you do the homework?",
  "Unfortunately the train is delayed.",
  "I’m looking forward to the weekend.",
  "Where did you leave your keys?",
  "The concert starts at eight o’clock.",
  "We have a lot of fun together.",
  "The film was very interesting.",
  "Are you coming by tonight?",
  "That’s a good idea!",
  "I don’t quite understand the question.",
  "He works as a teacher in Berlin.",
  "She sings beautifully in the choir.",
  "The coffee is still too hot.",
  "We like to play board games.",
  "The car has to go to the workshop.",
  "I forgot my umbrella.",
  "The sky is bright blue today.",
  "We often walk in the forest.",
  "Life is full of surprises."
];

export const MEISTERKLASSE_SENTENCES_BY_LANGUAGE: Record<Language, string[]> = {
  de: MEISTERKLASSE_SENTENCES_DE,
  en: MEISTERKLASSE_SENTENCES_EN,
};

/**
 * --- PROFI & SPECIAL CHARS (Stage 12) ---
 */
const PROFI_SENTENCES_DE = [
  "Der Preis beträgt 19,99€ (inkl. MwSt).",
  "Bitte senden an: info@beispiel.de",
  "Achtung: Baustelle auf der A7!",
  "Die Formel lautet: a² + b² = c²",
  "Treffen wir uns um 18:30 Uhr?",
  "Er sagte: 'Das ist ja unglaublich!'",
  "Rabatt-Code: SOMMER_2024",
  "Temperatur: -5°C bis +10°C.",
  "Status: [ON] / [OFF]",
  "Login: User_123 & Pass#Word!",
  "Größe: 100% oder 50%?",
  "Datei 'bericht_final.pdf' gespeichert.",
  "Kosten: 50$ (USD) / 45£ (GBP).",
  "Ergebnis: 100 > 90 ist wahr.",
  "Hast du die E-Mail (Re: Projekt) bekommen?",
  "Fehler #404: Seite nicht gefunden.",
  "Rechnung Nr. 2023/001 bezahlt.",
  "Öffnungszeiten: Mo-Fr, 09:00 - 17:00.",
  "Bitte bestätigen (Ja/Nein): ___",
  "Upload: 5.5 MB / 10 MB fertig.",
  "Vorsicht! Hochspannung!",
  "Die 'Große' Pause beginnt jetzt.",
  "Paragraph §123 BGB beachten.",
  "Windows\\System32\\drivers",
  "http://www.google.de/search?q=tippen",
  "1 + 2 * 3 = 7 (Punkt vor Strich!)"
];

const PROFI_SENTENCES_EN = [
  "The price is $19.99 (incl. tax).",
  "Please send to: info@example.com",
  "Warning: construction on the A7!",
  "The formula is: a² + b² = c²",
  "Shall we meet at 6:30 p.m.?",
  "He said: 'That’s unbelievable!'",
  "Discount code: SUMMER_2024",
  "Temperature: -5°C to +10°C.",
  "Status: [ON] / [OFF]",
  "Login: User_123 & Pass#Word!",
  "Size: 100% or 50%?",
  "File 'report_final.pdf' saved.",
  "Costs: $50 (USD) / £45 (GBP).",
  "Result: 100 > 90 is true.",
  "Did you get the email (Re: Project)?",
  "Error #404: page not found.",
  "Invoice no. 2023/001 paid.",
  "Opening hours: Mon–Fri, 9:00–17:00.",
  "Please confirm (Yes/No): ___",
  "Upload: 5.5 MB / 10 MB complete.",
  "Caution! High voltage!",
  "The 'Big' break starts now.",
  "Note §123 BGB.",
  "Windows\\System32\\drivers",
  "http://www.google.com/search?q=typing",
  "1 + 2 * 3 = 7 (order of operations!)"
];

export const PROFI_SENTENCES_BY_LANGUAGE: Record<Language, string[]> = {
  de: PROFI_SENTENCES_DE,
  en: PROFI_SENTENCES_EN,
};

const CODER_SENTENCES_DE = [
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

const CODER_SENTENCES_EN = [
  "He puts the book away",
  "She thinks about tomorrow",
  "The window is open",
  "We need more time",
  "The doctor comes today",
  "The night was long",
  "He shows me the way",
  "She helps her mother",
  "The money is not enough",
  "I know him well",
  "We meet tomorrow",
  "The letter has arrived",
  "The flower is beautiful",
  "He lives nearby",
  "She runs fast",
  "The water is cold",
  "We are lucky",
  "The coffee is ready",
  "The clock shows seven",
  "He takes the first train",
  "She stays until tomorrow",
  "The child is already asleep",
  "I missed you",
  "We are very tired",
  "The movie was good",
  "The trip was beautiful",
  "He rides a bike",
  "She sings a song",
  "The concert starts at eight",
  "We eat together",
  "The winter is cold",
  "The leaves are falling",
  "He opens the door",
  "She closes the window",
  "The phone rings",
  "I call you",
  "We will see each other soon",
  "The summer is hot",
  "The birds sing",
  "He walks through the park",
  "She sits under the tree",
  "This is my place",
  "We live here",
  "The boy is called Tom",
  "The woman works in the office",
  "He comes from Berlin",
  "She goes home",
  "The bread is fresh",
  "I am hungry",
  "We need bread",
  "The train departs",
  "The door is open",
  "He looks for his key",
  "She does not find it",
  "This is not a problem",
  "We know the answer",
  "The dog barks",
  "The cat sleeps",
  "He wears a jacket",
  "She has blond hair",
  "The room is large",
  "I am already here",
  "We will come later",
  "The letter lies on the table",
  "The children are loud",
  "He speaks softly",
  "She listens to music",
  "The song is beautiful",
  "We like to dance",
  "The dance was beautiful",
  "The party was good",
  "He celebrates his birthday",
  "She gives him a book",
  "The gift is great",
  "I am happy",
  "We congratulate you",
  "The cake tastes good",
  "The guests are here",
  "He says thank you",
  "She says goodbye",
  "That was a nice day",
  "We had a lot of fun",
  "The morning is bright",
  "The air is fresh",
  "He breathes deeply",
  "She smiles",
  "That makes me happy",
  "I am content",
  "We have everything",
  "The rain falls",
  "The flowers bloom",
  "He waters the garden",
  "She picks a rose",
  "The grass is green",
  "We walk in the park",
  "The forest is dark",
  "The trees are tall",
  "He climbs the mountain",
  "She likes to hike",
  "The weather is getting better",
  "I hope so",
  "We wish you luck",
  "The star shines",
  "The night is quiet",
  "He looks at the window",
  "She dreams of the trip",
  "This is a dream",
  "We plan the trip",
  "The plan is good",
  "I like the idea",
  "He thinks",
  "She is right",
  "That is true",
  "I believe you",
  "We trust him",
  "The friend helps",
  "Help is coming",
  "He thanks her",
  "She hugs him",
  "The heart beats",
  "We love you",
  "The father works",
  "The mother rests",
  "He plays with the child",
  "She bakes a cake",
  "The bread smells good",
  "I smell coffee",
  "We have breakfast together",
  "The table is set",
  "The soup is hot",
  "He eats with appetite",
  "She drinks tea",
  "The meal is ready",
  "We are full",
  "The guest is satisfied",
  "The kitchen is clean",
  "He tidies up",
  "She washes the dishes",
  "The house is tidy",
  "I clean the room",
  "We clean up",
  "The floor shines",
  "The laundry dries",
  "He hangs up the jacket",
  "She folds the clothes",
  "The bed is made",
  "We rest",
  "The body needs sleep",
  "The eyes are heavy",
  "He yawns",
  "She falls asleep",
  "The light goes out",
  "I sleep well",
  "We wake up early",
  "The alarm rings",
  "The night was short",
  "He stretches",
  "She opens her eyes",
  "The new year begins",
  "We celebrate New Year’s Eve",
  "The snow falls",
  "The children build a snowman",
  "He throws a snowball",
  "She slips on the ice",
  "The ice is slippery",
  "I wear gloves",
  "We are freezing",
  "The scarf is warm",
  "The hat fits",
  "He puts on the jacket",
  "She buttons the coat",
  "That is warm enough",
  "We go outside",
  "The wind blows hard",
  "The clouds move",
  "He looks at the sky",
  "She points at the rainbow",
  "That is wonderful",
  "I am excited",
  "We enjoy the day",
  "The moment is perfect",
  "The silence is beautiful",
  "He says nothing",
  "She nods",
  "That is enough",
  "We understand each other",
];

export const CODER_SENTENCES_BY_LANGUAGE: Record<Language, string[]> = {
  de: CODER_SENTENCES_DE,
  en: CODER_SENTENCES_EN,
};

// Code lines without string literals (no ' or ") for Coder "Wort & Satz" when CODER_TEXTS lines are filtered out (e.g. stage 13 has no quotes)
const CODER_LINES_FALLBACK: string[] = [
  'const pi = 3.14159;', 'let radius = 10;', 'let area = pi * radius * radius;',
  'if (area > 100) {', '} else {', 'return a + b;', 'return x * y;',
  'function add(a, b) {', 'function multiply(x, y) {', 'const result = add(5, 7);',
  'if (n <= 1)', 'return n', 'return fibonacci(n-1) + fibonacci(n-2)',
  'for key, value in users.items():', 'if users[age] > 18:',
  'for file in os.listdir(path):', 'if file.endswith(.py):',
  'for line in lines:', 'numbers = [1, 2, 3, 4, 5]',
  'squared = [n ** 2 for n in numbers if n % 2 == 0]',
  'int[] numbers = {1, 2, 3};', 'for (int n : numbers) {',
  'public class Main {', 'public static void main(String[] args) {',
  'void makeSound();', 'public interface Animal {', 'public class Dog implements Animal {',
  'if (x < 0 || y < 0) {', 'return x + y;', 'var numbers = new List<int> { 1, 2, 3, 4, 5 };',
  'var evenNumbers = numbers.Where(n => n % 2 == 0).ToList();',
  'foreach (var n in evenNumbers) {', 'await Task.Delay(1000);',
  'display: flex;', 'justify-content: center;', 'align-items: center;',
  'height: 100vh;', 'background-color: #f0f0f0;',
  'SELECT * FROM users WHERE age > 18 ORDER BY created_at DESC;',
  'UPDATE users SET status = active WHERE id = 42;',
  'CREATE TABLE products (', 'id INT PRIMARY KEY,', 'name VARCHAR(100),',
  'price DECIMAL(10, 2)', '<div id=app class=container>',
  '<form action=/submit method=POST>', '<nav>', '<ul>', '<li>', '</li>', '</ul>', '</nav>',
];

/**
 * Generates typing content focused on real words and sentences when possible,
 * or word-like / sentence-like pseudo content when the stage has few letters.
 */
export function generateWordSentenceLevel(stage: Stage, language: Language): string {
  const allChars = new Set(stage.chars);
  const useCapitalization = stage.id >= 9;
  const usePunctuation = stage.id >= 10;
  const isMeisterklasse = stage.id >= 11;
  const isProfi = stage.id === 12;
  const isCoder = stage.id === 13;
  const isMixed = stage.id === 14 || stage.id === 15;

  const poolAll = stage.chars.filter((c) => c !== ' ' && c.length === 1);
  const allWords = [...COMMON_WORDS_DB_BY_LANGUAGE[language], ...EXTRA_WORDS_BY_LANGUAGE[language]];
  const possibleWords = allWords.filter((w) => canTypeWord(w, allChars));
  let possibleSentences = SENTENCES_DB_BY_LANGUAGE[language].filter((s) => canTypeWord(s, allChars));

  if (isMeisterklasse && usePunctuation && !isProfi && !isCoder && !isMixed) {
    const extra = MEISTERKLASSE_SENTENCES_BY_LANGUAGE[language].filter((s) => canTypeWord(s, allChars));
    possibleSentences = [...possibleSentences, ...extra];
  } else if (isProfi) {
    // In Profi stage, prioritize sentences with special chars
    const extra = PROFI_SENTENCES_BY_LANGUAGE[language].filter((s) => canTypeWord(s, allChars));
    possibleSentences = [...extra, ...MEISTERKLASSE_SENTENCES_BY_LANGUAGE[language], ...possibleSentences];
  } else if (isCoder) {
    // Stage 13: Coder Mode - Use code lines from CODER_TEXTS (no natural-language sentences)
    const codeTexts = CODER_TEXTS[language];
    const codeLines: string[] = [];
    for (const block of codeTexts) {
      for (const line of block.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.length > 0 && canTypeWord(trimmed, allChars)) {
          codeLines.push(trimmed);
        }
      }
    }
    const fallbackCode = CODER_LINES_FALLBACK.filter((s) => canTypeWord(s, allChars));
    possibleSentences = codeLines.length > 0 ? codeLines : (fallbackCode.length > 0 ? fallbackCode : codeLines);
  } else if (isMixed) {
    // Stage 14 & 15: EVERYTHING
    const extra = [...MEISTERKLASSE_SENTENCES_BY_LANGUAGE[language], ...PROFI_SENTENCES_BY_LANGUAGE[language], ...CODER_SENTENCES_BY_LANGUAGE[language]];
    possibleSentences = [...extra, ...possibleSentences];
  }

  const sentenceCount = (isMeisterklasse || isProfi || isCoder || isMixed)
    ? 6 + Math.floor(Math.random() * 5)   // 6–10 Sätze für Meister/Profi/Coder/Mixed
    : 3 + Math.floor(Math.random() * 3);   // 3–5 Sätze sonst
  const result: string[] = [];

  const capitalize = (w: string) =>
    useCapitalization && w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w;
  const endPunctuation = () => (usePunctuation ? getRandomItem(['.', '.', '.', '!', '?']) : '');

  // Coder Mode (Stage 13): only code lines, no capitalization, no sentence punctuation
  if (isCoder && possibleSentences.length > 0) {
    for (let i = 0; i < sentenceCount; i++) {
      result.push(getRandomItem(possibleSentences).trim());
    }
    const out = result.join(' ').trim();
    return out.length > 0 ? out : 'const x = 1; return x;';
  }

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
