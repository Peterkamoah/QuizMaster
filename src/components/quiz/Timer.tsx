
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

  // Initialize or reset the timer when duration changes.
  useEffect(() => {
    setTimeLeft(durationInMinutes * 60);
  }, [durationInMinutes]);

  // Handle the countdown logic.
  useEffect(() => {
    // Don't start the timer until timeLeft is initialized.
    if (timeLeft === null) {
      return;
    }

    // If time is up, call onTimeUp and stop the interval.
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Set up the interval.
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : 0));
    }, 1000);

    // Clean up the interval on component unmount or when timeLeft changes.
    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  // Report the current time back to the parent component.
  // This effect runs after the state update and avoids the "update during render" error.
  useEffect(() => {
    if (timeLeft !== null && onTick) {
      onTick(timeLeft);
    }
  }, [timeLeft, onTick]);
  
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
