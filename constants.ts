import { Finger, KeyConfig, Level } from './types';

// Finger Color Mapping
export const FINGER_COLORS: Record<Finger, string> = {
  [Finger.LeftPinky]: 'bg-rose-500',
  [Finger.LeftRing]: 'bg-orange-500',
  [Finger.LeftMiddle]: 'bg-yellow-500',
  [Finger.LeftIndex]: 'bg-emerald-500',
  [Finger.Thumb]: 'bg-slate-400',
  [Finger.RightIndex]: 'bg-cyan-500',
  [Finger.RightMiddle]: 'bg-blue-500',
  [Finger.RightRing]: 'bg-indigo-500',
  [Finger.RightPinky]: 'bg-violet-500',
};

export const FINGER_NAMES_DE: Record<Finger, string> = {
  [Finger.LeftPinky]: 'Linker Kleiner Finger',
  [Finger.LeftRing]: 'Linker Ringfinger',
  [Finger.LeftMiddle]: 'Linker Mittelfinger',
  [Finger.LeftIndex]: 'Linker Zeigefinger',
  [Finger.Thumb]: 'Daumen',
  [Finger.RightIndex]: 'Rechter Zeigefinger',
  [Finger.RightMiddle]: 'Rechter Mittelfinger',
  [Finger.RightRing]: 'Rechter Ringfinger',
  [Finger.RightPinky]: 'Rechter Kleiner Finger',
};

