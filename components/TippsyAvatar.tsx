import React from 'react';

interface TippsyProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'sleeping';
  className?: string;
}

const TippsyAvatar: React.FC<TippsyProps> = ({ mood = 'happy', className = '' }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="coolMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" /> {/* slate-100 */}
          <stop offset="100%" stopColor="#64748b" /> {/* slate-500 */}
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
           <feGaussianBlur stdDeviation="3" result="blur" />
           <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hover Animation - Slower, more controlled */}
      <g className="animate-[bounce_4s_ease-in-out_infinite]">
        
        {/* Jet Thruster Flame */}
        <path d="M 100,160 L 90,180 L 100,175 L 110,180 Z" fill="#34d399" className="animate-pulse" filter="url(#neonGlow)" />
        <path d="M 100,160 L 95,170 L 100,168 L 105,170 Z" fill="white" />

        {/* Body Main Chassis */}
        <path 
           d="M 60,60 L 140,60 L 130,130 L 70,130 Z" 
           fill="url(#coolMetal)" 
           stroke="#475569" 
           strokeWidth="2" 
        />
        
        {/* Chest Plate / Core */}
        <path d="M 80,130 L 70,90 L 130,90 L 120,130 Z" fill="#334155" />
        {/* Arc Reactor Core */}
        <circle cx="100" cy="110" r="12" fill="#10b981" filter="url(#neonGlow)" className="animate-pulse" />
        <circle cx="100" cy="110" r="6" fill="#ecfdf5" />

        {/* Visor (The "Cool" Factor) - Shiny Black Glass */}
        <path 
           d="M 55,60 
              L 145,60 
              L 140,85 
              Q 100,95 60,85 
              Z" 
           fill="url(#visorGrad)" 
           stroke="#bae6fd" 
           strokeWidth="1" 
           strokeOpacity="0.5"
        />

        {/* EYES ON VISOR - Digital & Sleek */}
        <g filter="url(#neonGlow)">
           {mood === 'happy' || mood === 'excited' ? (
             <>
               {/* Left Eye - Angled Rect */}
               <path d="M 75,70 L 90,70 L 88,78 L 73,78 Z" fill="#00ffcc" />
               {/* Right Eye - Angled Rect */}
               <path d="M 110,70 L 125,70 L 127,78 L 112,78 Z" fill="#00ffcc" />
             </>
           ) : mood === 'thinking' ? (
              <>
                 <rect x="75" y="72" width="15" height="4" fill="#00ffcc" />
                 <path d="M 110,70 L 125,70 L 127,78 L 112,78 Z" fill="#00ffcc" />
              </>
           ) : null}
        </g>

        {/* "Headphones" / Side Vents */}
        <path d="M 50,70 L 60,65 L 60,90 L 55,95 Z" fill="#475569" />
        <path d="M 150,70 L 140,65 L 140,90 L 145,95 Z" fill="#475569" />

        {/* Antenna - Sleek Fin */}
        <path d="M 130,60 L 145,30 L 135,60" fill="#94a3b8" stroke="#475569" strokeWidth="1" />

        {/* Floating Hands - Disconnected Rayman style but techy */}
        <g className="animate-[wave_3s_ease-in-out_infinite_alternate]">
           <path d="M 40,110 L 30,125 L 35,135 L 50,130" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        </g>
        <g className="animate-[wave_3.5s_ease-in-out_infinite_alternate]">
           <path d="M 160,110 L 170,125 L 165,135 L 150,130" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        </g>

        {/* Expression Detail (Smirk or Cool Mouth) */}
        {/* Since visor covers eyes, mouth is below on chassis? No, robots often just have eyes. */}
        {/* Let's put a small digital EQ display on the chest instead for mood */}
        {mood === 'excited' && (
           <g transform="translate(85, 140)">
              <rect x="0" y="0" width="4" height="6" fill="#34d399" className="animate-pulse" />
              <rect x="8" y="0" width="4" height="10" fill="#34d399" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
              <rect x="16" y="0" width="4" height="4" fill="#34d399" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
              <rect x="24" y="0" width="4" height="8" fill="#34d399" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
           </g>
        )}

      </g>
    </svg>
  );
};

export default TippsyAvatar;
