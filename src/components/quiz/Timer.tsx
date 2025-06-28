
"use client";

import { Clock } from 'lucide-react';

interface TimerProps {
  secondsLeft: number;
}

export function Timer({ secondsLeft }: TimerProps) {
  // Render a placeholder if time is not initialized (e.g., set to -1).
  if (secondsLeft < 0) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Clock className="h-7 w-7" />
        <span className="text-3xl font-bold font-mono tracking-widest">--:--</span>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Color logic is now handled by the parent component's wrapper Card.
  return (
    <div className="flex items-center space-x-2">
      <Clock className="h-7 w-7" />
      <span className="text-3xl font-bold font-mono tracking-widest">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
