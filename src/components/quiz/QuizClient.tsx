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

interface QuizClientProps {
  questions: Question[];
  timerDuration: number; // in minutes, 0 for no timer
  onReturnHome: () => void;
}

export function QuizClient({ questions, timerDuration, onReturnHome }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  
  // This state holds the selected answer for the *current* question only.
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);

  // This effect runs every time the question changes
  // It resets the selected answer for the new question based on the stored answers array.
  useEffect(() => {
    setSelectedAnswer(answers[currentQuestionIndex]);
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    // Mark the initial question as visited
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
    setSelectedAnswer(optionIndex); // Update UI immediately for current question
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers); // Save answer permanently
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                <div className="text-sm text-muted-foreground">{answeredCount} of {questions.length} Answered</div>
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
        </div>
        <div className="lg:col-span-1 space-y-6">
           {timerDuration > 0 && (
             <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-center text-lg">Time Remaining</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Timer durationInMinutes={timerDuration} onTimeUp={handleTimeUp} />
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
