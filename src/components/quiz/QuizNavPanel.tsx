import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Flag } from 'lucide-react';

interface QuizNavPanelProps {
  totalQuestions: number;
  answers: (number | null)[];
  flaggedQuestions: boolean[];
  visitedQuestions: boolean[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onSubmit: () => void;
}

export function QuizNavPanel({
  totalQuestions,
  answers,
  flaggedQuestions,
  visitedQuestions,
  currentQuestionIndex,
  onSelectQuestion,
  onSubmit
}: QuizNavPanelProps) {
  return (
    <Card className="sticky top-6 shadow-md">
      <CardHeader>
        <CardTitle>Quiz Navigation</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isCurrent = index === currentQuestionIndex;
          const isAnswered = answers[index] !== null;
          const isFlagged = flaggedQuestions[index];
          const isVisited = visitedQuestions[index];

          return (
            <Button
              key={index}
              size="icon"
              onClick={() => onSelectQuestion(index)}
              className={cn(
                'h-10 w-10 transition-all duration-200 font-bold relative',
                isCurrent
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                  : isAnswered
                  ? 'bg-green-600 dark:bg-green-700 border-green-700 text-white hover:bg-green-700/90'
                  : isVisited
                  ? 'bg-card text-card-foreground border border-muted-foreground hover:bg-muted'
                  : 'bg-card text-card-foreground border hover:bg-muted'
              )}
            >
              {index + 1}
              {isFlagged && <Flag className="absolute top-0.5 right-0.5 h-3 w-3 text-accent-foreground fill-accent" />}
            </Button>
          );
        })}
      </CardContent>
      <CardFooter className="flex-col space-y-2 mt-4">
        <Button className="w-full" onClick={onSubmit}>
          Finish Attempt...
        </Button>
      </CardFooter>
    </Card>
  );
}
