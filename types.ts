export enum Finger {
  LeftPinky = 'L_Pinky',
  LeftRing = 'L_Ring',
  LeftMiddle = 'L_Middle',
  LeftIndex = 'L_Index',
  Thumb = 'Thumb',
  RightIndex = 'R_Index',
  RightMiddle = 'R_Middle',
  RightRing = 'R_Ring',
  RightPinky = 'R_Pinky',
}

export interface KeyConfig {
  key: string;
  display: string; // What shows on the key cap
  finger: Finger;
  width?: number; // Relative width (1 is standard)
  row: number;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  chars: string[]; // Characters introduced/focused in this level
  prompt: string; // Prompt for Gemini
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  timeElapsed: number;
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
}
