"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
  onTick?: (secondsLeft: number) => void;
}

export function Timer({ durationInMinutes, onTimeUp, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const initialSeconds = durationInMinutes * 60;
    setTimeLeft(initialSeconds);
    if (onTick) {
      onTick(initialSeconds);
    }
  }, [durationInMinutes, onTick]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime !== null ? prevTime - 1 : null;
        if (newTime !== null && onTick) {
          onTick(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp, onTick]);
  
  if (timeLeft === null) {
    return (
        <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-7 w-7" />
            <span className="text-3xl font-bold font-mono tracking-widest">--:--</span>
        </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timeColorClass = timeLeft < 60 ? 'text-destructive' : 'text-foreground';

  return (
    <div className={`flex items-center space-x-2 ${timeColorClass} transition-colors`}>
      <Clock className="h-7 w-7" />
      <span className="text-3xl font-bold font-mono tracking-widest">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
