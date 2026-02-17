import { Stage, Language } from '../types';

// Vowels for pronounceability logic
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü'];

// Left/Right hand mapping for flow generation
const LEFT_HAND = new Set(['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'y', 'x', 'c', 'v', 'b']);
const RIGHT_HAND = new Set(['z', 'u', 'i', 'o', 'p', 'ü', 'h', 'j', 'k', 'l', 'ö', 'ä', 'n', 'm']);

// Expanded common words/fragments
const COMMON_WORDS_DB_DE = [
  "der", "die", "das", "und", "ist", "in", "den", "von", "zu", "mit", "sich", "auf", "für",
  "nicht", "es", "dem", "an", "auch", "als", "da", "nach", "wie", "wir", "aus", "er", "sie",
  "so", "dass", "was", "wird", "bei", "oder", "ein", "eine", "einer", "nur", "vor", "am",
  "habe", "hat", "du", "wo", "wenn", "alle", "sind", "ich", "aber", "hier", "man", "ja", "nein",
  "danke", "bitte", "hallo", "gut", "tag", "viel", "zeit", "jahr", "neu", "alt", "klein", "groß",
  "frau", "mann", "kind", "leben", "welt", "haus", "hand", "auge", "kopf", "tür", "auto",
  "weg", "mal", "nun", "gar", "sei", "ihr", "doch", "ob", "tun", "kam", "sah", "gab", "lag"
];

const COMMON_WORDS_DB_EN = [
  "the", "and", "to", "of", "in", "is", "you", "that", "it", "he", "was", "for", "on",
  "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one",
  "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other",
  "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like",
  "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", "number", "no",
  "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its",
  "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"
];

export const COMMON_WORDS_DB_BY_LANGUAGE: Record<Language, string[]> = {
  de: COMMON_WORDS_DB_DE,
  en: COMMON_WORDS_DB_EN,
};

export const getCommonWords = (language: Language): string[] => {
  return COMMON_WORDS_DB_BY_LANGUAGE[language] ?? COMMON_WORDS_DB_BY_LANGUAGE.en;
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Checks if a word can be typed with the given allowed characters (exported for wordSentenceGenerator)
export const canTypeWord = (word: string, allowedChars: Set<string>): boolean => {
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (!allowedChars.has(char.toLowerCase()) && !allowedChars.has(char)) {
      return false;
    }
  }
  return true;
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
    const isEarlyStage = pool.length <= 3;

    let i = 0;
    while (word.length < length) {
      const currentPool = isLeft ? lefts : rights;
      // Fallback if current hand has no keys in pool (shouldn't happen if check passed, but safety first)
      const char = getRandomItem(currentPool.length > 0 ? currentPool : pool);
      
      // Variable repetition for more variation (especially for early stages with few chars)
      const repeatCount = isEarlyStage && Math.random() < 0.4 ? (Math.random() < 0.7 ? 2 : 3) : 1;
      word += char.repeat(repeatCount);
      
      // Less strict alternation for early stages - 80% chance to switch, 20% to repeat same hand
      if (isEarlyStage) {
        if (Math.random() < 0.8) {
          isLeft = !isLeft;
        }
      } else {
        // Strict alternation for later stages ensures rhythm (f -> j -> d -> k)
        isLeft = !isLeft;
      }
      i++;
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
const MEISTERKLASSE_TEXTS_DE: string[] = [
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

const MEISTERKLASSE_TEXTS_EN: string[] = [
  "On Monday school starts at 8:00 a.m. The children look forward to the day because they can see their friends again. The classroom is bright and friendly, and the teacher has prepared an exciting story. During the break everyone eats a sandwich and plays in the yard.",
  "The invoice totals 45.50 euros including tax. Please transfer the amount within 14 days to our account. Be sure to include your customer number 12345 as the reference so we can match the payment. Thank you for your purchase!",
  "The meeting is on March 15 at 10:00 a.m. in conference room B. We will discuss the quarterly numbers and develop new strategies for the coming year. Please prepare a short presentation and bring your documents. It is important that everyone arrives on time.",
  "Opening hours: Mon–Fri 9:00–18:00, Sat 9:00–13:00. Outside these hours you can email us at kontakt-at-example.de. We will get back to you as quickly as possible. Our customer service team looks forward to your message.",

  "In 1969 the first human stepped onto the moon. Neil Armstrong spoke the famous words that went down in history: one small step for a man, but a giant leap for mankind. This event showed the world what is possible through technology, courage, and cooperation.",
  "Digitalization is rapidly changing our working world. More and more processes are automated, bringing new opportunities but also challenges. It is important to keep learning in order to stay on track. Those who are open to change can actively shape the future.",
  "Artificial intelligence, or AI, is a subfield of computer science. It deals with automating intelligent behavior and machine learning. Computers can already recognize images, translate languages, and win complex games like chess or Go.",
  "The internet connects billions of people worldwide. Within seconds, information can be sent from one end of the world to the other. Social networks allow us to stay in touch even when we are far apart. Still, it is wise to protect your data.",

  "The forest is a complex ecosystem in which plants and animals live in a delicate balance. Trees communicate through their roots and share nutrients. A walk in nature has been proven to reduce stress and is good for the soul.",
  "Bees are essential for our environment. They pollinate blossoms and ensure that fruits and vegetables can grow. Without these hardworking insects we would have far fewer foods. That is why planting bee-friendly flowers is important.",
  "Water is the basis of all life. Our bodies are made up largely of water, and we must drink enough every day to stay healthy. We should handle this precious resource carefully and avoid wasting it.",
  "Climate change is one of the greatest challenges of our time. Temperatures are rising, and the weather is becoming more extreme. Everyone can make a small contribution by saving energy, driving less, or buying regional products.",

  "Berlin is the capital of Germany and has around 3.7 million residents. The city is known for its history, the Brandenburg Gate, and Museum Island. Tourists from all over the world come to experience its unique atmosphere.",
  "Travel broadens the horizon. Those who visit other countries learn about new cultures, languages, and people. You try foreign food, see impressive landscapes, and gather memories that last a lifetime. The world is like a book, and those who do not travel read only one page.",
  "Music is a language everyone understands. Whether classical, rock, pop, or jazz—sounds can express feelings that words often cannot. Many people play an instrument or sing in a choir to make music together.",
  "Reading books is a wonderful hobby. You dive into other worlds, experience adventures, and learn a lot about life. Whether thrilling crime novels, romantic stories, or nonfiction—there is something for every taste.",

  "It was a cold winter evening in December. Snow fell softly on the rooftops, and warm lights glowed in the windows. Thomas sat in his armchair with a cup of tea and listened to the silence. It was the perfect moment to unwind.",
  "Anna ran as fast as she could to the station. The train was to depart in three minutes, and she had to catch it. Out of breath she reached platform 3 just as the conductor was about to close the door. Made it!, she called, and jumped inside.",
  "The small dog barked happily when he saw the ball. He ran across the meadow, grabbed the toy, and brought it back wagging his tail. Good dog!, the man praised, and threw the ball again.",
  "Lisa had practiced for this day for a long time. Today was the big concert in the city hall. With trembling hands she stepped onto the stage, but as she played the first notes on her violin, the nervousness faded. The music filled the room and the audience listened in awe.",

  "Getting enough sleep is important for health. Adults need about 7 to 8 hours per night to stay fit and productive. Those who sleep too little get sick more quickly and have trouble concentrating. A steady routine helps the body rest.",
  "The doctor advised her to take it easy for a week and drink plenty of fluids. The flu was over, but the cough would not go away. She stayed home, read a book, and drank two liters of tea every day. After seven days she finally felt well again.",
  "Movement in the fresh air does you good. Just 30 minutes of walking a day can improve wellbeing. Many people bike to work or take a short walk at lunchtime. Those who exercise regularly stay healthier longer.",

  "Soccer is the most popular sport in Germany. Millions watch the Bundesliga every Saturday on TV or go to the stadium. The national team has already won four World Cups, most recently in 2014 in Brazil. The next European championship date is already set.",
  "While jogging in the park, he met the same faces every morning: the older woman with the dog, the young man with headphones, the group of three women who sprinted past. He liked this quiet community that never greeted him and still felt familiar.",
  "The swimming pool is open from 6:00 a.m. to 10:00 p.m. Early swimmers come in the morning, families with children after 10:00, and working people in the evening. Admission: 4.50 euros for adults, 2.00 euros for children.",

  "The wall fell on November 9, 1989. After decades of division, people could finally travel freely between East and West. This date changed German history forever. It is still remembered every year.",
  "Gutenberg invented movable type printing in the 15th century. As a result, books could be produced much faster and more cheaply. Knowledge spread throughout Europe, and the Reformation might have unfolded differently without the press.",
  "Germany has 16 federal states. Each has its own capital, its own laws in some areas, and often its own dialect. Bavaria is the largest state by area, Berlin the most populous. The smallest are Bremen and Saarland.",

  "The German language has many long words. Compound nouns like Donaudampfschifffahrtsgesellschaft are rare, but grammatically correct. For learners this can be confusing at first. Over time, you get used to the structure.",
  "Politeness is important in communication. Please and thank you open doors, and a friendly tone makes many things easier. Even in emails and messages, you should avoid being too short or unfriendly. A short greeting at the start and end works wonders.",
  "Many Germans speak English in addition to their mother tongue. In school it is taught from the fifth grade, and in travel or work you often cannot avoid it. Some also learn French, Spanish, or Latin. Languages connect people.",

  "The company made 15 percent more revenue last quarter than in the previous year. Management is satisfied and plans to hire new employees. Ten positions in the IT department are to be filled starting September 1. Applications are now open.",
  "Working from home has taken hold in many industries. Those who work from home save commute time and can often structure their day more freely. Important are a fixed workspace, clear hours, and breaks. Not everyone finds it equally easy.",
  "Business hours are Monday to Friday, 8:00 a.m.–5:00 p.m. In urgent cases you can reach us on weekends at 0800-123456. Please have your customer number ready when you call. We look forward to your message.",

  "In autumn the days grow shorter and the leaves turn colorful. Many people collect chestnuts and acorns with their children or bake the first apple cake from the garden. The harvest season is a special time of year. Soon the first frost arrives.",
  "On New Year’s Eve at midnight many people set off fireworks. The sky lights up with colors, and you hear laughter and good wishes everywhere. Happy New Year!, people call out. January 1 is a holiday in Germany, and most people sleep in.",
  "Migratory birds fly south in autumn and return in spring. Storks, swallows, and cranes travel thousands of kilometers. They orient themselves by Earth’s magnetic field and the stars. There are still many mysteries around this phenomenon.",

  "The alarm rang at 6:30 a.m., but Markus hit snooze twice. When he finally got up, the coffee machine was broken. He drank tea, took the bus instead of his bike, and still arrived on time. Sometimes everything goes wrong—and then turns out fine.",
  "She opened the letter and read the first lines. We are pleased to inform you... She did not need to read further. The contract was hers! She called her mother and cried with joy. Five years of applications, rejections, doubts—and now finally a yes.",
  "The train was 20 minutes late. Instead of arriving at 6:00 p.m., it came at 6:20. Dozens of people waited on the platform with annoyed faces. A child cried, a man argued into his phone. The announcement apologized and promised: Next train in 10 minutes."
];

export const MEISTERKLASSE_TEXTS: Record<Language, string[]> = {
  de: MEISTERKLASSE_TEXTS_DE,
  en: MEISTERKLASSE_TEXTS_EN,
};

// Profi-Texte (Stage 12): Sonderzeichen, E-Mails, Code, Preise, Gesetze
const PROFI_TEXTS_DE: string[] = [
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

const PROFI_TEXTS_EN: string[] = [...MEISTERKLASSE_TEXTS_EN];

export const PROFI_TEXTS: Record<Language, string[]> = {
  de: PROFI_TEXTS_DE,
  en: PROFI_TEXTS_EN,
};

// Coder Mode (Stage 13): Echter Code (JS/TS/Python Style)
const CODER_TEXTS_SHARED: string[] = [
  // --- BASICS & VARIABLES ---
  "const pi = 3.14159;\nlet radius = 10;\nlet area = pi * radius * radius;\nconsole.log('Area:', area);\nif (area > 100) {\n  console.log('Large Circle');\n} else {\n  console.log('Small Circle');\n}",
  "var name = 'Max';\nvar age = 25;\nvar isStudent = true;\nif (isStudent) {\n  console.log(name + ' is a student.');\n} else {\n  console.log(name + ' works.');\n}",

  // --- FUNCTIONS & LOGIC ---
  "function add(a, b) {\n  return a + b;\n}\nconst result = add(5, 7);\nconsole.log(result); // Output: 12\n\nfunction multiply(x, y) {\n  return x * y;\n}",
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

export const CODER_TEXTS: Record<Language, string[]> = {
  de: CODER_TEXTS_SHARED,
  en: CODER_TEXTS_SHARED,
};

// Generates the content based on pedagogical levels
export const generatePatternLevel = (stage: Stage, subLevelId: number, language: Language): string => {
  // Meisterklasse (Stage 11), Profi (Stage 12), Coder (Stage 13), Mixed (Stage 14/15)
  if (stage.id >= 11) {
    let texts: string[] = [];
    if (stage.id === 13) texts = CODER_TEXTS[language];
    else if (stage.id === 12) texts = PROFI_TEXTS[language];
    else if (stage.id === 14 || stage.id === 15) {
      // Stage 14 & 15 Mix: Combine everything!
      texts = [...MEISTERKLASSE_TEXTS[language], ...PROFI_TEXTS[language], ...CODER_TEXTS[language]];
    } else {
      texts = MEISTERKLASSE_TEXTS[language];
    }

    const count = texts.length;

    // Pick specific paragraphs to ensure coherence
    if (subLevelId === 0 || stage.id === 15) {
      // For Stage 15 (Endless) we start with a nice chunk too
      const p1 = texts[Math.floor(Math.random() * count)];
      let p2 = texts[Math.floor(Math.random() * count)];
      while(p1 === p2) p2 = texts[Math.floor(Math.random() * count)];
      return p1 + (stage.id === 13 ? '\n\n' : ' ') + p2;
    }

    const chunkCount = Math.min(
      count,
      subLevelId <= 3 ? 1 : subLevelId <= 6 ? 2 : subLevelId <= 8 ? 3 : 4
    );
    const picked: string[] = [];
    const used = new Set<number>();
    while (picked.length < chunkCount) {
      const idx = Math.floor(Math.random() * count);
      if (used.has(idx)) continue;
      used.add(idx);
      picked.push(texts[idx]);
    }
    return picked.join(stage.id === 13 ? '\n\n' : ' ');
  }

  const allChars = new Set(stage.chars);
  return generateStandardPattern(stage, subLevelId, allChars, language);
};

// Standard pattern generation (pseudo words)
const generateStandardPattern = (stage: Stage, subLevelId: number, allChars: Set<string>, language: Language): string => {
  const newChars = stage.newChars.filter(c => c !== 'Shift'); // Exclude control keys
  const useCapitalization = stage.id >= 9;

  // Prepare pools
  const poolAll = stage.chars.filter(c => c !== ' ' && c.length === 1);
  const poolNew = newChars.length > 0 ? newChars : poolAll;

  // Filter real words that are possible at this stage
  const possibleRealWords = getCommonWords(language).filter(w => canTypeWord(w, allChars));

  const availablePunctuation = poolAll.filter(c => ['.', ',', '!', '?', ':', ';', '-'].includes(c));
  const numberChars = poolAll.filter(c => /\d/.test(c));
  const symbolChars = poolAll.filter(c => !/[a-zA-Z0-9 ]/.test(c));

  const maybeCapitalize = (word: string, chance = 0.2) => {
    if (!useCapitalization) return word;
    return Math.random() < chance ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  };

  const buildWord = (minLen: number, maxLen: number, realChance: number, capChance: number) => {
    if (possibleRealWords.length > 0 && Math.random() < realChance) {
      return maybeCapitalize(getRandomItem(possibleRealWords), capChance);
    }
    const len = minLen + Math.floor(Math.random() * Math.max(1, maxLen - minLen + 1));
    return maybeCapitalize(generatePseudoWord(poolAll, len), capChance);
  };

  const maybeAddPunctuation = (word: string, chance: number) => {
    if (availablePunctuation.length === 0 || Math.random() >= chance) return word;
    return word + getRandomItem(availablePunctuation);
  };

  const buildNumberToken = () => {
    if (numberChars.length === 0) return null;
    const len = 2 + Math.floor(Math.random() * 3);
    return Array.from({ length: len }, () => getRandomItem(numberChars)).join('');
  };

  const buildSymbolToken = () => {
    if (symbolChars.length === 0) return null;
    const len = 2 + Math.floor(Math.random() * 2);
    return Array.from({ length: len }, () => getRandomItem(symbolChars)).join('');
  };

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

    case 1: // INTRODUCTION: Focus purely on new keys. Varied patterns.
      // Pattern: Mix characters with variable repetition lengths for better typing practice
      {
        const targetKeys = poolNew;
        // Generate 10-12 sequences with varied patterns
        const sequenceCount = 10 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < sequenceCount; i++) {
          let sequence = "";
          const seqLength = 3 + Math.floor(Math.random() * 6); // 3-8 characters per sequence
          
          for (let j = 0; j < seqLength; j++) {
            const char = getRandomItem(targetKeys);
            // Variable repetition: 1-4 times, weighted towards 1-2 for more variation
            const repeatCount = Math.random() < 0.5 ? 1 : Math.random() < 0.7 ? 2 : Math.random() < 0.9 ? 3 : 4;
            sequence += char.repeat(repeatCount);
            
            // Occasionally switch to different character mid-sequence for variation
            if (j < seqLength - 1 && Math.random() < 0.3 && targetKeys.length > 1) {
              const otherChar = getRandomItem(targetKeys.filter(c => c !== char));
              const shortRepeat = Math.random() < 0.7 ? 1 : 2;
              sequence += otherChar.repeat(shortRepeat);
              j++; // Skip next iteration since we added a character
            }
          }
          
          result.push(sequence);
        }
      }
      break;

    case 2: // ANCHORING: Mix new keys with Home Row (F, J) or Space
      // Pattern: Varied mixing for better practice
      {
        // Special handling for early stages (1-3) with few characters - use generatePseudoWord for variation
        if (stage.id <= 3 && poolAll.length <= 7) {
          // Use hand alternation logic but with more variation
          const lefts = poolAll.filter(c => LEFT_HAND.has(c));
          const rights = poolAll.filter(c => RIGHT_HAND.has(c));
          
          if (lefts.length > 0 && rights.length > 0) {
            // Generate 10-14 sequences with hand alternation but varied lengths
            const sequenceCount = 10 + Math.floor(Math.random() * 5);
            for (let i = 0; i < sequenceCount; i++) {
              const targetLength = 3 + Math.floor(Math.random() * 5); // Target 3-7 characters
              let sequence = "";
              let isLeft = Math.random() > 0.5;
              
              while (sequence.length < targetLength) {
                const currentPool = isLeft ? lefts : rights;
                const char = getRandomItem(currentPool.length > 0 ? currentPool : poolAll);
                
                // Variable repetition: sometimes 1, sometimes 2-3 for variation
                const repeatCount = Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 2 : 3;
                sequence += char.repeat(repeatCount);
                
                // Switch hands, but not always strictly (70% chance)
                if (Math.random() < 0.7) {
                  isLeft = !isLeft;
                }
              }
              
              result.push(sequence);
            }
          } else {
            // Fallback: use generatePseudoWord
            for (let i = 0; i < 12; i++) {
              const len = 3 + Math.floor(Math.random() * 5);
              result.push(generatePseudoWord(poolAll, len));
            }
          }
        } else {
          // Original logic for higher stages (Stage 4+)
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
      }
      break;

    case 3: // FLOW: Syllables and Bigrams
      // Generate short 2-3 char pronounceable chunks
      {
        // For early stages with few characters, ensure more variation
        const isEarlyStage = stage.id <= 2 && poolAll.length <= 5;
        
        for (let i = 0; i < 12; i++) {
          // 50% chance for a real word if we have enough
          if (possibleRealWords.length > 5 && Math.random() > 0.5) {
             result.push(getRandomItem(possibleRealWords));
          } else {
             // Generate a bigram/trigram using new chars heavily
             let chunk = "";
             if (isEarlyStage) {
               // For early stages, always use generatePseudoWord for better variation
               const len = 2 + Math.floor(Math.random() * 3); // 2-4 characters
               chunk = generatePseudoWord(stage.chars.filter(c => c!==' '), len);
             } else if (Math.random() > 0.5) {
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

    case 5: // SENTENCE FLOW: First full sentence with steady rhythm
      {
        const length = 12 + Math.floor(Math.random() * 5);
        for (let i = 0; i < length; i++) {
          let word = buildWord(3, 7, 0.55, i === 0 ? 0.6 : 0.2);
          if (stage.id >= 10) word = maybeAddPunctuation(word, 0.12);
          result.push(word);
        }
        if (stage.id >= 10) {
          return result.join(' ') + getRandomItem(['.', '!', '?']);
        }
      }
      break;

    case 6: // EXTENDED WORDS: Longer words, more real words
      {
        const length = 14 + Math.floor(Math.random() * 6);
        for (let i = 0; i < length; i++) {
          let word = buildWord(4, 8, 0.65, i === 0 ? 0.6 : 0.25);
          if (stage.id >= 10) word = maybeAddPunctuation(word, 0.18);
          result.push(word);
        }
        if (stage.id >= 10) {
          return result.join(' ') + getRandomItem(['.', '!', '?']);
        }
      }
      break;

    case 7: // PHRASING: Clauses and pauses (comma usage if available)
      {
        const length = 16 + Math.floor(Math.random() * 6);
        for (let i = 0; i < length; i++) {
          let word = buildWord(3, 9, 0.7, i === 0 ? 0.7 : 0.3);
          if (stage.id >= 10) word = maybeAddPunctuation(word, 0.25);
          result.push(word);
          if (stage.id >= 10 && availablePunctuation.includes(',') && Math.random() < 0.2) {
            result[result.length - 1] = result[result.length - 1].replace(/[,!?;:.\- ]*$/, '') + ',';
          }
        }
        if (stage.id >= 10) {
          return result.join(' ') + getRandomItem(['.', '!', '?']);
        }
      }
      break;

    case 8: // MULTI-SENTENCE: Two sentences, more capitalization
      {
        const sentenceCount = 2;
        for (let s = 0; s < sentenceCount; s++) {
          const length = 12 + Math.floor(Math.random() * 6);
          for (let i = 0; i < length; i++) {
            let word = buildWord(3, 9, 0.75, i === 0 ? 0.7 : 0.35);
            if (stage.id >= 10) word = maybeAddPunctuation(word, 0.2);
            result.push(word);
          }
          if (stage.id >= 10) {
            result[result.length - 1] = result[result.length - 1].replace(/[!?.,;:\-]*$/, '') + getRandomItem(['.', '!', '?']);
          }
        }
      }
      break;

    case 9: // MIXED TOKENS: Numbers/symbols sprinkled in
      {
        const length = 18 + Math.floor(Math.random() * 6);
        for (let i = 0; i < length; i++) {
          if (Math.random() < 0.12) {
            const token = Math.random() < 0.6 ? buildNumberToken() : buildSymbolToken();
            if (token) {
              result.push(token);
              continue;
            }
          }
          let word = buildWord(4, 10, 0.75, i === 0 ? 0.8 : 0.35);
          if (stage.id >= 10) word = maybeAddPunctuation(word, 0.22);
          result.push(word);
        }
        if (stage.id >= 10) {
          return result.join(' ') + getRandomItem(['.', '!', '?']);
        }
      }
      break;

    case 10: // MASTER: Longest flow with varied tokens
      {
        const sentenceCount = 2 + Math.floor(Math.random() * 2);
        for (let s = 0; s < sentenceCount; s++) {
          const length = 16 + Math.floor(Math.random() * 8);
          for (let i = 0; i < length; i++) {
            if (Math.random() < 0.15) {
              const token = Math.random() < 0.6 ? buildNumberToken() : buildSymbolToken();
              if (token) {
                result.push(token);
                continue;
              }
            }
            let word = buildWord(4, 10, 0.8, i === 0 ? 0.85 : 0.4);
            if (stage.id >= 10) word = maybeAddPunctuation(word, 0.25);
            result.push(word);
          }
          if (stage.id >= 10) {
            result[result.length - 1] = result[result.length - 1].replace(/[!?.,;:\-]*$/, '') + getRandomItem(['.', '!', '?']);
          }
        }
      }
      break;

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
