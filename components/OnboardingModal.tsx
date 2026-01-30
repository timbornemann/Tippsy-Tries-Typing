import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface OnboardingModalProps {
  onDismiss: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <style>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="bg-[#0f1623] border border-emerald-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-modal-enter">
        
        {/* Header with decorative elements */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 p-6 relative overflow-hidden">
          {/* Decorative background orb */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-xl shadow-lg inline-flex">
              <Keyboard className="w-8 h-8 text-white" />
            </div>
            <button 
              onClick={onDismiss}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Schließen"
            >
              <X size={20} />
            </button>
          </div>
          
          <h2 className="mt-5 text-2xl font-bold text-white">Willkommen!</h2>
          <p className="text-emerald-300 text-sm font-medium uppercase tracking-wider mt-1">Dein Tipp-Abenteuer beginnt</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-slate-300 text-base leading-relaxed">
               Tippe einfach die <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">grün hervorgehobenen</span> Zeichen nacheinander ab.
            </p>
            
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex gap-3">
               <span className="text-2xl">👇</span>
               <p className="text-slate-400 text-sm pt-1">
                  Dein aktueller Finger wird dir immer unten auf der virtuellen Tastatur angezeigt.
               </p>
            </div>
          </div>
          
          <button 
            onClick={onDismiss}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-emerald-500/20"
          >
            Verstanden, los geht's!
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingModal;
