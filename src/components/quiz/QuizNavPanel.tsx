import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuizNavPanelProps {
  totalQuestions: number;
  answers: (number | null)[];
  visitedQuestions: boolean[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onSubmit: () => void;
}

export function QuizNavPanel({
  totalQuestions,
  answers,
  visitedQuestions,
  currentQuestionIndex,
  onSelectQuestion,
  onSubmit
}: QuizNavPanelProps) {
  return (
    <Card className="shadow-md md:sticky md:top-6">
      <CardHeader>
        <CardTitle>Quiz Navigation</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isCurrent = index === currentQuestionIndex;
          const isAnswered = answers[index] !== null;
          const isVisited = visitedQuestions[index];

          return (
            <Button
              key={index}
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onSelectQuestion(index);
              }}
              className={cn(
                'h-10 w-10 transition-all duration-200 font-bold relative',
                isCurrent
                  ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                  : isAnswered
                  ? 'bg-success text-success-foreground border-success hover:bg-success/90'
                  : isVisited
                  ? 'bg-card text-card-foreground border border-muted-foreground hover:bg-muted'
                  : 'bg-card text-card-foreground border hover:bg-muted'
              )}
            >
              {index + 1}
            </Button>
          );
        })}
      </CardContent>
      <CardFooter className="hidden md:flex flex-col space-y-2 mt-4">
        <Button className="w-full" onClick={onSubmit}>
          Finish Attempt...
        </Button>
      </CardFooter>
    </Card>
  );
}
