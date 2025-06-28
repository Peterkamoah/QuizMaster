
"use client";

import { useState, useCallback, useEffect } from 'react';
import type { Question } from '@/lib/types';
import { QuestionDisplay } from './QuestionDisplay';
import { QuizNavPanel } from './QuizNavPanel';
import { ResultsDisplay } from './ResultsDisplay';
import { SubmissionModal } from './SubmissionModal';
import { Timer } from './Timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, EyeOff, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizClientProps {
  questions: Question[];
  timerDuration: number; // in minutes, 0 for no timer
  onReturnHome: () => void;
}

export function QuizClient({ questions, timerDuration, onReturnHome }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);

  // State for timer functionality
  const [timeLeft, setTimeLeft] = useState(timerDuration > 0 ? timerDuration * 60 : 0);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const isTimeCritical = timeLeft < 60; // 1 minute threshold

  useEffect(() => {
    setSelectedAnswer(answers[currentQuestionIndex]);
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    if (questions.length > 0) {
      const newVisited = [...visitedQuestions];
      newVisited[0] = true;
      setVisitedQuestions(newVisited);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);


  const markAsVisited = (index: number) => {
    if (!visitedQuestions[index]) {
      const newVisited = [...visitedQuestions];
      newVisited[index] = true;
      setVisitedQuestions(newVisited);
    }
  };

  const handleSubmit = useCallback(() => {
    setTimeTaken(Date.now() - startTime);
    setIsSubmitted(true);
    setShowSubmissionModal(false);
  }, [startTime]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleAnswerChange = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleFlag = () => {
    const newFlags = [...flaggedQuestions];
    newFlags[currentQuestionIndex] = !newFlags[currentQuestionIndex];
    setFlaggedQuestions(newFlags);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      markAsVisited(nextIndex);
    } else {
      setShowSubmissionModal(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      markAsVisited(prevIndex);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    markAsVisited(index);
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercentage = (answeredCount / questions.length) * 100;


  if (isSubmitted) {
    return <ResultsDisplay questions={questions} answers={answers} timeTaken={timeTaken} onReturnHome={onReturnHome} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
           {/* Mobile-only Timer with sticky and hide/show functionality */}
           {timerDuration > 0 && (
             <div className="md:hidden sticky top-4 z-20">
                {isTimerVisible ? (
                    <Card className={cn("shadow-lg transition-colors backdrop-blur-md bg-card/60", isTimeCritical && "bg-destructive/20 border-destructive")}>
                        <CardHeader className="flex-row items-center justify-between p-3">
                            <CardTitle className="text-lg">Time Remaining</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsTimerVisible(false)}>
                                <EyeOff className="h-4 w-4" />
                                <span className="sr-only">Hide Timer</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex justify-center p-4 pt-0">
                            <Timer durationInMinutes={timerDuration} onTimeUp={handleTimeUp} onTick={setTimeLeft} />
                        </CardContent>
                    </Card>
                ) : (
                    <Button onClick={() => setIsTimerVisible(true)} className="w-full">
                        <Clock className="mr-2 h-4 w-4" /> Show Timer
                    </Button>
                )}
            </div>
           )}

            {/* Mobile-only Collapsible Navigation */}
            <Collapsible
              open={isMobileNavOpen}
              onOpenChange={setIsMobileNavOpen}
              className="space-y-2 md:hidden"
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex justify-between">
                  <span>Question Navigation</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isMobileNavOpen && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                 <QuizNavPanel
                    totalQuestions={questions.length}
                    answers={answers}
                    flaggedQuestions={flaggedQuestions}
                    visitedQuestions={visitedQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={(index) => {
                      handleSelectQuestion(index);
                      setIsMobileNavOpen(false); // Close after selection
                    }}
                    onSubmit={() => {
                      setShowSubmissionModal(true);
                      setIsMobileNavOpen(false);
                    }}
                 />
              </CollapsibleContent>
            </Collapsible>

          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                <div className="hidden md:block text-sm text-muted-foreground">{answeredCount} of {questions.length} Answered</div>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </CardHeader>
            <CardContent>
              <QuestionDisplay
                question={questions[currentQuestionIndex]}
                selectedAnswer={selectedAnswer}
                onAnswerChange={handleAnswerChange}
                onFlag={handleFlag}
                isFlagged={flaggedQuestions[currentQuestionIndex]}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={currentQuestionIndex === questions.length - 1}
              />
            </CardContent>
          </Card>

          {/* Mobile-only Finish Button */}
          <div className="md:hidden">
            <Button className="w-full" size="lg" onClick={() => setShowSubmissionModal(true)}>
              Finish Attempt...
            </Button>
          </div>
        </div>
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-1 space-y-6">
           {timerDuration > 0 && (
             <Card className={cn("shadow-md transition-colors", isTimeCritical && "bg-destructive/10 border-destructive")}>
                <CardHeader>
                  <CardTitle className="text-center text-lg">Time Remaining</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Timer durationInMinutes={timerDuration} onTimeUp={handleTimeUp} onTick={setTimeLeft} />
                </CardContent>
             </Card>
           )}
          <QuizNavPanel
            totalQuestions={questions.length}
            answers={answers}
            flaggedQuestions={flaggedQuestions}
            visitedQuestions={visitedQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onSelectQuestion={handleSelectQuestion}
            onSubmit={() => setShowSubmissionModal(true)}
          />
        </div>
      </div>
      <SubmissionModal
        open={showSubmissionModal}
        onOpenChange={setShowSubmissionModal}
        onConfirm={handleSubmit}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />
    </>
  );
}
