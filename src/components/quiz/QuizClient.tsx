"use client";

import { useState, useCallback } from 'react';
import type { Question } from '@/lib/types';
import { QuestionDisplay } from './QuestionDisplay';
import { QuizNavPanel } from './QuizNavPanel';
import { ResultsDisplay } from './ResultsDisplay';
import { SubmissionModal } from './SubmissionModal';
import { Timer } from './Timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizClientProps {
  questions: Question[];
  timerDuration: number; // in minutes, 0 for no timer
}

export function QuizClient({ questions, timerDuration }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>(() => Array(questions.length).fill(false));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);

  const handleSubmit = useCallback(() => {
    setTimeTaken(Date.now() - startTime);
    setIsSubmitted(true);
    setShowSubmissionModal(false);
  }, [startTime]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  const handleAnswerChange = (optionIndex: number) => {
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSubmissionModal(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const answeredCount = answers.filter(a => a !== null).length;

  if (isSubmitted) {
    return <ResultsDisplay questions={questions} answers={answers} timeTaken={timeTaken} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionDisplay
                question={questions[currentQuestionIndex]}
                selectedAnswer={answers[currentQuestionIndex]}
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
