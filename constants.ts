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

/** Safe Tailwind classes per stage color (avoids dynamic class names). */
export const STAGE_COLOR_CLASSES: Record<string, {
  border: string; bg: string; text: string; gradient: string; shadow: string;
  cardBorder: string; cardBg: string; blobBg: string; blobHover: string;
  badgeBg: string; badgeBorder: string; labelText: string; keyBorder: string;
  progressBar: string; pathText: string; nodeActive: string;
  practiceHover: string; practiceIconBg: string; practiceIconText: string;
}> = {
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-400', gradient: 'from-emerald-500', shadow: 'shadow-emerald-500/20', cardBorder: 'border-emerald-500/20', cardBg: 'to-emerald-950/20', blobBg: 'bg-emerald-500/10', blobHover: 'group-hover:bg-emerald-500/20', badgeBg: 'bg-emerald-500', badgeBorder: 'border-emerald-400', labelText: 'text-emerald-400', keyBorder: 'border-emerald-500/30', progressBar: 'bg-gradient-to-r from-emerald-600 to-emerald-400', pathText: 'text-emerald-500', nodeActive: 'bg-emerald-500', practiceHover: 'hover:bg-emerald-500 hover:border-emerald-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-emerald-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-emerald-400 group-hover/practice:text-white' },
  teal:    { border: 'border-teal-500', bg: 'bg-teal-500', text: 'text-teal-400', gradient: 'from-teal-500', shadow: 'shadow-teal-500/20', cardBorder: 'border-teal-500/20', cardBg: 'to-teal-950/20', blobBg: 'bg-teal-500/10', blobHover: 'group-hover:bg-teal-500/20', badgeBg: 'bg-teal-500', badgeBorder: 'border-teal-400', labelText: 'text-teal-400', keyBorder: 'border-teal-500/30', progressBar: 'bg-gradient-to-r from-teal-600 to-teal-400', pathText: 'text-teal-500', nodeActive: 'bg-teal-500', practiceHover: 'hover:bg-teal-500 hover:border-teal-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-teal-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-teal-400 group-hover/practice:text-white' },
  cyan:    { border: 'border-cyan-500', bg: 'bg-cyan-500', text: 'text-cyan-400', gradient: 'from-cyan-500', shadow: 'shadow-cyan-500/20', cardBorder: 'border-cyan-500/20', cardBg: 'to-cyan-950/20', blobBg: 'bg-cyan-500/10', blobHover: 'group-hover:bg-cyan-500/20', badgeBg: 'bg-cyan-500', badgeBorder: 'border-cyan-400', labelText: 'text-cyan-400', keyBorder: 'border-cyan-500/30', progressBar: 'bg-gradient-to-r from-cyan-600 to-cyan-400', pathText: 'text-cyan-500', nodeActive: 'bg-cyan-500', practiceHover: 'hover:bg-cyan-500 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-cyan-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-cyan-400 group-hover/practice:text-white' },
  sky:     { border: 'border-sky-500', bg: 'bg-sky-500', text: 'text-sky-400', gradient: 'from-sky-500', shadow: 'shadow-sky-500/20', cardBorder: 'border-sky-500/20', cardBg: 'to-sky-950/20', blobBg: 'bg-sky-500/10', blobHover: 'group-hover:bg-sky-500/20', badgeBg: 'bg-sky-500', badgeBorder: 'border-sky-400', labelText: 'text-sky-400', keyBorder: 'border-sky-500/30', progressBar: 'bg-gradient-to-r from-sky-600 to-sky-400', pathText: 'text-sky-500', nodeActive: 'bg-sky-500', practiceHover: 'hover:bg-sky-500 hover:border-sky-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-sky-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-sky-400 group-hover/practice:text-white' },
  blue:    { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-400', gradient: 'from-blue-500', shadow: 'shadow-blue-500/20', cardBorder: 'border-blue-500/20', cardBg: 'to-blue-950/20', blobBg: 'bg-blue-500/10', blobHover: 'group-hover:bg-blue-500/20', badgeBg: 'bg-blue-500', badgeBorder: 'border-blue-400', labelText: 'text-blue-400', keyBorder: 'border-blue-500/30', progressBar: 'bg-gradient-to-r from-blue-600 to-blue-400', pathText: 'text-blue-500', nodeActive: 'bg-blue-500', practiceHover: 'hover:bg-blue-500 hover:border-blue-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-blue-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-blue-400 group-hover/practice:text-white' },
  indigo:  { border: 'border-indigo-500', bg: 'bg-indigo-500', text: 'text-indigo-400', gradient: 'from-indigo-500', shadow: 'shadow-indigo-500/20', cardBorder: 'border-indigo-500/20', cardBg: 'to-indigo-950/20', blobBg: 'bg-indigo-500/10', blobHover: 'group-hover:bg-indigo-500/20', badgeBg: 'bg-indigo-500', badgeBorder: 'border-indigo-400', labelText: 'text-indigo-400', keyBorder: 'border-indigo-500/30', progressBar: 'bg-gradient-to-r from-indigo-600 to-indigo-400', pathText: 'text-indigo-500', nodeActive: 'bg-indigo-500', practiceHover: 'hover:bg-indigo-500 hover:border-indigo-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-indigo-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-indigo-400 group-hover/practice:text-white' },
  violet:  { border: 'border-violet-500', bg: 'bg-violet-500', text: 'text-violet-400', gradient: 'from-violet-500', shadow: 'shadow-violet-500/20', cardBorder: 'border-violet-500/20', cardBg: 'to-violet-950/20', blobBg: 'bg-violet-500/10', blobHover: 'group-hover:bg-violet-500/20', badgeBg: 'bg-violet-500', badgeBorder: 'border-violet-400', labelText: 'text-violet-400', keyBorder: 'border-violet-500/30', progressBar: 'bg-gradient-to-r from-violet-600 to-violet-400', pathText: 'text-violet-500', nodeActive: 'bg-violet-500', practiceHover: 'hover:bg-violet-500 hover:border-violet-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-violet-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-violet-400 group-hover/practice:text-white' },
  purple:  { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-400', gradient: 'from-purple-500', shadow: 'shadow-purple-500/20', cardBorder: 'border-purple-500/20', cardBg: 'to-purple-950/20', blobBg: 'bg-purple-500/10', blobHover: 'group-hover:bg-purple-500/20', badgeBg: 'bg-purple-500', badgeBorder: 'border-purple-400', labelText: 'text-purple-400', keyBorder: 'border-purple-500/30', progressBar: 'bg-gradient-to-r from-purple-600 to-purple-400', pathText: 'text-purple-500', nodeActive: 'bg-purple-500', practiceHover: 'hover:bg-purple-500 hover:border-purple-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-purple-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-purple-400 group-hover/practice:text-white' },
  fuchsia: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-500', text: 'text-fuchsia-400', gradient: 'from-fuchsia-500', shadow: 'shadow-fuchsia-500/20', cardBorder: 'border-fuchsia-500/20', cardBg: 'to-fuchsia-950/20', blobBg: 'bg-fuchsia-500/10', blobHover: 'group-hover:bg-fuchsia-500/20', badgeBg: 'bg-fuchsia-500', badgeBorder: 'border-fuchsia-400', labelText: 'text-fuchsia-400', keyBorder: 'border-fuchsia-500/30', progressBar: 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-400', pathText: 'text-fuchsia-500', nodeActive: 'bg-fuchsia-500', practiceHover: 'hover:bg-fuchsia-500 hover:border-fuchsia-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-fuchsia-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-fuchsia-400 group-hover/practice:text-white' },
  rose:    { border: 'border-rose-500', bg: 'bg-rose-500', text: 'text-rose-400', gradient: 'from-rose-500', shadow: 'shadow-rose-500/20', cardBorder: 'border-rose-500/20', cardBg: 'to-rose-950/20', blobBg: 'bg-rose-500/10', blobHover: 'group-hover:bg-rose-500/20', badgeBg: 'bg-rose-500', badgeBorder: 'border-rose-400', labelText: 'text-rose-400', keyBorder: 'border-rose-500/30', progressBar: 'bg-gradient-to-r from-rose-600 to-rose-400', pathText: 'text-rose-500', nodeActive: 'bg-rose-500', practiceHover: 'hover:bg-rose-500 hover:border-rose-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-rose-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-rose-400 group-hover/practice:text-white' },
  amber:   { border: 'border-amber-500', bg: 'bg-amber-500', text: 'text-amber-400', gradient: 'from-amber-500', shadow: 'shadow-amber-500/20', cardBorder: 'border-amber-500/20', cardBg: 'to-amber-950/20', blobBg: 'bg-amber-500/10', blobHover: 'group-hover:bg-amber-500/20', badgeBg: 'bg-amber-500', badgeBorder: 'border-amber-400', labelText: 'text-amber-400', keyBorder: 'border-amber-500/30', progressBar: 'bg-gradient-to-r from-amber-600 to-amber-400', pathText: 'text-amber-500', nodeActive: 'bg-amber-500', practiceHover: 'hover:bg-amber-500 hover:border-amber-400 hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]', practiceIconBg: 'bg-amber-500/20 group-hover/practice:bg-white/20', practiceIconText: 'text-amber-400 group-hover/practice:text-white' },
};

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
  },
  {
    id: 11,
    name: 'Meisterklasse',
    description: 'Echte Texte: Längere Sätze mit Satzzeichen, Sonderzeichen und Zahlen.',
    color: 'amber',
    newChars: [],
    chars: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', 'y', 'x', 'c', 'v', 'b', 'n', 'm', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ',', '-', '?', '!', ' '],
    basePrompt: 'Tippe vollständige, sinnvolle Texte mit allen Zeichen.'
  }
];