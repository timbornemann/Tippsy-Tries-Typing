import React, { memo, useMemo } from 'react';
import { KEYBOARD_LAYOUTS, FINGER_COLORS } from '../constants';
import { Finger, KeyConfig } from '../types';
import { useSettings } from '../contexts/SettingsContext';

/** 10-Finger-Regel: Welche Shift-Taste soll für dieses Zeichen als Ziel angezeigt werden? */
function getTargetShiftKeyForChar(activeKey: string, layout: KeyConfig[][]): 'Shift' | 'ShiftRight' | null {
  if (!/[A-Z!§$%&/()=?]/.test(activeKey)) return null;
  const flat = layout.flat();
  const keyConfig = flat.find(
    (c) =>
      c.key === activeKey ||
      c.key === activeKey.toLowerCase() ||
      c.displayShift === activeKey
  );
  if (!keyConfig) return 'Shift';
  const f = keyConfig.finger;
  const isLeftHand = f === Finger.LeftPinky || f === Finger.LeftRing || f === Finger.LeftMiddle || f === Finger.LeftIndex;
  const isRightHand = f === Finger.RightPinky || f === Finger.RightRing || f === Finger.RightMiddle || f === Finger.RightIndex;
  if (isLeftHand) return 'ShiftRight';  // linke Hand tippt → rechte Shift
  if (isRightHand) return 'Shift';      // rechte Hand tippt → linke Shift
  return 'Shift';
}

