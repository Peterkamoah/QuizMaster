import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import KatexRenderer from './KatexRenderer';


interface ResultsDisplayProps {
  questions: Question[];
  answers: (number | null)[];
  timeTaken: number;
}

export function ResultsDisplay({ questions, answers, timeTaken }: ResultsDisplayProps) {
  const correctAnswers = questions.reduce((count, question, index) => {
    return question.correctAnswerIndex === answers[index] ? count + 1 : count;
  }, 0);
  const incorrectAnswers = questions.length - correctAnswers;
  const score = ((correctAnswers / questions.length) * 100).toFixed(2);
  const timeTakenMinutes = Math.floor(timeTaken / 60000);
  const timeTakenSeconds = Math.floor((timeTaken % 60000) / 1000);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Quiz Results</CardTitle>
          <CardDescription className="text-center">Here is a summary of your performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{score}%</p>
              <p className="text-sm text-muted-foreground">Final Score</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-destructive">{incorrectAnswers}</p>
              <p className="text-sm text-muted-foreground">Incorrect Answers</p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6 text-muted-foreground">
            <Clock className="mr-2 h-5 w-5" />
            <span>Time Taken: {timeTakenMinutes}m {timeTakenSeconds}s</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Review your answers below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = question.correctAnswerIndex === userAnswer;

            return (
              <div key={question.id}>
                <div className="font-semibold text-lg flex items-start">
                  <span className="mr-2">{index + 1}.</span>
                  <KatexRenderer content={question.question} />
                </div>
                <div className="mt-4 space-y-2 pl-6">
                  {question.options.map((option, optionIndex) => {
                    const isUserAnswer = userAnswer === optionIndex;
                    const isCorrectAnswer = question.correctAnswerIndex === optionIndex;
                    
                    return (
                      <div key={optionIndex} className={cn(
                          "flex items-center space-x-3 p-3 rounded-md border",
                          {
                            'bg-primary/10 border-primary text-primary-foreground': isCorrectAnswer,
                            'bg-destructive/10 border-destructive text-destructive-foreground': isUserAnswer && !isCorrect,
                            'bg-card text-card-foreground': !isCorrectAnswer && !(isUserAnswer && !isCorrect)
                          }
                      )}>
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                            {isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            {isUserAnswer && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                        </div>
                        <KatexRenderer content={option} className="flex-1"/>
                      </div>
                    );
                  })}
                </div>
                {index < questions.length - 1 && <Separator className="mt-6"/>}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
