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
  "Öffnungszeiten: Mo-Fr 9.00-18.00 Uhr, Sa 9.00-13.00 Uhr. Ausserhalb dieser Zeiten können Sie uns eine E-Mail an kontakt-at-example.de schreiben. Wir melden uns so schnell wie möglich bei Ihnen zurück. Unser Kundenservice freut sich auf Ihre Nachricht.",
  
  // --- WISSEN & TECHNIK ---
  "Im Jahr 1969 betrat der erste Mensch den Mond. Neil Armstrong sprach die berühmten Worte, die in die Geschichte eingingen: Ein kleiner Schritt für einen Menschen, aber ein grosser Sprung für die Menschheit. Dieses Ereignis zeigte der Welt, was durch Technik, Mut und Zusammenarbeit möglich ist.",
  "Die Digitalisierung verändert unsere Arbeitswelt rasant. Immer mehr Prozesse werden automatisiert, was neue Chancen, aber auch Herausforderungen mit sich bringt. Es ist wichtig, sich ständig weiterzubilden, um am Ball zu bleiben. Wer offen für Neues ist, wird die Zukunft aktiv mitgestalten können.",
  "Künstliche Intelligenz, kurz KI, ist ein Teilgebiet der Informatik. Sie befasst sich mit der Automatisierung intelligenten Verhaltens und dem maschinellen Lernen. Computer können heute schon Bilder erkennen, Sprachen übersetzen und komplexe Spiele wie Schach oder Go gewinnen.",
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
  "Anna lief so schnell sie konnte zum Bahnhof. Der Zug sollte in drei Minuten abfahren, und sie musste ihn unbedingt erreichen. Ausser Atem kam sie am Gleis 3 an, gerade als der Schaffner die Tür schliessen wollte. Noch geschafft!, rief sie erleichtert und sprang hinein.",
  "Der kleine Hund bellte fröhlich, als er den Ball sah. Er rannte über die Wiese, schnappte sich das Spielzeug und brachte es schwanzwedelnd zu seinem Herrchen zurück. Braver Hund!, lobte der Mann und warf den Ball erneut weit weg.",
  "Lisa hatte lange für diesen Tag geübt. Heute war das grosse Konzert in der Stadthalle. Mit zitternden Händen betrat sie die Bühne, doch als sie die ersten Töne auf ihrer Geige spielte, verflog die Aufregung. Die Musik erfüllte den Raum und das Publikum lauschte gebannt.",

  // --- GESUNDHEIT & ALLTAG ---
  "Ausreichend Schlaf ist wichtig für die Gesundheit. Erwachsene brauchen etwa 7 bis 8 Stunden pro Nacht, um fit und leistungsfähig zu bleiben. Wer zu wenig schläft, wird schneller krank und kann sich schlechter konzentrieren. Ein fester Rhythmus hilft dem Körper, zur Ruhe zu kommen.",
  "Der Arzt empfahl ihr, sich eine Woche zu schonen und viel zu trinken. Die Grippe war zwar überstanden, aber der Husten wollte nicht weichen. Sie blieb zu Hause, las ein Buch und trank täglich 2 Liter Tee. Nach sieben Tagen fühlte sie sich endlich wieder fit.",
  "Bewegung an der frischen Luft tut gut. Schon 30 Minuten Spaziergang am Tag können das Wohlbefinden steigern. Viele Menschen fahren mit dem Rad zur Arbeit oder gehen in der Mittagspause eine Runde um den Block. Wer sich regelmässig bewegt, bleibt länger gesund.",

  // --- SPORT & FREIZEIT ---
  "Fussball ist in Deutschland die beliebteste Sportart. Millionen Menschen schauen jeden Samstag die Bundesliga im Fernsehen oder gehen ins Stadion. Die Nationalmannschaft hat schon vier Weltmeistertitel gewonnen, zuletzt 2014 in Brasilien. Der nächste EM-Termin steht schon fest.",
  "Beim Joggen im Park begegnete er jeden Morgen denselben Gesichtern. Die ältere Dame mit dem Hund, der junge Mann mit den Kopfhörern, die Gruppe von drei Frauen, die schnell an ihm vorbeizogen. Er mochte diese stille Gemeinschaft, die sich nie grüsste und doch vertraut war.",
  "Das Schwimmbad hat von 6.00 bis 22.00 Uhr geöffnet. Morgens kommen die Frühschwimmer, ab 10.00 Uhr die Familien mit Kindern, am Abend die Berufstätigen, die nach der Arbeit noch ihre Bahnen ziehen. Eintritt: 4,50 Euro für Erwachsene, 2,00 Euro für Kinder.",

  // --- GESCHICHTE & WISSEN ---
  "Die Mauer fiel am 9. November 1989. Nach Jahrzehnten der Teilung konnten die Menschen endlich wieder frei zwischen Ost und West reisen. Dieses Datum hat die deutsche Geschichte für immer verändert. Noch heute wird daran jedes Jahr erinnert.",
  "Gutenberg erfand im 15. Jahrhundert den Buchdruck mit beweglichen Lettern. Dadurch konnten Bücher viel schneller und günstiger hergestellt werden. Das Wissen verbreitete sich in ganz Europa, und die Reformation wäre ohne den Druck vielleicht anders verlaufen.",
  "In Deutschland gibt es 16 Bundesländer. Jedes hat seine eigene Hauptstadt, seine eigenen Gesetze in manchen Bereichen und oft auch einen eigenen Dialekt. Bayern ist das flächenmässig grösste Land, Berlin die bevölkerungsreichste Stadt. Die Kleinsten sind Bremen und das Saarland.",

  // --- SPRACHE & KOMMUNIKATION ---
  "Die deutsche Sprache hat viele lange Wörter. Zusammengesetzte Substantive wie Donaudampfschifffahrtsgesellschaft sind zwar selten, aber grammatikalisch völlig korrekt. Für Lernende kann das am Anfang verwirrend sein. Mit der Zeit gewöhnt man sich an die Struktur.",
  "Höflichkeit ist in der Kommunikation wichtig. Bitte und Danke öffnen Türen, und ein freundlicher Ton macht vieles einfacher. Auch in E-Mails und Nachrichten sollte man nicht zu knapp oder unfreundlich wirken. Ein kurzer Gruss am Anfang und Ende wirkt Wunder.",
  "Viele Deutsche sprechen neben ihrer Muttersprache noch Englisch. In der Schule wird es ab der 5. Klasse unterrichtet, und im Urlaub oder im Beruf kommt man oft nicht darum herum. Manche lernen auch Französisch, Spanisch oder Latein. Sprachen verbinden Menschen.",

  // --- ARBEIT & WIRTSCHAFT ---
  "Die Firma hat im letzten Quartal 15 Prozent mehr Umsatz gemacht als im Vorjahr. Die Geschäftsleitung ist zufrieden und plant, neue Mitarbeiter einzustellen. Ab dem 1. September sollen zehn Stellen in der IT-Abteilung besetzt werden. Bewerbungen sind ab sofort möglich.",
  "Das Homeoffice hat sich in vielen Branchen durchgesetzt. Wer von zu Hause arbeitet, spart Fahrtzeit und kann sich die Zeit oft freier einteilen. Wichtig sind ein fester Arbeitsplatz, klare Zeiten und Pausen. Nicht jeder kommt damit gleich gut zurecht.",
  "Die Geschäftszeiten sind von Montag bis Freitag, 8.00-17.00 Uhr. In dringenden Fällen erreichen Sie uns auch am Wochenende unter der Nummer 0800-123456. Bitte haben Sie Ihre Kundennummer bereit, wenn Sie anrufen. Wir freuen uns auf Ihre Nachricht.",

  // --- NATUR & JAHRESZEITEN ---
  "Im Herbst werden die Tage kürzer und die Blätter bunt. Viele Menschen sammeln Kastanien und Eicheln mit ihren Kindern oder backen den ersten Kuchen mit Äpfeln aus dem Garten. Die Erntezeit ist eine besondere Phase im Jahr. Bald kommt der erste Frost.",
  "An Silvester um Mitternacht feuern viele Menschen Raketen und Böller ab. Der Himmel leuchtet in allen Farben, und überall hört man Lachen und Glückwünsche. Gutes neues Jahr!, ruft man sich zu. Der 1. Januar ist in Deutschland ein Feiertag, an dem die meisten ausschlafen.",
  "Die Zugvögel fliegen im Herbst in den Süden und kehren im Frühling zurück. Störche, Schwalben und Kraniche legen dabei Tausende von Kilometern zurück. Sie orientieren sich am Magnetfeld der Erde und an den Sternen. Noch immer gibt es viele Rätsel um dieses Phänomen.",

  // --- KURZE GESCHICHTEN ---
  "Der Wecker klingelte um 6.30 Uhr, aber Markus drückte noch zweimal auf die Schlummertaste. Als er endlich aufstand, war die Kaffeemaschine kaputt. Er trank Tee, nahm den Bus statt das Rad und kam trotzdem pünktlich. Manchmal läuft eben alles schief - und dann doch wieder gut.",
  "Sie öffnete den Brief und las die ersten Zeilen. Wir freuen uns, Ihnen mitteilen zu können... Sie musste nicht weiterlesen. Der Vertrag war ihr! Sie rief ihre Mutter an und weinte vor Glück. Fünf Jahre Bewerbungen, Absagen, Zweifel - und jetzt endlich ein Ja.",
  "Der Zug hatte 20 Minuten Verspätung. Statt um 18.00 Uhr kam er erst um 18.20 Uhr. Auf dem Bahnsteig warteten Dutzende Menschen mit genervten Gesichtern. Ein Kind weinte, ein Mann schimpfte laut in sein Handy. Die Ansage entschuldigte sich und versprach: Nächster Zug in 10 Minuten."
];

