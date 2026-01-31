import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';

interface WpmDisplayProps {
  startTime: number | null;
  inputIndex: number;
  totalCharsTyped: number;
  stageId: number;
}

export const WpmDisplay: React.FC<WpmDisplayProps> = ({ startTime, inputIndex, totalCharsTyped, stageId }) => {
  const { t } = useI18n();
  const [wpm, setWpm] = useState(0);

  const stateRef = useRef({ startTime, inputIndex, totalCharsTyped, stageId });
  useEffect(() => {
    stateRef.current = { startTime, inputIndex, totalCharsTyped, stageId };
  }, [startTime, inputIndex, totalCharsTyped, stageId]);

  useEffect(() => {
    // Reset WPM if game is reset (startTime becomes null)
    if (startTime === null) {
      setWpm(0);
    }
  }, [startTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      const { startTime: st, inputIndex: idx, totalCharsTyped: total, stageId: sId } = stateRef.current;
      if (st == null) {
          return;
      }
      const now = Date.now();
      const minutes = (now - st) / 60000;
      const chars = sId === 15 ? total + idx : idx;
      const words = chars / 5;
      const currentWpm = Math.round(words / minutes) || 0;
      setWpm(currentWpm);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{t('typing.wpm')}</p>
      <p className="text-2xl font-mono font-bold text-emerald-400">{wpm}</p>
    </div>
  );
};
