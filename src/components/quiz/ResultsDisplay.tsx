import { useState } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizReview } from './QuizReview';


interface ResultsDisplayProps {
  questions: Question[];
  answers: (number | null)[];
  timeTaken: number;
  onReturnHome: () => void;
}

export function ResultsDisplay({ questions, answers, timeTaken, onReturnHome }: ResultsDisplayProps) {
  const [showReview, setShowReview] = useState(false);

  const correctAnswers = questions.reduce((count, question, index) => {
    return question.correctAnswerIndex === answers[index] ? count + 1 : count;
  }, 0);
  const incorrectAnswers = questions.length - correctAnswers;
  const score = questions.length > 0 ? ((correctAnswers / questions.length) * 100).toFixed(2) : 0;
  const timeTakenMinutes = Math.floor(timeTaken / 60000);
  const timeTakenSeconds = Math.floor((timeTaken % 60000) / 1000);

  if (showReview) {
    return (
        <QuizReview
            questions={questions}
            answers={answers}
            score={Number(score)}
            onReturnHome={onReturnHome}
        />
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <BarChart className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl mt-4">Quiz Complete!</CardTitle>
          <CardDescription>Here is a summary of your performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-primary">{score}%</p>
              <p className="text-sm text-muted-foreground">Final Score</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-green-600 dark:text-green-500">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-destructive">{incorrectAnswers}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>
          <div className="flex items-center justify-center text-muted-foreground">
            <Clock className="mr-2 h-5 w-5" />
            <span>Time Taken: {timeTakenMinutes}m {timeTakenSeconds}s</span>
          </div>
           <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button onClick={() => setShowReview(true)} size="lg">
                Review Answers & Explanations
              </Button>
              <Button onClick={onReturnHome} variant="outline" size="lg">
                Take a New Quiz
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}