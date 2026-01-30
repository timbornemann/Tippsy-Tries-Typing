import { useCallback, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const TYPING_THROTTLE_MS = 60;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine'
): void {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

export function useSound() {
  const { soundEnabled } = useSettings();
  const ctxRef = useRef<AudioContext | null>(null);
  const lastTypingRef = useRef<number>(0);

  const ensureContext = useCallback((): AudioContext | null => {
    if (!soundEnabled) return null;
    if (ctxRef.current?.state === 'closed') ctxRef.current = null;
    if (!ctxRef.current) ctxRef.current = getAudioContext();
    const ctx = ctxRef.current;
    if (ctx?.state === 'suspended') ctx.resume();
    return ctx ?? null;
  }, [soundEnabled]);

  const playTyping = useCallback(() => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastTypingRef.current < TYPING_THROTTLE_MS) return;
    lastTypingRef.current = now;
    const ctx = ensureContext();
    if (!ctx) return;
    playTone(ctx, 600, 0.04, 0.35, 'sine');
  }, [soundEnabled, ensureContext]);

  const playError = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    playTone(ctx, 200, 0.12, 0.5, 'square');
  }, [soundEnabled, ensureContext]);

  const playLevelComplete = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    playTone(ctx, 523.25, 0.08, 0.45, 'sine');
    setTimeout(() => playTone(ctx, 659.25, 0.08, 0.45, 'sine'), 80);
    setTimeout(() => playTone(ctx, 783.99, 0.2, 0.4, 'sine'), 160);
  }, [soundEnabled, ensureContext]);

  const playMenuClick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = ensureContext();
    if (!ctx) return;
    playTone(ctx, 400, 0.05, 0.28, 'sine');
  }, [soundEnabled, ensureContext]);

  return { playTyping, playError, playLevelComplete, playMenuClick };
}
