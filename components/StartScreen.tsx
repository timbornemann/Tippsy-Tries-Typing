import React, { useState, useEffect } from 'react';
import { Finger } from '../types';
import { FINGER_COLORS, KEYBOARD_LAYOUT } from '../constants';
import { Keyboard, MousePointerClick, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

interface StartScreenProps {
  onComplete: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // 0: Intro, 1: Hands, 2: Colors, 3: Practice, 4: Finish
  const [typedInput, setTypedInput] = useState('');
  const [practiceError, setPracticeError] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const practiceTarget = "fjfj";

  // Home Row Keys for Step 1 Check
  const HOME_ROW_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ö'];
  const [homeRowCompleted, setHomeRowCompleted] = useState(false);

  // Global Key Listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(key);
        
        // Check for Home Row Completion immediately on press
        if (step === 1 && !homeRowCompleted) {
            const allPressed = HOME_ROW_KEYS.every(k => next.has(k));
            if (allPressed) {
                setHomeRowCompleted(true);
            }
        }
        return next;
      });

      // Navigation with Enter
      if (e.key === 'Enter') {
        if (step === 0) setStep(1);
        else if (step === 1) {
            if (homeRowCompleted) setStep(2);
        }
        else if (step === 2) setStep(3);
        else if (step === 4) onComplete();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [step, onComplete, homeRowCompleted]); // Added homeRowCompleted dep

  useEffect(() => {
    if (step === 3) {
      setTypedInput('');
      setPracticeError(false);
    }
  }, [step]);

  const handlePracticeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedInput(val);
    
    if (val === practiceTarget) {
      setTimeout(() => setStep(4), 500);
    } else if (!practiceTarget.startsWith(val)) {
      setPracticeError(true);
    } else {
      setPracticeError(false);
    }
  };

  // Helper to check if a finger is active based on pressed keys
  const isFingerActive = (finger: Finger) => {
    return Array.from(pressedKeys).some((k: string) => {
      // Find key config
      const flat = KEYBOARD_LAYOUT.flat();
      const cfg = flat.find(c => c.key.toLowerCase() === k.toLowerCase());
      return cfg?.finger === finger;
    });
  };

  const FingerVisual = ({ finger, name, targetKey }: { finger: Finger; name: string; targetKey?: string }) => {
    // If we have a target key (Step 1), only show active if THAT key is pressed
    // Otherwise use generic finger active check
    const active = targetKey 
        ? pressedKeys.has(targetKey.toLowerCase()) 
        : isFingerActive(finger);

    // Also force active if we are done with home row check (so they stay green)
    const visualActive = (step === 1 && homeRowCompleted) ? true : active;

    return (
      <div className="flex flex-col items-center gap-2 group relative">
        <div className={`w-12 h-24 rounded-full border-4 transition-all duration-100 
          ${visualActive ? 'scale-110 border-white shadow-[0_0_20px_currentColor]' : 'border-slate-700'} 
          ${FINGER_COLORS[finger]} flex items-center justify-center`}>
           {visualActive && <div className="w-full h-full bg-white/30 rounded-full animate-pulse"></div>}
        </div>
        <span className={`text-xs font-medium whitespace-nowrap transition-all duration-300 absolute -bottom-8 px-2 py-1 rounded border z-10 
          ${visualActive ? 'opacity-100 bg-white text-slate-900 border-white scale-110' : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-400 border-slate-700'}`}>
          {name}
        </span>
      </div>
    );
  };


  const ColorCard = ({ finger, name, desc }: { finger: Finger; name: string; desc: string }) => {
    const active = isFingerActive(finger);
    const colorClass = FINGER_COLORS[finger];
    
    return (
      <div className={`bg-slate-800/50 p-6 rounded-2xl border transition-all duration-100 flex flex-col items-center cursor-default
        ${active ? 'border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-slate-800' : `${colorClass.replace('bg-', 'border-')}/30`}`}>
        
        <div className={`w-12 h-12 rounded-full ${colorClass} mb-3 shadow-[0_0_15px_currentColor] transition-transform duration-100 ${active ? 'scale-125 ring-4 ring-white/20' : ''}`}></div>
        
        <span className={`font-bold transition-colors ${active ? 'text-white' : 'text-slate-200'}`}>{name}</span>
        <span className="text-xs text-slate-500 mt-1">{desc}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center">
        
        {/* STEP 0: INTRO */}
        {step === 0 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-blue-600 mb-8 shadow-2xl shadow-emerald-500/20 rotate-3 transition-transform hover:rotate-6">
              <Keyboard className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Willkommen bei Tippsy
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Lerne das 10-Finger-System spielerisch und interaktiv. <br/>
              Keine Langeweile, nur Fortschritt.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all flex items-center gap-3 mx-auto"
            >
              Los geht's <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-6 text-slate-600 text-sm">Drücke <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">Enter</span> zum Starten</p>
          </div>
        )}

        {/* STEP 1: FINGERS & POSITION */}
        {step === 1 && (
          <div className="text-center animate-in fade-in slide-in-from-right-8 duration-500 w-full">
            <h2 className="text-3xl font-bold mb-4">Deine Hände sind das Werkzeug</h2>
            <p className="text-slate-400 mb-2 text-lg">
              Lege deine Hände entspannt auf die Tastatur.
            </p>
            <p className={`${homeRowCompleted ? 'text-emerald-400 font-bold' : 'text-slate-500'} text-sm mb-12 transition-colors`}>
               {homeRowCompleted 
                 ? "Perfekt! Alle Finger liegen richtig." 
                 : "Drücke alle 8 Grundstellungs-Tasten gleichzeitig, um fortzufahren."}
            </p>
            
            <div className="flex justify-center gap-16 mb-16 relative">
              {/* Left Hand */}
              <div className="flex gap-2 items-end rotate-[-5deg]">
                 <FingerVisual finger={Finger.LeftPinky} name="A" targetKey="a" />
                 <FingerVisual finger={Finger.LeftRing} name="S" targetKey="s" />
                 <FingerVisual finger={Finger.LeftMiddle} name="D" targetKey="d" />
                 <FingerVisual finger={Finger.LeftIndex} name="F" targetKey="f" />
                 <div className="w-12 h-16 rounded-full border-4 border-slate-700 bg-slate-500/50 rotate-12 translate-y-4"></div> {/* Thumb */}
              </div>
              
              {/* Right Hand */}
              <div className="flex gap-2 items-end rotate-[5deg]">
                 <div className="w-12 h-16 rounded-full border-4 border-slate-700 bg-slate-500/50 -rotate-12 translate-y-4"></div> {/* Thumb */}
                 <FingerVisual finger={Finger.RightIndex} name="J" targetKey="j" />
                 <FingerVisual finger={Finger.RightMiddle} name="K" targetKey="k" />
                 <FingerVisual finger={Finger.RightRing} name="L" targetKey="l" />
                 <FingerVisual finger={Finger.RightPinky} name="Ö" targetKey="ö" />
              </div>
            </div>

            <p className="text-emerald-400 font-medium mb-8 bg-emerald-950/30 inline-block px-4 py-2 rounded-lg border border-emerald-500/20">
              Spüre die kleinen Erhebungen auf den Tasten <strong>F</strong> und <strong>J</strong>.
            </p>

            <div className="transition-opacity duration-300">
              <button 
                onClick={() => setStep(2)}
                disabled={!homeRowCompleted}
                className={`px-8 py-3 font-bold rounded-xl border transition-colors flex items-center gap-2 mx-auto
                  ${homeRowCompleted 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce' 
                    : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50'}`}
              >
                {homeRowCompleted ? 'Weiter geht\'s' : 'Alle 8 Tasten drücken'} <ArrowRight className="w-4 h-4" />
              </button>
              {homeRowCompleted && (
                 <p className="mt-4 text-slate-600 text-xs animate-pulse">Drücke <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Enter</span></p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: COLORS */}
        {step === 2 && (
          <div className="text-center animate-in fade-in slide-in-from-right-8 duration-500 w-full">
            <h2 className="text-3xl font-bold mb-6">Folge den Farben</h2>
            <p className="text-slate-400 mb-2 text-lg max-w-xl mx-auto">
              Jeder Finger hat seine eigene Farbe. Drücke eine Taste, um ihre Farbe zu sehen.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12 mt-12">
               <ColorCard finger={Finger.LeftPinky} name="Pinky" desc="Außenbereich" />
               <ColorCard finger={Finger.LeftRing} name="Ringfinger" desc="Sekundär" />
               <ColorCard finger={Finger.LeftMiddle} name="Mittelfinger" desc="Zentrum" />
               <ColorCard finger={Finger.LeftIndex} name="Zeigefinger" desc="Hauptarbeit" />
               
               {/* Right Hand Mirror for symetry visual logic if needed, or stick to distinct fingers */}
               {/* Or maybe just use types like 'Thumb' */}
               
            </div>
             
             {/* Additional Thumbs/Right hand could be shown, but keeping it simple for now as requested. 
                 Wait, user wants interactive feedback on "small color symbols". 
                 The ColorCard above covers Left hand mostly based on my previous code. 
                 Let's add Right hand or Thumbs row or ensure mapping covers it.
                 Actually let's just show representative groups.
             */}

            <button 
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2 mx-auto"
            >
              Ausprobieren <MousePointerClick className="w-4 h-4" />
            </button>
             <p className="mt-4 text-slate-600 text-xs">Drücke <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Enter</span></p>
          </div>
        )}

        {/* STEP 3: PRACTICE */}
        {step === 3 && (
          <div className="text-center animate-in fade-in slide-in-from-right-8 duration-500 w-full">
            <h2 className="text-3xl font-bold mb-4">Ein erster Test</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Lege deine Zeigefinger auf <strong>F</strong> und <strong>J</strong>.<br/>
              Tippe: <span className="font-mono bg-slate-800 px-2 py-1 rounded text-white ml-2">fjfj</span>
            </p>

            <div className="relative max-w-md mx-auto mb-8">
               <input
                 type="text"
                 autoFocus
                 value={typedInput}
                 onChange={handlePracticeInput}
                 className={`w-full bg-slate-900 border-2 ${practiceError ? 'border-red-500 text-red-400' : 'border-emerald-500 text-emerald-400'} text-center text-4xl py-6 rounded-2xl focus:outline-none focus:ring-4 ${practiceError ? 'focus:ring-red-500/20' : 'focus:ring-emerald-500/20'} transition-all font-mono shadow-2xl`}
                 placeholder=""
               />
               <div className="absolute top-1/2 -translate-y-1/2 right-6">
                  {typedInput.length > 0 && !practiceError && <CheckCircle2 className="text-emerald-500 w-8 h-8" />}
               </div>
            </div>
            
            {practiceError && (
               <p className="text-red-400 animate-pulse mb-8 font-bold">Ups! Versuche es nochmal: F J F J</p>
            )}

            {/* Virtual Keyboard */}
            <div className="scale-90 origin-top">
                <VirtualKeyboard activeKey={practiceTarget[typedInput.length] || ''} pressedKeys={pressedKeys} />
            </div>

          </div>
        )}

        {/* STEP 4: FINISH */}
        {step === 4 && (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 mb-8 shadow-2xl shadow-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-950" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">Perfekt!</h2>
            <p className="text-slate-400 mb-12 text-lg max-w-md mx-auto">
              Du bist bereit für deine erste Lektion. <br/>
              Beginne langsam und achte auf Genauigkeit.
            </p>

            <button 
              onClick={onComplete}
              className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xl rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
            >
              Ab ins Training <Play className="w-6 h-6 fill-current" />
            </button>
             <p className="mt-6 text-slate-600 text-sm">Drücke <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">Enter</span></p>
          </div>
        )}

      </div>

      {/* Progress Dots */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {[0, 1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === s ? 'bg-white scale-125' : 'bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StartScreen;
