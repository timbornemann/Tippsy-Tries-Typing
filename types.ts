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
  display: string;
  finger: Finger;
  width?: number;
  row: number;
}

export interface SubLevel {
  id: number; // 1 to 5
  name: string;
  type: 'practice' | 'master';
  difficultyModifier: string; // Hint for AI prompt
}

export interface Stage {
  id: number;
  name: string;
  description: string;
  color: string; // Tailwind color class base (e.g. 'emerald', 'blue')
  chars: string[]; 
  basePrompt: string;
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  timeElapsed: number;
}

export interface GlobalStats {
  totalCharsTyped: number;
  totalTimePlayed: number; // seconds
  gamesPlayed: number;
  highestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
}

export interface UserProgress {
  unlockedStageId: number;
  unlockedSubLevelId: number; // 1-5
  stats: GlobalStats;
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  STATISTICS = 'STATISTICS',
}

export type GameMode = 'STANDARD' | 'PRACTICE';
