import { Finger, KeyConfig, Stage } from './types';

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

export const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Basis: Zeigefinger',
    description: 'Starte deine Reise mit der Grundstellung F und J.',
    color: 'emerald',
    newChars: ['f', 'j'],
    chars: ['f', 'j', ' '],
    basePrompt: 'Verwende NUR die Buchstaben "f" und "j" sowie Leerzeichen.'
  },
  {
    id: 2,
    name: 'Basis: Mittelfinger',
    description: 'Erweitere deine Reichweite auf D und K.',
    color: 'teal',
    newChars: ['d', 'k'],
    chars: ['f', 'j', 'd', 'k', ' '],
    basePrompt: 'Verwende NUR die Buchstaben "d", "f", "j", "k" sowie Leerzeichen.'
  },
  {
    id: 3,
    name: 'Basis: Ringfinger',
    description: 'Die Ringfinger S und L kommen hinzu.',
    color: 'cyan',
    newChars: ['s', 'l'],
    chars: ['f', 'j', 'd', 'k', 's', 'l', ' '],
    basePrompt: 'Verwende NUR die Buchstaben "s", "l", "d", "k", "f", "j" und Leerzeichen.'
  },
  {
    id: 4,
    name: 'Basis: Kleine Finger',
    description: 'Vervollständige die Grundreihe mit A und Ö.',
    color: 'sky',
    newChars: ['a', 'ö'],
    chars: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö', ' '],
    basePrompt: 'Verwende NUR die Buchstaben der Grundreihe (a, s, d, f, j, k, l, ö) und Leerzeichen.'
  },
  {
    id: 5,
    name: 'Zentrum: G & H',
    description: 'Lerne die inneren Tasten G und H zu erreichen.',
    color: 'blue',
    newChars: ['g', 'h'],
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', ' '],
    basePrompt: 'Verwende die Grundreihe sowie g und h.'
  },
  {
    id: 6,
    name: 'Oberreihe Links',
    description: 'Der Aufstieg beginnt: Q, W, E, R, T.',
    color: 'indigo',
    newChars: ['q', 'w', 'e', 'r', 't'],
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', ' '],
    basePrompt: 'Fokussiere dich auf die linke Oberreihe (q, w, e, r, t) in Kombination mit der Grundreihe.'
  },
  {
    id: 7,
    name: 'Oberreihe Rechts',
    description: 'Die rechte Seite zieht nach: Z, U, I, O, P, Ü.',
    color: 'violet',
    newChars: ['z', 'u', 'i', 'o', 'p', 'ü'],
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', ' '],
    basePrompt: 'Nutze nun auch die rechte Oberreihe (z, u, i, o, p, ü).'
  },
  {
    id: 8,
    name: 'Unterreihe',
    description: 'Der Abstieg in die Tiefe: Y, X, C, V, B, N, M.',
    color: 'purple',
    newChars: ['y', 'x', 'c', 'v', 'b', 'n', 'm'],
    chars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ' '],
    basePrompt: 'Konzentriere dich stark auf die untere Reihe (y, x, c, v, b, n, m) gemischt mit bekannten Buchstaben.'
  },
  {
    id: 9,
    name: 'Großschreibung',
    description: 'Meistere die Shift-Taste für Satzanfänge.',
    color: 'fuchsia',
    newChars: ['Shift'],
    chars: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ' '], 
    basePrompt: 'Verwende nun auch Großbuchstaben. Bilde korrekte Nomen und Satzanfänge.'
  },
  {
    id: 10,
    name: 'Satzzeichen & Zahlen',
    description: 'Das Finale: Alles kombiniert mit Zahlen und Zeichen.',
    color: 'rose',
    newChars: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '-', '?', '!'],
    chars: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', 'y', 'x', 'c', 'v', 'b', 'n', 'm', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '-', '?', '!', ' '],
    basePrompt: 'Verwende den vollen Zeichensatz inklusive Zahlen und Satzzeichen (. , - ? !).'
  }
];