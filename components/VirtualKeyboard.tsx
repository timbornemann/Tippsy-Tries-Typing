import React, { memo } from 'react';
import { KEYBOARD_LAYOUTS, FINGER_COLORS } from '../constants';
import { Finger, KeyConfig } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface VirtualKeyboardProps {
  activeKey: string;
  pressedKeys: Set<string>;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, pressedKeys }) => {
  const { keyboardLayout } = useSettings();
  const layout = KEYBOARD_LAYOUTS[keyboardLayout];

  const shiftHeld = pressedKeys.has('Shift') || pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
  const altGrHeld = pressedKeys.has('AltGr');

  const getDisplayForKey = (keyConfig: KeyConfig) => {
    if (altGrHeld && keyConfig.displayAltGr) return keyConfig.displayAltGr;
    if (shiftHeld && keyConfig.displayShift) return keyConfig.displayShift;
    return keyConfig.display;
  };

  const getKeyStyles = (keyConfig: KeyConfig) => {
    // Normalize activeKey for comparison (Target Key)
    const isTarget = keyConfig.key.toLowerCase() === activeKey.toLowerCase() || 
                     (activeKey === ' ' && keyConfig.key === ' ') ||
                     (keyConfig.key === 'Shift' && /[A-Z!§$%&/()=?]/.test(activeKey));

    // Check if key is physically pressed by user
    let isPressed = false;
    for (const k of pressedKeys) {
        if (k === keyConfig.key) { isPressed = true; break; }
        if (k.toLowerCase() === keyConfig.key.toLowerCase() && keyConfig.key.length === 1) { isPressed = true; break; }
        if (k === 'Shift' && (keyConfig.key === 'Shift' || keyConfig.key === 'ShiftRight')) { isPressed = true; break; }
    }

    const fingerColorBg = FINGER_COLORS[keyConfig.finger];
    // Create border color class by replacing 'bg-' with 'border-'
    const fingerColorBorder = fingerColorBg.replace('bg-', 'border-');

    const baseStyles = "relative flex items-center justify-center rounded-lg border-b-4 transition-all duration-75";
    const sizeStyles = keyConfig.finger === Finger.Thumb ? 'h-12' : 'h-12';
    
    // 1. PRESSED STATE (Physical user interaction)
    if (isPressed) {
      return `${baseStyles} ${sizeStyles} ${fingerColorBg} border-transparent text-white mt-1 border-b-0 shadow-inner brightness-110`;
    } 
    
    // 2. TARGET STATE (Instruction)
    if (isTarget) {
      return `${baseStyles} ${sizeStyles} ${fingerColorBg} border-black/20 text-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)] z-10`;
    }

    // 3. IDLE STATE (Passive visual hint)
    // Dark background, but colored bottom border to indicate finger mapping
    return `${baseStyles} ${sizeStyles} bg-slate-800 text-slate-300 ${fingerColorBorder} hover:bg-slate-700`;
  };

  return (
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
  );
};

export default memo(VirtualKeyboard);
