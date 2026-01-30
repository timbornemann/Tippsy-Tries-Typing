import React, { useEffect, useMemo } from 'react';
import { UserProgress, GlobalStats } from '../types';
import { STAGES } from '../constants';
import { Home, Trophy, Clock, Keyboard, Activity, Target, AlertCircle, TrendingUp } from 'lucide-react';

interface StatisticsProps {
  progress: UserProgress;
  onBack: () => void;
}

const STAT_CARD_STYLES: Record<string, { card: string; blob: string; icon: string }> = {
  emerald: { card: 'border border-emerald-500/50 hover:border-emerald-500/70', blob: 'bg-emerald-500/10', icon: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' },
  blue:    { card: 'border border-blue-500/50 hover:border-blue-500/70',    blob: 'bg-blue-500/10',    icon: 'bg-blue-500/10 text-blue-400 ring-blue-500/20' },
  yellow: { card: 'border border-yellow-500/50 hover:border-yellow-500/70', blob: 'bg-yellow-500/10',  icon: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20' },
  violet: { card: 'border border-violet-500/50 hover:border-violet-500/70',  blob: 'bg-violet-500/10',  icon: 'bg-violet-500/10 text-violet-400 ring-violet-500/20' },
  cyan:   { card: 'border border-cyan-500/50 hover:border-cyan-500/70',     blob: 'bg-cyan-500/10',    icon: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20' },
  rose:   { card: 'border border-rose-500/50 hover:border-rose-500/70',    blob: 'bg-rose-500/10',   icon: 'bg-rose-500/10 text-rose-400 ring-rose-500/20' },
};

const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorKey,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ size?: number }>;
  colorKey: keyof typeof STAT_CARD_STYLES;
}) => {
  const s = STAT_CARD_STYLES[colorKey] ?? STAT_CARD_STYLES.emerald;
  return (
    <div className={`bg-slate-900/80 p-6 rounded-2xl flex items-center gap-6 shadow-xl relative overflow-hidden group transition-colors ${s.card}`}>
      <div className={`absolute right-0 top-0 p-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none ${s.blob}`}></div>
      <div className={`p-4 rounded-xl ring-1 ${s.icon}`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white font-mono">{value}</h3>
        {subtext && <p className="text-slate-500 text-xs mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

const Statistics: React.FC<StatisticsProps> = ({ progress, onBack }) => {
  const stats = progress.stats;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ${Math.round(seconds % 60)}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const errorCountByChar = progress.errorCountByChar ?? {};
  const topErrorChars = useMemo(() => {
    return Object.entries(errorCountByChar)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [errorCountByChar]);

  const sessionHistory = progress.sessionHistory ?? [];
  const last7 = useMemo(() => sessionHistory.slice(-7).reverse(), [sessionHistory]);
  const last30 = useMemo(() => sessionHistory.slice(-30).reverse(), [sessionHistory]);
  const maxWpm = useMemo(() => Math.max(1, ...last30.map(s => s.wpm)), [last30]);

  const perStageBest = progress.perStageBest ?? {};
  const perStageList = useMemo(() => {
    return STAGES.map(stage => {
      let bestWpm = 0;
      let bestAccuracy = 0;
      for (let sub = 0; sub <= 5; sub++) {
        const key = `${stage.id}_${sub}`;
        const b = perStageBest[key];
        if (b?.bestWpm != null) bestWpm = Math.max(bestWpm, b.bestWpm);
        if (b?.bestAccuracy != null) bestAccuracy = Math.max(bestAccuracy, b.bestAccuracy);
      }
      return { stage, bestWpm: bestWpm || undefined, bestAccuracy: bestAccuracy || undefined };
    }).filter(({ bestWpm, bestAccuracy }) => bestWpm > 0 || bestAccuracy > 0);
  }, [perStageBest]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-full transition-colors group" title="Zurück (Esc)">
          <Home size={24} className="text-slate-400 group-hover:text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">Deine Statistik</h1>
      </div>
      <p className="text-slate-500 text-xs mb-6">Esc = Zurück zum Menü</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Getippte Zeichen" value={stats.totalCharsTyped.toLocaleString()} subtext="Jeder Anschlag zählt!" icon={Keyboard} colorKey="emerald" />
        <StatCard title="Spielzeit" value={formatTime(stats.totalTimePlayed)} subtext="Investierte Zeit" icon={Clock} colorKey="blue" />
        <StatCard title="Rekord WPM" value={stats.highestWpm} subtext="Deine Höchstgeschwindigkeit" icon={Trophy} colorKey="yellow" />
        <StatCard title="Absolvierte Übungen" value={stats.gamesPlayed} subtext="Level & Übungen" icon={Target} colorKey="violet" />
        <StatCard title="Durchschnitt WPM" value={Math.round(stats.averageWpm)} subtext="Stetige Leistung" icon={Activity} colorKey="cyan" />
        <StatCard title="Genauigkeit Ø" value={`${Math.round(stats.averageAccuracy)}%`} subtext="Fehlerquote im Schnitt" icon={Target} colorKey="rose" />
      </div>

      {/* Verlauf über Zeit (WPM letzte 7 / 30) */}
      {last30.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={22} className="text-emerald-400" />
            Verlauf (WPM)
          </h2>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-4">Letzte {last7.length} Sessions (neueste rechts)</p>
            <div className="flex items-end gap-2 h-24">
              {last7.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-emerald-500/80 rounded-t min-h-[4px] transition-all"
                    style={{ height: `${Math.max(8, (s.wpm / maxWpm) * 80)}px` }}
                    title={`${s.date}: ${s.wpm} WPM, ${s.accuracy}%`}
                  />
                  <span className="text-[10px] text-slate-500 truncate max-w-full">{s.date.slice(5)}</span>
                </div>
              ))}
            </div>
            {last30.length > 7 && (
              <p className="text-slate-500 text-xs mt-3">Insgesamt {last30.length} Sessions gespeichert (max. 30).</p>
            )}
          </div>
        </section>
      )}

      {/* Pro-Stage-Besten */}
      {perStageList.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Beste Leistung pro Stage</h2>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="py-2 pr-4">Stage</th>
                  <th className="py-2 pr-4">Beste WPM</th>
                  <th className="py-2">Beste Genauigkeit</th>
                </tr>
              </thead>
              <tbody>
                {perStageList.map(({ stage, bestWpm, bestAccuracy }) => (
                  <tr key={stage.id} className="border-b border-slate-800/50">
                    <td className="py-2 pr-4 text-white font-medium">{stage.name}</td>
                    <td className="py-2 pr-4 font-mono text-emerald-400">{bestWpm ?? '–'}</td>
                    <td className="py-2 font-mono text-blue-400">{bestAccuracy != null ? `${bestAccuracy}%` : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Fehleranalyse */}
      {topErrorChars.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle size={22} className="text-rose-400" />
            Häufig vertippte Zeichen
          </h2>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-4">Diese Zeichen hast du bisher am häufigsten falsch getippt. Übe sie gezielt in der jeweiligen Stage.</p>
            <div className="flex flex-wrap gap-3">
              {topErrorChars.map(([char, count]) => (
                <div
                  key={char}
                  className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2"
                >
                  <span className="font-mono text-lg text-white">{char === ' ' ? '␣' : char}</span>
                  <span className="text-slate-400 text-sm">{count}×</span>
                </div>
              ))}
            </div>
            <p className="text-emerald-400/90 text-sm mt-4 font-medium">Tipp: Wähle die passende Stage und klicke auf „Üben“, um gezielt zu trainieren.</p>
          </div>
        </section>
      )}

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