// Profi-Texte (Stage 12): Sonderzeichen, E-Mails, Code, Preise, Gesetze
const PROFI_TEXTS: string[] = [
  // --- E-MAIL & KONTAKT ---
  "Bitte senden Sie die Unterlagen an max.mustermann@example.com oder rufen Sie uns unter +49 30 1234567 an. Unser Support-Team ist auch per Chat erreichbar. Wir freuen uns auf Ihr Feedback!",
  "Die neue Adresse lautet: Firmenname GmbH, Hauptstr. 42 / Gebäude B, 10115 Berlin. (Eingang im Hinterhof). Bitte klingeln Sie bei 'Müller & Partner'.",
  "Betreff: AW: Rechnung Nr. 2024-001 / Kunden-ID #9923. Sehr geehrte Frau Schmidt, hiermit bestätigen wir den Eingang Ihrer Zahlung in Höhe von 450,00 €. Vielen Dank!",

  // --- FINANZEN & PREISE ---
  "Das Sonderangebot gilt nur heute: 3 T-Shirts für 29,99 € (statt 45,00 €). Sie sparen über 30 %! Greifen Sie zu, solange der Vorrat reicht. Inkl. 19 % MwSt., zzgl. Versand.",
  "Die Aktie stieg um 2,5 % auf einen Wert von 123,45 $. Analysten erwarten einen weiteren Anstieg auf bis zu 130,00 $. Das Kurs-Gewinn-Verhältnis (KGV) liegt bei 15,2.",
  "Miete: 850,00 € + 120,00 € Nebenkosten = 970,00 € Gesamtmiete. Die Kaution beträgt 3 Monatsmieten (2.550,00 €). Bitte überweisen Sie den Betrag bis zum 3. Werktag des Monats.",

  // --- RECHT & GESETZE ---
  "Gemäß § 433 BGB ist der Verkäufer verpflichtet, dem Käufer die Sache zu übergeben und das Eigentum daran zu verschaffen. Der Käufer ist verpflichtet, den vereinbarten Kaufpreis zu zahlen.",
  "Laut StVO § 3 Abs. 3 beträgt die zulässige Höchstgeschwindigkeit innerhalb geschlossener Ortschaften 50 km/h. Auf Autobahnen gilt eine Richtgeschwindigkeit von 130 km/h, sofern nicht anders ausgeschildert.",
  "Datenschutzerklärung: Wir speichern Ihre Daten gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung. Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung (§§ 15-17 DSGVO).",

  // --- TECHNIK & CODE (Light) ---
  "Um die Datei zu speichern, drücken Sie Strg + S (Windows) oder Cmd + S (Mac). Mit Alt + F4 schließen Sie das Fenster. Der Pfad lautet: C:\\Dokumente\\Projekte\\Bericht_Final_v2.docx",
  "HTML-Grundgerüst: <html> <head> <title>Meine Seite</title> </head> <body> <h1>Hallo Welt!</h1> <p>Das ist ein Absatz.</p> </body> </html>. Vergessen Sie nicht das schließende Tag!",
  "Fehlermeldung: 'Error 404: Page not found'. Bitte überprüfen Sie die URL (http://www.beispiel.de/index.php?id=123&lang=de) oder versuchen Sie es später erneut.",
  "Die Funktion berechnet den Durchschnitt: f(x) = (a + b) / 2. Wenn a = 10 und b = 20, dann ist f(x) = 15. Mathe ist gar nicht so schwer, oder?",

  // --- LEBENSMITTEL & MENGEN ---
  "Rezept für Pfannkuchen: 200 g Mehl, 2 Eier, 300 ml Milch, 1 Prise Salz und 1 EL Zucker. Alles verrühren und in der Pfanne goldbraun backen. Lecker! Servieren mit Apfelmus oder Schokolade.",
  "Einkaufsliste: 1,5 kg Kartoffeln, 500 g Hackfleisch, 1 l Milch (3,5 % Fett), 6 Eier (Größe M) und 1 Netz Orangen. Vergiss nicht das Basilikum!",
  "Die Temperatur im Kühlschrank sollte zwischen 5 °C und 7 °C liegen. Im Gefrierfach sind -18 °C optimal, um Lebensmittel lange frisch zu halten.",

  // --- TYPOGRAFIE & SYMBOLE ---
  "Sonderzeichen-Test: @ (At-Zeichen), & (Kaufmanns-Und), § (Paragraf), € (Euro), % (Prozent), # (Raute/Hashtag). Alles gefunden? Super! Weiter geht's mit Klammern: ( ) [ ] { }.",
  "Das Zitat lautet: „Der Weg ist das Ziel.“ (Konfuzius). Manchmal schreibt man auch 'Der Weg ist das Ziel' oder sogar »Der Weg ist das Ziel«.",
  "Groß- und Kleinschreibung nicht vergessen! DIE KATZE SCHLÄFT auf dem Sofa. der hund bellt im garten. ACHTUNG: Hier gilt Rechts-Vor-Links!"
];

