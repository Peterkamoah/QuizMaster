import type { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Flag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import KatexRenderer from './KatexRenderer';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerChange: (optionIndex: number) => void;
  onFlag: () => void;
  isFlagged: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerChange,
  onFlag,
  isFlagged,
  onNext,
  onPrev,
  isFirstQuestion,
  isLastQuestion,
}: QuestionDisplayProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="text-lg font-semibold">
        <KatexRenderer content={question.question} />
      </div>
      
      <RadioGroup
        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
        onValueChange={(value) => onAnswerChange(parseInt(value))}
        className="space-y-4"
      >
        {question.options.map((option, index) => (
          <Label 
            key={index} 
            htmlFor={`option-${index}`} 
            className={cn(
                "flex items-center space-x-3 p-4 rounded-md border cursor-pointer transition-all",
                selectedAnswer === index ? "bg-primary/10 border-primary" : "bg-card hover:bg-muted/50"
            )}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <KatexRenderer content={option} className="text-base font-normal w-full" />
          </Label>
        ))}
      </RadioGroup>

      <Separator />

      <div className="flex justify-between items-center flex-wrap gap-4">
        <Button
          variant={isFlagged ? "default" : "outline"}
          onClick={onFlag}
          className={cn({
            "bg-accent hover:bg-accent/90 text-accent-foreground": isFlagged
          })}
        >
          <Flag className="mr-2 h-4 w-4" />
          {isFlagged ? 'Flagged' : 'Flag for Review'}
        </Button>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onPrev} disabled={isFirstQuestion}>
            Previous
          </Button>
          <Button onClick={onNext} disabled={isLastQuestion}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
