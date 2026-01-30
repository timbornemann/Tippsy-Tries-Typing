import React from 'react';
import { GlobalStats } from '../types';
import { Home, Trophy, Clock, Keyboard, Activity, Target } from 'lucide-react';

interface StatisticsProps {
  stats: GlobalStats;
  onBack: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ stats, onBack }) => {
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
    <div className={`bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl relative overflow-hidden group hover:border-${colorClass}-500/50 transition-colors`}>
      <div className={`absolute right-0 top-0 p-32 bg-${colorClass}-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`}></div>
      
      <div className={`p-4 rounded-xl bg-${colorClass}-500/10 text-${colorClass}-400 ring-1 ring-${colorClass}-500/20`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white font-mono">{value}</h3>
        {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-full transition-colors group">
          <Home size={24} className="text-slate-400 group-hover:text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">Deine Statistik</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Characters */}
        <StatCard 
          title="Getippte Zeichen" 
          value={stats.totalCharsTyped.toLocaleString()} 
          subtext="Jeder Anschlag zählt!"
          icon={Keyboard}
          colorClass="emerald"
        />

        {/* Playtime */}
        <StatCard 
          title="Spielzeit" 
          value={formatTime(stats.totalTimePlayed)} 
          subtext="Investierte Zeit"
          icon={Clock}
          colorClass="blue"
        />

        {/* Highest WPM */}
        <StatCard 
          title="Rekord WPM" 
          value={stats.highestWpm} 
          subtext="Deine Höchstgeschwindigkeit"
          icon={Trophy}
          colorClass="yellow"
        />

        {/* Games Played */}
        <StatCard 
          title="Absolvierte Übungen" 
          value={stats.gamesPlayed} 
          subtext="Level & Übungen"
          icon={Target}
          colorClass="violet"
        />

        {/* Avg WPM */}
        <StatCard 
          title="Durchschnitt WPM" 
          value={Math.round(stats.averageWpm)} 
          subtext="Stetige Leistung"
          icon={Activity}
          colorClass="cyan"
        />

        {/* Avg Accuracy */}
        <StatCard 
          title="Genauigkeit Ø" 
          value={`${Math.round(stats.averageAccuracy)}%`} 
          subtext="Fehlerquote im Schnitt"
          icon={Target} // Reusing target or could use specialized icon
          colorClass="rose"
        />

      </div>

      <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">Bleib dran!</h3>
          <p className="text-slate-400 max-w-xl mx-auto">
            Regelmäßiges Üben ist der Schlüssel zum 10-Finger-System. Versuche jeden Tag 10 Minuten zu investieren, um deine Statistik zu verbessern.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;