// Coder Mode (Stage 13): Echter Code (JS/TS/Python Style)
const CODER_TEXTS: string[] = [
  // --- BASICS & VARIABLES ---
  "const pi = 3.14159;\nlet radius = 10;\nlet area = pi * radius * radius;\nconsole.log('Area:', area);\nif (area > 100) {\n  console.log('Large Circle');\n} else {\n  console.log('Small Circle');\n}",
  "var name = 'Max';\nvar age = 25;\nvar isStudent = true;\nif (isStudent) {\n  console.log(name + ' is a student.');\n} else {\n  console.log(name + ' works.');\n}",
  
  // --- FUNCTIONS & LOGIC ---
  "function add(a, b) {\n  return a + b;\n}\nconst result = add(5, 7);\nconsole.log(result); // Output: 12\n\nfunction multiply(x, y) {\n  return x * y;\n}",
  "const greet = (name) => {\n  return 'Hello, ' + name + '!';\n};\nconsole.log(greet('World'));\nconst square = x => x * x;\nconsole.log(square(4));",
  "function isEven(n) {\n  return n % 2 === 0;\n}\nfor (let i = 0; i < 10; i++) {\n  if (isEven(i)) {\n    console.log(i + ' is even');\n  }\n}",

  // --- ARRAYS & OBJECTS ---
  "const users = ['Alice', 'Bob', 'Charlie'];\nusers.forEach(user => {\n  console.log('User: ' + user);\n});\nconst found = users.find(u => u === 'Bob');",
  "const config = {\n  host: 'localhost',\n  port: 8080,\n  debug: true\n};\nif (config.debug) {\n  console.log('Server running on port ' + config.port);\n}",
  "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst filtered = numbers.filter(n => n > 2);\nconsole.log(doubled);",

  // --- CLASSES & OOP ---
  "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    console.log(this.name + ' makes a noise.');\n  }\n}\nconst dog = new Animal('Rex');\ndog.speak();",
  "class Rectangle {\n  constructor(w, h) {\n    this.width = w;\n    this.height = h;\n  }\n  getArea() {\n    return this.width * this.height;\n  }\n}\nconst rect = new Rectangle(10, 5);",

  // --- ASYNC & PROMISES (JS/TS) ---
  "async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}",
  "const promise = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve('Success!');\n  }, 1000);\n});\npromise.then(res => console.log(res));",
  "const [users, setUsers] = useState([]);\nuseEffect(() => {\n  loadUsers().then(data => setUsers(data));\n}, []);",
  "try {\n  await db.connect();\n  console.log('Connected');\n} finally {\n  await db.close();\n}",

  // --- PYTHON ---
  "def fibonacci(n):\n  if n <= 1:\n    return n\n  else:\n    return fibonacci(n-1) + fibonacci(n-2)\nprint(fibonacci(10))",
  "users = {'name': 'John', 'age': 30}\nfor key, value in users.items():\n  print(f'{key}: {value}')\nif users['age'] > 18:\n  print('Adult')",
  "import os\n\ndef list_files(path):\n  for file in os.listdir(path):\n    if file.endswith('.py'):\n      print('Found Logic: ' + file)",
  "with open('data.txt', 'r') as f:\n  lines = f.readlines()\n  for line in lines:\n    print(line.strip())\n",
  "numbers = [1, 2, 3, 4, 5]\nsquared = [n ** 2 for n in numbers if n % 2 == 0]\nprint(squared)",

  // --- JAVA ---
  "public class Main {\n  public static void main(String[] args) {\n    System.out.println('Hello Java!');\n    int[] numbers = {1, 2, 3};\n    for (int n : numbers) {\n      System.out.print(n + ' ');\n    }\n  }\n}",
  "import java.util.ArrayList;\nList<String> list = new ArrayList<>();\nlist.add('Alpha');\nlist.add('Beta');\nif (list.contains('Alpha')) {\n  System.out.println('Found it!');\n}",
  "public interface Animal {\n  void makeSound();\n}\npublic class Dog implements Animal {\n  @Override\n  public void makeSound() {\n    System.out.println('Woof');\n  }\n}",
  "try (BufferedReader br = new BufferedReader(new FileReader('file.txt'))) {\n  String line;\n  while ((line = br.readLine()) != null) {\n    System.out.println(line);\n  }\n} catch (IOException e) {\n  e.printStackTrace();\n}",

  // --- C# (CSHARP) ---
  "using System;\n\nnamespace HelloWorld {\n  class Program {\n    static void Main(string[] args) {\n      Console.WriteLine('Hello World!');\n      var date = DateTime.Now;\n      Console.WriteLine('Time: ' + date);\n    }\n  }\n}",
  "public int Add(int x, int y) {\n  if (x < 0 || y < 0) {\n    throw new ArgumentException('Positive only');\n  }\n  return x + y;\n}",
  "var numbers = new List<int> { 1, 2, 3, 4, 5 };\nvar evenNumbers = numbers.Where(n => n % 2 == 0).ToList();\nforeach (var n in evenNumbers) {\n  Console.WriteLine(n);\n}",
  "public async Task<string> GetDataAsync() {\n  await Task.Delay(1000);\n  return 'Data loaded';\n}",

  // --- HTML, XML & CSS ---
  "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <div id='app' class='container'>\n    <h1>Welcome</h1>\n    <p>This is a paragraph.</p>\n  </div>\n</body>\n</html>",
  "<form action='/submit' method='POST'>\n  <label for='email'>Email:</label>\n  <input type='email' id='email' name='email' required />\n  <button type='submit'>Send</button>\n</form>",
  ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background-color: #f0f0f0;\n}",
  "<nav>\n  <ul>\n    <li><a href='#home'>Home</a></li>\n    <li><a href='#about'>About</a></li>\n    <li><a href='#contact'>Contact</a></li>\n  </ul>\n</nav>",

  // --- SQL ---
  "SELECT * FROM users WHERE age > 18 ORDER BY created_at DESC;\nUPDATE users SET status = 'active' WHERE id = 42;\nDELETE FROM logs WHERE created_at < '2023-01-01';",
  "CREATE TABLE products (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  price DECIMAL(10, 2)\n);\nINSERT INTO products VALUES (1, 'Laptop', 999.99);"
];

// Generates the content based on pedagogical levels
export const generatePatternLevel = (stage: Stage, subLevelId: number): string => {
  // Meisterklasse (Stage 11), Profi (Stage 12), Coder (Stage 13)
  if (stage.id >= 11) {
    let texts: string[] = [];
    if (stage.id === 13) texts = CODER_TEXTS;
    else if (stage.id === 12) texts = PROFI_TEXTS;
    else texts = MEISTERKLASSE_TEXTS;

    const count = texts.length;
    
    // Pick specific paragraphs to ensure coherence
    if (subLevelId === 0) {
      const p1 = texts[Math.floor(Math.random() * count)];
      let p2 = texts[Math.floor(Math.random() * count)];
      while(p1 === p2) p2 = texts[Math.floor(Math.random() * count)];
      return p1 + " " + p2;
    }

    return texts[Math.floor(Math.random() * count)];
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