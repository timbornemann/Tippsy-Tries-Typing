import { Stage } from '../types';
import { canTypeWord, generatePseudoWord, COMMON_WORDS_DB } from './patternGenerator';

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Extended German word list for word/sentence mode (a-z, ä, ö, ü; no ß for broad stage compatibility)
const EXTRA_WORDS = [
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

// Large set of German sentences (without trailing punctuation; punctuation added when stage allows)
const SENTENCES_DB = [
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

// Meisterklasse (Stage 11): Sätze mit Zahlen und Satzzeichen für längere Texte
const MEISTERKLASSE_SENTENCES = [
  "Am Montag beginnt die Schule um 8.00 Uhr.",
  "Der Zug fährt um 14.30 Uhr ab.",
  "Die Rechnung beträgt 45,50 Euro.",
  "Treffen wir uns um 18.00 Uhr?",
  "Das Buch hat 256 Seiten.",
  "Der Film dauert 2 Stunden.",
  "In Deutschland leben etwa 84 Millionen Menschen.",
  "Der Supermarkt hat von 7.00 bis 22.00 Uhr geöffnet.",
  "Das Meeting ist am 15. März um 10.00 Uhr.",
  "Die Prüfung findet am 20. Juni statt.",
  "Preis: 19,90 Euro inkl. MwSt.",
  "Das Konzert beginnt um 19.30 Uhr.",
  "Die Strecke ist 120 km lang.",
  "Angebot gültig bis 31.12.2024.",
  "Eintritt: 5,00 Euro für Erwachsene.",
  "Der Weg ist 2,5 km lang.",
  "Von 9.00 bis 12.00 Uhr bin ich in Besprechungen.",
  "Es ist 23.59 Uhr – gleich Mitternacht.",
  "Kosten: 9,99 Euro pro Person.",
  "Die Kinder sind 6, 8 und 11 Jahre alt.",
  "Bitte bestätige den Termin per E-Mail.",
  "Hast du die Hausaufgaben schon gemacht?",
  "Der neue Mitarbeiter beginnt am 1. September.",
  "Wir fliegen am Freitag nach London.",
  "Die Temperatur ist unter null Grad gefallen.",
  "Mein Geburtstag ist am 4. Juli.",
  "Die Telefonnummer ist 030-12345678.",
  "Ich habe 50 Euro im Lotto gewonnen!",
  "Wer hat die Mona Lisa gemalt?",
  "Das Brandenburger Tor steht in Berlin.",
  "Wir brauchen noch Milch, Eier und Brot.",
  "Der Kurs von Bitcoin schwankt stark.",
  "Österreich hat 9 Bundesländer.",
  "Die Schweiz ist bekannt für Schokolade.",
  "Rom ist eine sehr alte Stadt.",
  "Wie viel kostet das Ticket?",
  "Ich warte schon seit 30 Minuten.",
  "Der Akku ist gleich leer.",
  "Hast du das Ladegerät gesehen?",
  "Wir schauen heute Abend einen Film.",
  "Pizza oder Pasta? Was möchtest du?",
  "Der Sommer war dieses Jahr sehr heiß.",
  "Im Winter schneit es oft in den Bergen.",
  "Ich fahre gerne mit dem Fahrrad zur Arbeit.",
  "Die U-Bahn war heute wieder sehr voll.",
  "Kannst du mir bitte das Salz geben?",
  "Danke für deine Hilfe!",
  "Entschuldigung, wie komme ich zum Bahnhof?",
  "Guten Morgen, haben Sie gut geschlafen?",
  "Ich wünsche dir ein schönes Wochenende.",
  "Alles Gute zum Geburtstag!",
  "Herzlichen Glückwunsch zur bestandenen Prüfung.",
  "Das hast du sehr gut gemacht.",
  "Ich bin stolz auf dich.",
  "Lass uns bald mal wieder treffen.",
  "Bis bald!",
  "Auf Wiedersehen!",
  "Es war mir eine Freude.",
  "Die Sonne geht im Osten auf.",
  "Wasser kocht bei 100 Grad Celsius.",
  "Eins plus eins ist zwei.",
  "Das Alphabet hat 26 Buchstaben.",
  "Ein Jahr hat 365 Tage, manchmal auch 366.",
  "Februar ist der kürzeste Monat.",
  "Der Rhein ist ein langer Fluss.",
  "Die Alpen sind ein hohes Gebirge.",
  "Fußball ist in Deutschland sehr beliebt.",
  "Die WM findet alle vier Jahre statt.",
  "Wer wird Millionär?",
  "Tatort läuft sonntags um 20.15 Uhr.",
  "Obwohl es regnete, gingen wir spazieren.",
  "Der Arzt sagte, ich solle mich eine Woche schonen.",
  "Wenn du Zeit hast, ruf mich bitte an!",
  "Die Konferenz wurde auf den 12. November verschoben.",
  "Laut Wetterbericht wird es morgen bis zu 28 Grad warm.",
  "Erst wenn du die Prüfung bestanden hast, kannst du weitermachen.",
  "Die Firma hat im letzten Quartal 15 Prozent mehr Umsatz gemacht.",
  "Ich habe vergessen, die Rechnung bis zum 5. des Monats zu bezahlen.",
  "Der Vertrag läuft noch bis Ende 2025.",
  "Bitte füllen Sie das Formular vollständig und leserlich aus.",
  "Ohne deine Unterstützung hätte ich das nie geschafft.",
  "Die Zugverbindung wurde wegen Bauarbeiten unterbrochen.",
  "Wir empfehlen, die Bewerbung bis spätestens 30. September einzureichen.",
  "Die Geschäftszeiten sind von Montag bis Freitag, 8.00–17.00 Uhr.",
  "Falls du Fragen hast, stehe ich dir gerne zur Verfügung.",
  "Die Miete ist ab dem 1. nächsten Monats fällig.",
  "Trotz der vielen Arbeit hat er immer Zeit für seine Familie.",
  "Die Veranstaltung beginnt pünktlich um 19.00 Uhr; Einlass ab 18.30 Uhr.",
  "Guten Tag!, sagte der Portier und öffnete die Tür.",
  "Die Adresse lautet: Musterstrasse 42, 10115 Berlin.",
  "Bitte antworte bis spätestens Freitag, 17.00 Uhr (MEZ).",
  "Er hat 3 Äpfel, 2 Birnen und 1 Kilo Kartoffeln gekauft.",
  "Der Zug hatte 45 Minuten Verspätung - eine Entschuldigung gab es nicht.",
  "In Abs. 3 Abs. 2 steht: Die Frist beträgt 14 Tage.",
  "E-Mail: info-at-beispiel.de; Tel.: 030 123456.",
  "Die Durchschnittstemperatur lag bei -2 Grad; nachts sogar bei -8 Grad.",
  "Wer nicht fragt, bleibt dumm. - So lautet ein bekanntes Sprichwort.",
  "Kosten: 99,00 Euro (inkl. 19 % MwSt.) zzgl. Versand.",
  "Die Studie zeigt: 78 % der Befragten sind zufrieden.",
  "Öffnungszeiten: Mo-Fr 9-18 Uhr, Sa 9-13 Uhr.",
  "Er sagte: Ich komme morgen. - Sie antwortete: Gut, bis dann!",
  "Die Strecke (ca. 120 km) kann in etwa 1,5 Stunden bewältigt werden.",
  "Bitte beachten Sie: Der Eingang befindet sich auf der Rückseite (Nr. 5).",
  "Von 10.000 Bewerbern wurden nur 50 eingeladen.",
  "Der Vertrag gilt ab dem 1.1.2025; Kündigung mit 3 Monaten Frist.",
  "Alles hat ein Ende, nur die Wurst hat zwei.",
  "Die Geschwindigkeit betrug 130 km/h - also genau Tempolimit.",
  "Er hat 2x ja und 1x nein geantwortet.",
  "Lieferzeit: 3-5 Werktage (ausgenommen Feiertage).",
  "Die Quote lag bei 42,7 %; im Vorjahr waren es 38,1 %.",
  "Übung macht den Meister. - Das gilt auch beim Tippen."
];

const PROFI_SENTENCES = [
  "Preise: 19,99 € inkl. MwSt.",
  "Kontakt: info@example.com oder admin@web.de",
  "Skonto: 2 % bei Zahlung binnen 7 Tagen.",
  "Login: User_123 & Pass#wort!",
  "Gesetz: § 433 BGB regelt den Kaufvertrag.",
  "Temperatur: Heute sind es 23 °C.",
  "Rechnung: (10 + 5) * 2 = 30.",
  "Rabatt-Code: #SALE2024",
  "Datei: C:\\Windows\\System32\\drivers",
  "Webseite: https://www.google.de",
  "Er rief: Achtung, fertig, los!",
  "Die Straße ist nass.",
  "Grüße aus Berlin, deine Susi.",
  "Spaß muss sein!",
  "Das Maß ist voll.",
  "Fußball-WM 2026: Wer ist dabei?",
  "100 % Motivation ist nötig.",
  "Bitte überweisen Sie 45,50 €.",
  "Tel: +49 (0) 30 / 123 45 67",
  "Öffnungszeiten: Mo–Fr 9:00–18:00 Uhr.",
  "Währungskurs: 1 € = 1,10 $.",
  "Programmierer nutzen oft { } und [ ].",
  "HTML nutzt <tags> und </tags>.",
  "Bitte nicht stören!",
  "Der § 1 DSGVO ist wichtig.",
  "Kosten: 50 € zzgl. 3,50 € Versand.",
  "Email: max_mustermann@provider.net",
  "Mathe: 50 % von 200 ist 100.",
  "Ort: 52° 31' N, 13° 24' O",
  "Status: Online (grün) / Offline (rot)",
  
  // --- NEU: MEHR VARIATION ---
  "Die Gleichung lautet: f(x) = x^2 + 2x - 5.",
  "Importante Info: Bitte *nicht* löschen!",
  "C:\\Program Files\\Tippsy\\bin\\run.exe",
  "Der Hashtag #TippsyGoesViral trendet.",
  "User @WebDev_2024 hat gepostet:",
  "while (i < 10) { console.log(i); i++; }",
  "Preisänderung: Alter Preis 99 € -> Neuer Preis 79 €!",
  "Die Tastenkombination ist Strg + Alt + Entf.",
  "Achtung: Baustelle auf der A1 [KM 120-130].",
  "Gemäß § 823 Abs. 1 BGB haften Sie für Schäden.",
  "Versandkostenfrei ab 29,00 € Bestellwert.",
  "1 Gigabyte (GB) = 1.024 Megabyte (MB).",
  "Sonderzeichen-Mix: & % $ § @ €",
  "Frage: Bist du bereit? (Ja/Nein)",
  "Ergebnis: 12 + 4 * (10 - 2) = 44.",
  "Login failed: Error #404 (Not Found).",
  "Die Domain www.beispiel.de ist vergeben.",
  "30% Rabatt auf alles! *Ausgenommen Tiernahrung.",
  "Einkaufsliste: Milch, Brot, Eier & Käse.",
  "Gedankenstrich: Das war knapp - wirklich knapp.",
  "Klammern können (verschachtelt [sein]).",
  "Menge: A und B = {x | x in A und x in B}",
  "Die Temperatur fiel auf -5,5 Grad Celsius.",
  "Route: Berlin -> München -> Wien.",
  "Ich habe dich lieb <3",
  "Smiley: :-) oder ;-) oder :-P",
  "Der Pfad ist /usr/local/bin/node.",
  "Bitte drücken Sie die Taste <ENTER>.",
  "Abonniere meinen Kanal & like das Video!",
  "Die Mehrwertsteuer (MwSt.) beträgt 19 %.",
  "Das ist 'fett' gedruckt und das _kursiv_.",
  "Passwort-Sicherheit: Nutze Sonderzeichen wie !?#*",
  "Der Kursverlust beträgt -2,5 %.",
  "Die E-Mail ging an support@firma.co.uk.",
  "Am 24.12. ist Weihnachten.",
  "Er sagte: Ich liebe Musik. & Kunst.",
  "Die IP-Adresse ist 192.168.0.1.",
  "Rechnung Nr. 2024/001 über 150,00 €.",
  "Zutaten: Wasser, Zucker, Säuerungsmittel (E330).",
  "Die Lösung ist x = (-b + Wurzel(b^2 - 4ac)) / 2a.",
  "Wir treffen uns um 20:15 Uhr.",
  "System: Windows 11 (Pro Version).",
  "Tags: #Urlaub #Sonne #Strand",
  "Wahrheitstabelle: 1 AND 0 = 0.",
  "Bitte überweisen an IBAN: DE12 3456 7890...",
  "Die maximale Größe ist <= 5 MB.",
  "Verhältnis 16:9 ist Standard bei TV.",
  "Er wohnt in der Goethestraße 13a.",
  "Kopie an: chef@büro.de; team@büro.de",
  "Der Download läuft... 99% fertig.",
  "Warnung: Löschen? [J]a / [N]ein",
  "Die Datei config_final_v2.json fehlt.",
  "Mathe: 50 % von 200 ist 100.",
  "Ort: 52° 31' N, 13° 24' O",
  "Status: Online (grün) / Offline (rot)"
];

const CODER_SENTENCES = [
  // --- VARIABLES & TYPES ---
  "const x = 10; let y = 20;",
  "var name: string = 'Tippsy';",
  "let isActive: boolean = true;",
  "const PI = 3.14159;",
  "let count = 0;",
  "const emptyList = [];",
  "let user = { id: 1, name: 'Bob' };",
  "const isNull = (value === null);",
  "let summary = 'Total: ' + total;",

  // --- LOGIC & LOOPS ---
  "if (x > y) { return true; }",
  "else { return false; }",
  "for (let i = 0; i < 10; i++)",
  "while (true) { break; }",
  "switch (key) { case 'A': break; }",
  "return (a + b) * c;",
  "if (user && user.isLoggedIn)",
  "const isValid = input.length > 5;",
  "x += 1; y -= 1;",
  "if (err) throw new Error(err);",

  // --- FUNCTIONS ---
  "function init() { start(); }",
  "const add = (a, b) => a + b;",
  "function render(props) { return null; }",
  "const map = arr.map(x => x * 2);",
  "list.forEach(item => console.log(item));",
  "const filtered = data.filter(d => d.ok);",
  "setTimeout(() => done(), 1000);",
  "export default class Main {}",

  // --- DOM & API ---
  "document.getElementById('app');",
  "window.addEventListener('load', init);",
  "fetch('/api/data').then(r => r.json());",
  "console.log('Debug:', value);",
  "alert('Hello World!');",
  "localStorage.setItem('key', 'value');",
  "const btn = document.querySelector('.btn');",

  // --- OBSCURE / SYMBOLS ---
  "const regex = /^[a-z]+$/;",
  "let hex = 0xFF00FF;",
  "const binary = 0b101010;",
  "x <<= 1; // Bitwise shift",
  "a || b; a && b; !c;",
  "user?.address?.street;",
  "const tuple = [1, 'text'];",
  "import { useState } from 'react';",
  "package main; import 'fmt';",
  "public static void main(String[] args)",

  // --- HTML / XML ---
  "<div>Hello World</div>",
  "<a href='https://google.com'>Link</a>",
  "<img src='logo.png' alt='Logo' />",
  "<br /> <hr /> <!-- Comment -->",
  "class='btn btn-primary'",
  "style='color: red; margin: 10px;'",

  // --- PYTHON ---
  "print('Hello ' + name)",
  "def add(a, b): return a + b",
  "if __name__ == '__main__':",
  "list = [x for x in range(10)]",
  "import numpy as np",

  // --- C# / JAVA ---
  "Console.WriteLine('Hello');",
  "System.out.println('Java');",
  "public class User { public int Id; }",
  "List<string> names = new List<string>();",
  "int[] numbers = { 1, 2, 3 };",
  "using System.Linq;",
  "throw new Exception('Error');",
  "String.join(', ', list);",
  "var query = from c in db select c;",

  // --- SQL (New) ---
  "SELECT * FROM users;",
  "DROP TABLE IF EXISTS test;",
  "INSERT INTO log (msg) VALUES ('Hi');",
  "SELECT count(*) FROM data GROUP BY id;",
  "UPDATE settings SET active = 1;",

  // --- CSS (New) ---
  "display: flex; flex-direction: row;",
  "margin: 0 auto; padding: 20px;",
  "color: rgba(255, 0, 0, 0.5);",
  "@media (max-width: 768px) { }",
  "font-family: 'Roboto', sans-serif;",
  
  // --- JSON / OBJECTS ---
  "{ 'key': 'value', 'id': 123 }",
  "JSON.stringify({ a: 1, b: 2 });",
  "data: { labels: [], datasets: [] }",

  // --- TERMINAL / SHELL ---
  "npm install react react-dom",
  "git commit -m 'Fix bug'",
  "ls -la /var/www/html",
  "docker-compose up -d",
  "python3 script.py --verbose"
];

/**
 * Generates typing content focused on real words and sentences when possible,
 * or word-like / sentence-like pseudo content when the stage has few letters.
 */
export function generateWordSentenceLevel(stage: Stage): string {
  const allChars = new Set(stage.chars);
  const useCapitalization = stage.id >= 9;
  const usePunctuation = stage.id >= 10;
  const isMeisterklasse = stage.id >= 11;
  const isProfi = stage.id === 12;
  const isCoder = stage.id === 13;

  const poolAll = stage.chars.filter((c) => c !== ' ' && c.length === 1);
  const allWords = [...COMMON_WORDS_DB, ...EXTRA_WORDS];
  const possibleWords = allWords.filter((w) => canTypeWord(w, allChars));
  let possibleSentences = SENTENCES_DB.filter((s) => canTypeWord(s, allChars));
  
  if (isMeisterklasse && usePunctuation && !isProfi && !isCoder) {
    const extra = MEISTERKLASSE_SENTENCES.filter((s) => canTypeWord(s, allChars));
    possibleSentences = [...possibleSentences, ...extra];
  } else if (isProfi) {
    // In Profi stage, prioritize sentences with special chars
    const extra = PROFI_SENTENCES.filter((s) => canTypeWord(s, allChars));
    possibleSentences = [...extra, ...MEISTERKLASSE_SENTENCES, ...possibleSentences];
  } else if (isCoder) {
    // Stage 13: Coder Mode - Prioritize code snippets
    const extra = CODER_SENTENCES.filter((s) => canTypeWord(s, allChars));
    possibleSentences = [...extra]; // Ideally mostly code
  }

  const sentenceCount = (isMeisterklasse || isProfi || isCoder)
    ? 6 + Math.floor(Math.random() * 5)   // 6–10 Sätze für Meister/Profi/Coder
    : 3 + Math.floor(Math.random() * 3);   // 3–5 Sätze sonst
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
