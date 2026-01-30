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

export type Language = 'de' | 'en';

export type KeyboardLayout = 'qwertz' | 'qwerty';

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
  chars: string[]; // Cumulative available chars
  newChars: string[]; // Specific chars introduced in this stage
  basePrompt: string;
}

/** Per-session error count per expected character (what was shown when user typed wrong). */
export type ErrorCountByChar = Record<string, number>;

export interface GameStats {
  wpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  timeElapsed: number;
  /** Optional: which characters were mistyped how often this session */
  errorCountByChar?: ErrorCountByChar;
}

export interface GlobalStats {
  totalCharsTyped: number;
  totalTimePlayed: number; // seconds
  gamesPlayed: number;
  highestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
}

/** One session entry for history (WPM/accuracy over time). */
export interface SessionRecord {
  date: string; // ISO date YYYY-MM-DD
  wpm: number;
  accuracy: number;
  stageId?: number;
  subLevelId?: number;
}

/** Last and best stats per stage (key: "stageId_subLevelId" or "stageId_0" for practice). */
export interface StageLevelStats {
  last?: GameStats;
  bestWpm?: number;
  bestAccuracy?: number;
}

export interface UserProgress {
  unlockedStageId: number;
  unlockedSubLevelId: number; // 1-5
  stats: GlobalStats;
  /** Last session stats per stage+subLevel for "compared to last time" */
  lastSessionByKey?: Record<string, GameStats>;
  /** Last N sessions for WPM/accuracy over time (e.g. 30). */
  sessionHistory?: SessionRecord[];
  /** Per stage/subLevel: best WPM and best accuracy. */
  perStageBest?: Record<string, StageLevelStats>;
  /** Global error count by character (accumulated). */
  errorCountByChar?: ErrorCountByChar;
}

export enum GameState {
  START = 'START',
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  STATISTICS = 'STATISTICS',
  SETTINGS = 'SETTINGS',
}

export type GameMode = 'STANDARD' | 'PRACTICE' | 'WORDS_SENTENCES';
