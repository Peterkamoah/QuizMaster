import { memo } from 'react';
import type { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import KatexRenderer from './KatexRenderer';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerChange: (optionIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export const QuestionDisplay = memo(function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerChange,
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
        value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
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

      <div className="flex justify-end pt-4">
        <div className="flex w-full space-x-4 md:w-auto">
          <Button variant="secondary" onClick={onPrev} disabled={isFirstQuestion} className="w-1/2 md:w-auto">
            Previous
          </Button>
          <Button onClick={onNext} className="w-1/2 md:w-auto">
            {isLastQuestion ? 'Finish Attempt...' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
});