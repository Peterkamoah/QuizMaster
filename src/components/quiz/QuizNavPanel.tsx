import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizNavPanelProps {
  totalQuestions: number;
  answers: (number | null)[];
  flaggedQuestions: boolean[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onSubmit: () => void;
}

export function QuizNavPanel({
  totalQuestions,
  answers,
  flaggedQuestions,
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

          return (
            <Button
              key={index}
              size="icon"
              onClick={() => onSelectQuestion(index)}
              className={cn(
                'h-10 w-10 transition-all duration-200 font-bold',
                isCurrent
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-offset-background ring-ring'
                    : isFlagged
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                    : isAnswered
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : 'border border-input bg-background hover:bg-muted'
              )}
            >
              {index + 1}
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