// German QWERTZ Layout
export const KEYBOARD_LAYOUT: KeyConfig[][] = [
  // Row 1
  [
    { key: '^', display: '^', finger: Finger.LeftPinky, row: 1 },
    { key: '1', display: '1', finger: Finger.LeftPinky, row: 1 },
    { key: '2', display: '2', finger: Finger.LeftRing, row: 1 },
    { key: '3', display: '3', finger: Finger.LeftMiddle, row: 1 },
    { key: '4', display: '4', finger: Finger.LeftIndex, row: 1 },
    { key: '5', display: '5', finger: Finger.LeftIndex, row: 1 },
    { key: '6', display: '6', finger: Finger.RightIndex, row: 1 },
    { key: '7', display: '7', finger: Finger.RightIndex, row: 1 },
    { key: '8', display: '8', finger: Finger.RightMiddle, row: 1 },
    { key: '9', display: '9', finger: Finger.RightRing, row: 1 },
    { key: '0', display: '0', finger: Finger.RightPinky, row: 1 },
    { key: 'ß', display: 'ß', finger: Finger.RightPinky, row: 1 },
    { key: 'Backspace', display: '⌫', finger: Finger.RightPinky, width: 2, row: 1 },
  ],
  // Row 2
  [
    { key: 'Tab', display: 'Tab', finger: Finger.LeftPinky, width: 1.5, row: 2 },
    { key: 'q', display: 'Q', finger: Finger.LeftPinky, row: 2 },
    { key: 'w', display: 'W', finger: Finger.LeftRing, row: 2 },
    { key: 'e', display: 'E', finger: Finger.LeftMiddle, row: 2 },
    { key: 'r', display: 'R', finger: Finger.LeftIndex, row: 2 },
    { key: 't', display: 'T', finger: Finger.LeftIndex, row: 2 },
    { key: 'z', display: 'Z', finger: Finger.RightIndex, row: 2 },
    { key: 'u', display: 'U', finger: Finger.RightIndex, row: 2 },
    { key: 'i', display: 'I', finger: Finger.RightMiddle, row: 2 },
    { key: 'o', display: 'O', finger: Finger.RightRing, row: 2 },
    { key: 'p', display: 'P', finger: Finger.RightPinky, row: 2 },
    { key: 'ü', display: 'Ü', finger: Finger.RightPinky, row: 2 },
    { key: '+', display: '+', finger: Finger.RightPinky, row: 2 },
  ],
  // Row 3
  [
    { key: 'CapsLock', display: 'Caps', finger: Finger.LeftPinky, width: 1.8, row: 3 },
    { key: 'a', display: 'A', finger: Finger.LeftPinky, row: 3 },
    { key: 's', display: 'S', finger: Finger.LeftRing, row: 3 },
    { key: 'd', display: 'D', finger: Finger.LeftMiddle, row: 3 },
    { key: 'f', display: 'F', finger: Finger.LeftIndex, row: 3 },
    { key: 'g', display: 'G', finger: Finger.LeftIndex, row: 3 },
    { key: 'h', display: 'H', finger: Finger.RightIndex, row: 3 },
    { key: 'j', display: 'J', finger: Finger.RightIndex, row: 3 },
    { key: 'k', display: 'K', finger: Finger.RightMiddle, row: 3 },
    { key: 'l', display: 'L', finger: Finger.RightRing, row: 3 },
    { key: 'ö', display: 'Ö', finger: Finger.RightPinky, row: 3 },
    { key: 'ä', display: 'Ä', finger: Finger.RightPinky, row: 3 },
    { key: '#', display: '#', finger: Finger.RightPinky, row: 3 },
    { key: 'Enter', display: '⏎', finger: Finger.RightPinky, width: 1.5, row: 3 },
  ],
  // Row 4
  [
    { key: 'Shift', display: '⇧', finger: Finger.LeftPinky, width: 2.3, row: 4 },
    { key: '<', display: '<', finger: Finger.LeftPinky, row: 4 },
    { key: 'y', display: 'Y', finger: Finger.LeftPinky, row: 4 },
    { key: 'x', display: 'X', finger: Finger.LeftRing, row: 4 },
    { key: 'c', display: 'C', finger: Finger.LeftMiddle, row: 4 },
    { key: 'v', display: 'V', finger: Finger.LeftIndex, row: 4 },
    { key: 'b', display: 'B', finger: Finger.LeftIndex, row: 4 },
    { key: 'n', display: 'N', finger: Finger.RightIndex, row: 4 },
    { key: 'm', display: 'M', finger: Finger.RightIndex, row: 4 },
    { key: ',', display: ',', finger: Finger.RightMiddle, row: 4 },
    { key: '.', display: '.', finger: Finger.RightRing, row: 4 },
    { key: '-', display: '-', finger: Finger.RightPinky, row: 4 },
    { key: 'ShiftRight', display: '⇧', finger: Finger.RightPinky, width: 2.3, row: 4 },
  ],
  // Space Row
  [
    { key: ' ', display: ' ', finger: Finger.Thumb, width: 6, row: 5 },
  ]
];

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Grundstellung 1',
    description: 'Wir beginnen mit den Zeigefingern: F und J.',
    chars: ['f', 'j', ' '],
    prompt: 'Generiere eine Sequenz von 30 Zeichen oder Wörtern, die NUR aus den Buchstaben "f" und "j" sowie Leerzeichen bestehen. Keine anderen Buchstaben. Sprache: Deutsch (wenn möglich echte Wörter oder sinnvolle Silben).'
  },
  {
    id: 2,
    name: 'Grundstellung 2',
    description: 'Dazu kommen die Mittelfinger: D und K.',
    chars: ['f', 'j', 'd', 'k', ' '],
    prompt: 'Generiere eine Übungssequenz (ca. 40 Zeichen), die NUR die Buchstaben d, f, j, k verwendet. Bilde möglichst viele echte deutsche Wörter oder gängige Silben.'
  },
  {
    id: 3,
    name: 'Grundstellung 3',
    description: 'Die Ringfinger kommen ins Spiel: S und L.',
    chars: ['f', 'j', 'd', 'k', 's', 'l', ' '],
    prompt: 'Generiere 10 einfache deutsche Wörter oder eine Zeichenfolge, die NUR aus den Buchstaben s, l, d, k, f, j besteht.'
  },
  {
    id: 4,
    name: 'Grundstellung Komplett',
    description: 'Die kleinen Finger: A und Ö.',
    chars: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö', ' '],
    prompt: 'Generiere einen deutschen Übungstext (ca. 15 Wörter), der NUR die Buchstaben der Grundreihe (a, s, d, f, j, k, l, ö) verwendet.'
  },
  {
    id: 5,
    name: 'Zeigefinger Erweitert',
    description: 'Die Tasten G und H in der Mitte.',
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', ' '],
    prompt: 'Generiere einen deutschen Übungstext (ca. 15 Wörter) unter Verwendung der Grundreihe sowie g und h.'
  },
  {
    id: 6,
    name: 'Oberreihe Links',
    description: 'Q, W, E, R, T dazu.',
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', ' '],
    prompt: 'Generiere 15 deutsche Wörter, die vorwiegend die linke Hand und die Oberreihe trainieren (q, w, e, r, t, a, s, d, f, g).'
  },
  {
    id: 7,
    name: 'Oberreihe Rechts',
    description: 'Z, U, I, O, P, Ü dazu.',
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', ' '],
    prompt: 'Generiere 3 kurze deutsche Sätze. Verwende nur Kleinbuchstaben (außer Satzanfang).'
  },
  {
    id: 8,
    name: 'Unterreihe',
    description: 'Y, X, C, V, B, N, M.',
    chars: ['y', 'x', 'c', 'v', 'b', 'n', 'm', ' '],
    prompt: 'Generiere 15 deutsche Wörter, die besonders die untere Tastenreihe (y, x, c, v, b, n, m) nutzen.'
  },
  {
    id: 9,
    name: 'Großschreibung',
    description: 'Nutzung der Shift-Taste.',
    chars: [], // All chars allowed
    prompt: 'Generiere 5 deutsche Sätze mit komplexer Groß- und Kleinschreibung. '
  },
  {
    id: 10,
    name: 'Meisterprüfung',
    description: 'Zahlen und Sonderzeichen.',
    chars: [],
    prompt: 'Generiere einen komplexen deutschen Text inklusive Zahlen (0-9) und Satzzeichen (. , - ? !). Länge: ca. 300 Zeichen.'
  }
];