
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
import { ChevronDown, EyeOff, Clock, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface QuizClientProps {
  questions: Question[];
  timerDuration: number; // in minutes, 0 for no timer
  onReturnHome: () => void;
}

export function QuizClient({ questions, timerDuration, onReturnHome }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(true);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);

  // State for timer functionality
  const [timeLeft, setTimeLeft] = useState(timerDuration > 0 ? timerDuration * 60 : -1);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const isTimeCritical = timeLeft >= 0 && timeLeft < 60; // 1 minute threshold

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

  // This effect handles the timer countdown logic. It's in the parent component
  // so the timer's state persists even when the mobile timer is hidden.
  useEffect(() => {
    // Only run the timer if it's enabled and the quiz isn't submitted.
    if (timerDuration <= 0 || isSubmitted) {
      return;
    }

    // When time is up, submit the quiz.
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    // Don't start the interval if time is not initialized yet.
    if (timeLeft < 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, timerDuration, isSubmitted, handleSubmit]);

  const handleAnswerChange = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
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
             <>
                {isTimerVisible ? (
                    <div className="sticky top-4 z-20 md:hidden">
                        <Card className={cn("shadow-lg transition-colors backdrop-blur-md bg-card/60", isTimeCritical && "bg-destructive/20 border-destructive")}>
                            <CardHeader className="flex-row items-center justify-between p-3">
                                <CardTitle className="text-lg">Time Remaining</CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsTimerVisible(false)}>
                                    <EyeOff className="h-4 w-4" />
                                    <span className="sr-only">Hide Timer</span>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex justify-center p-4 pt-0">
                                <Timer secondsLeft={timeLeft} />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Button
                        onClick={() => setIsTimerVisible(true)}
                        variant="secondary"
                        size="icon"
                        className="fixed top-20 right-4 z-20 md:hidden rounded-full shadow-lg"
                    >
                        <Clock className="h-5 w-5" />
                        <span className="sr-only">Show Timer</span>
                    </Button>
                )}
             </>
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
                    visitedQuestions={visitedQuestions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={handleSelectQuestion}
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
                  <Timer secondsLeft={timeLeft} />
                </CardContent>
             </Card>
           )}
          <QuizNavPanel
            totalQuestions={questions.length}
            answers={answers}
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
