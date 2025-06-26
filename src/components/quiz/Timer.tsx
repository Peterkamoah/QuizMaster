"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
}

export function Timer({ durationInMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    setTimeLeft(durationInMinutes * 60);
  }, [durationInMinutes]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);
  
  if (timeLeft === null) {
    return <div className="flex items-center space-x-2 font-medium">Loading...</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timeColorClass = timeLeft < 60 ? 'text-destructive' : 'text-foreground';

  return (
    <div className={`flex items-center space-x-2 font-medium ${timeColorClass} transition-colors`}>
      <Clock className="h-5 w-5" />
      <span>
        Time left: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
