"use client";

import { useState } from 'react';
import { QuizClient } from '@/components/quiz/QuizClient';
import { quizQuestions as sampleQuiz } from '@/lib/quiz-data';
import type { Question } from '@/lib/types';
import { QuizSetup } from '@/components/quiz/QuizSetup';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, type QuizGenerationOutput, type QuizGenerationInput } from '@/ai/flows/quiz-flow';
import { ThemeToggle } from '@/components/theme-toggle';

type Status = 'idle' | 'loading' | 'active';

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [timerDuration, setTimerDuration] = useState(10); // Default timer
  const { toast } = useToast();
  
  const createQuiz = async (input: QuizGenerationInput) => {
    setStatus('loading');
    try {
      const result: QuizGenerationOutput = await generateQuiz(input);
      if (!result || result.length === 0) {
        throw new Error("The AI failed to generate questions.");
      }
      const formattedQuestions: Question[] = result.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.answer,
        explanation: q.explanation,
      }));
      setQuizQuestions(formattedQuestions);
      setStatus('active');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Quiz Generation Failed",
        description: `Sorry, we couldn't generate a quiz. ${errorMessage}`
      });
      setStatus('idle');
    }
  };

  const handleQuizStart = (input: QuizGenerationInput, timerMinutes: number) => {
    setTimerDuration(timerMinutes);
    createQuiz(input);
  };
  
  const handleStartSampleQuiz = () => {
    setTimerDuration(10); // Sample quiz timer
    setQuizQuestions(sampleQuiz);
    setStatus('active');
  };

  const handleReturnHome = () => {
    setStatus('idle');
    setQuizQuestions([]);
  };

  if (status === 'active') {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-headline font-bold text-primary">QuizMaster</h1>
             <ThemeToggle />
          </header>
          <QuizClient 
            questions={quizQuestions} 
            timerDuration={timerDuration}
            onReturnHome={handleReturnHome}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div />
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold text-primary dark:text-slate-200">QuizMaster</h1>
                <p className="text-muted-foreground dark:text-slate-400 mt-2">Generate a custom quiz from your study materials.</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold text-muted-foreground dark:text-slate-400">Brewing your questions...</p>
          </div>
        ) : (
          <QuizSetup 
            onStartQuiz={handleQuizStart} 
            onStartSampleQuiz={handleStartSampleQuiz}
          />
        )}
      </div>
    </div>
  );
}