interface VirtualKeyboardProps {
  activeKey: string;
  pressedKeys: Set<string>;
  /** Zeichen/Taste, die fälschlich gedrückt wurde – wird kurz rot hervorgehoben */
  errorKey?: string | null;
  /** Caps Lock ist aktiv – Taste bleibt visuell „an“, bis erneut gedrückt */
  capsLockOn?: boolean;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, pressedKeys, errorKey, capsLockOn = false }) => {
  const { keyboardLayout } = useSettings();
  const layout = KEYBOARD_LAYOUTS[keyboardLayout];

  /** En-Dash "–" (U+2013) in Inhalten → Minus-Taste "-" auf der Tastatur hervorheben */
  const activeKeyForKeys = activeKey === '\u2013' ? '-' : activeKey;
  const targetShiftKey = useMemo(() => getTargetShiftKeyForChar(activeKeyForKeys, layout), [activeKeyForKeys, layout]);

  const shiftHeld = pressedKeys.has('Shift') || pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
  const altGrHeld = pressedKeys.has('AltGr') || pressedKeys.has('AltRight');

  const getDisplayForKey = (keyConfig: KeyConfig) => {
    if (altGrHeld && keyConfig.displayAltGr) return keyConfig.displayAltGr;
    if (shiftHeld && keyConfig.displayShift) return keyConfig.displayShift;
    return keyConfig.display;
  };

  const getKeyStyles = (keyConfig: KeyConfig) => {
    // Normalize activeKey for comparison (Target Key). Shift: nur die passende Taste (10-Finger-Regel). En-Dash "–" → "-".
    const isTarget = keyConfig.key.toLowerCase() === activeKeyForKeys.toLowerCase() ||
                     (activeKeyForKeys === ' ' && keyConfig.key === ' ') ||
                     (targetShiftKey != null && keyConfig.key === targetShiftKey);

    // Wrong key just pressed – show error feedback
    const isError = errorKey != null && (
      (keyConfig.key.length === 1 && keyConfig.key.toLowerCase() === errorKey.toLowerCase()) ||
      (errorKey === ' ' && keyConfig.key === ' ') ||
      (errorKey === '\n' && keyConfig.key === 'Enter')
    );

    // Check if key is physically pressed by user (Shift/Ctrl/Alt only via e.code, not generic key)
    let isPressed = false;
    const isShiftKey = keyConfig.key === 'Shift' || keyConfig.key === 'ShiftRight';
    for (const k of pressedKeys) {
        if (isShiftKey) {
          if (k === 'ShiftLeft' && keyConfig.key === 'Shift') { isPressed = true; break; }
          if (k === 'ShiftRight' && keyConfig.key === 'ShiftRight') { isPressed = true; break; }
          continue; // never match generic 'Shift' for Shift keys
        }
        if (k === keyConfig.key) { isPressed = true; break; }
        if (k.toLowerCase() === keyConfig.key.toLowerCase() && keyConfig.key.length === 1) { isPressed = true; break; }
        if ((k === 'Control' || k === 'ControlLeft') && keyConfig.key === 'Control') { isPressed = true; break; }
        if (k === 'ControlRight' && keyConfig.key === 'ControlRight') { isPressed = true; break; }
        if ((k === 'Alt' || k === 'AltLeft') && keyConfig.key === 'Alt') { isPressed = true; break; }
        if ((k === 'AltRight' || k === 'AltGr') && keyConfig.key === 'AltRight') { isPressed = true; break; }
    }

    const fingerColorBg = FINGER_COLORS[keyConfig.finger];
    // Create border color class by replacing 'bg-' with 'border-'
    const fingerColorBorder = fingerColorBg.replace('bg-', 'border-');

    const baseStyles = "relative flex items-center justify-center rounded-lg border-b-4 transition-all duration-75";
    const sizeStyles = keyConfig.finger === Finger.Thumb ? 'h-12' : 'h-12';
    
    // 1. ERROR STATE (Wrong key – red flash + short shake)
    if (isError) {
      return `${baseStyles} ${sizeStyles} bg-rose-500 border-rose-400 text-white mt-1 border-b-0 shadow-inner key-error-shake z-20`;
    }
    
    // 2. PRESSED STATE (Physical user interaction) or CAPS LOCK ON (stays on until toggled)
    const isCapsLockOn = keyConfig.key === 'CapsLock' && capsLockOn;
    if (isPressed || isCapsLockOn) {
      return `${baseStyles} ${sizeStyles} ${fingerColorBg} border-transparent text-white mt-1 border-b-0 shadow-inner brightness-110`;
    } 
    
    // 3. TARGET STATE (Instruction)
    if (isTarget) {
      return `${baseStyles} ${sizeStyles} ${fingerColorBg} border-black/20 text-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10`;
    }

    // 4. IDLE STATE (Passive visual hint)
    // Dark background, but colored bottom border to indicate finger mapping
    return `${baseStyles} ${sizeStyles} bg-slate-800 text-slate-300 ${fingerColorBorder} hover:bg-slate-700`;
  };

  return (
    <>
      <style>{`
        @keyframes key-error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .key-error-shake {
          animation: key-error-shake 0.3s ease-in-out;
        }
      `}</style>
    <div className="flex flex-col gap-2 p-6 bg-slate-900/50 rounded-xl shadow-2xl border border-slate-800 select-none max-w-4xl mx-auto mt-8 backdrop-blur-sm">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((keyConfig, keyIndex) => (
            <div
              key={`${rowIndex}-${keyIndex}`}
              className={getKeyStyles(keyConfig)}
              style={{
                width: keyConfig.width ? `${keyConfig.width * 3}rem` : '3rem',
                minWidth: keyConfig.width ? `${keyConfig.width * 3}rem` : '3rem',
              }}
            >
              <span className="font-mono font-bold text-lg">{getDisplayForKey(keyConfig)}</span>
              
              {/* Homing bumps for F and J */}
              {(keyConfig.key === 'f' || keyConfig.key === 'j') && (
                <div className={`absolute bottom-2 w-4 h-0.5 rounded-full ${['bg-', 'border-'].some(prefix => getKeyStyles(keyConfig).includes('text-white')) ? 'bg-white/50' : 'bg-slate-500'}`}></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
};

export default memo(VirtualKeyboard);
