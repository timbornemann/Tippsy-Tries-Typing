import React, { memo } from 'react';

interface TypingTapeProps {
  content: string;
  inputIndex: number;
  errorShake: boolean;
}

const TypingTape: React.FC<TypingTapeProps> = ({ content, inputIndex, errorShake }) => {
  return (
    <div className="relative w-full bg-slate-900 rounded-2xl mb-8 border border-slate-800 shadow-inner h-40 overflow-hidden group">
         {/* Gradients for fade effect */}
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>

         {/* Center Marker (Visual Aid) */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-24 rounded-lg bg-emerald-500/5 border border-emerald-500/20 z-0 pointer-events-none"></div>

         {/* Viewport-sized wrapper so left:50% = Mitte des sichtbaren Bereichs */}
         <div className="absolute inset-0 flex items-center">
           <div
             className="absolute top-0 bottom-0 flex items-center transition-transform duration-200 ease-out will-change-transform"
             style={{
               left: '50%',
               transform: `translateX(-${inputIndex * 64 + 32}px)`,
             }}
           >

           {content.split('').map((char, idx) => {
             let statusColor = 'text-slate-600'; // Upcoming
             let scale = 'scale-100';
             let activeStyle = '';

             if (idx < inputIndex) {
               statusColor = 'text-emerald-500 opacity-60'; // Completed
             } else if (idx === inputIndex) {
               statusColor = 'text-white';
               scale = 'scale-110';
               if (errorShake) {
                 statusColor = 'text-rose-500';
                 activeStyle = 'z-10 drop-shadow-[0_0_10px_rgba(255,50,50,0.5)] font-bold animate-shake';
               } else {
                 activeStyle = 'z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] font-bold';
               }
             }

             return (
               <div
                 key={idx}
                 className={`flex items-center justify-center w-16 h-24 text-4xl font-mono shrink-0 transition-all duration-200 ${statusColor} ${scale} ${activeStyle}`}
               >
                 {char === ' ' ? (
                   <span className="opacity-30 text-2xl">␣</span>
                 ) : char === '\n' ? (
                   <span className="opacity-50 text-2xl">↵</span>
                 ) : (
                   char
                 )}
               </div>
             );
           })}
           </div>
         </div>
         <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
      </div>
  );
};

export default memo(TypingTape);
