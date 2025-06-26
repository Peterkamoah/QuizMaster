"use client";

import { forwardRef } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import KatexRenderer from './KatexRenderer';
import { cn } from '@/lib/utils';

// This component renders the full quiz review content for PDF generation.
// It is defined outside the main component to prevent it from being recreated on every render.
export const FullReviewForPdf = forwardRef<
    HTMLDivElement,
    { questions: Question[]; answers: (number | null)[]; score: number }
>(({ questions, answers, score }, ref) => (
    <div ref={ref} className="bg-white text-black p-8" style={{ width: '1200px' }}>
        <h1 className="text-4xl font-bold text-center mb-4">Quiz Review</h1>
        <h2 className="text-2xl font-bold text-center mb-8">Final Score: {score}%</h2>
        {questions.map((question, index) => (
            <Card key={question.id} className="mb-6 break-inside-avoid border-gray-300">
                <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-2">
                        <span>{index + 1}.</span> <KatexRenderer content={question.question} />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                            const isThisUserAnswer = answers[index] === optionIndex;
                            const isThisCorrectAnswer = question.correctAnswerIndex === optionIndex;
                            return (
                                <div key={optionIndex} className={cn(
                                    "flex items-start space-x-3 p-3 rounded-md border text-left border-gray-300",
                                    isThisCorrectAnswer && 'bg-green-100 border-green-400',
                                    isThisUserAnswer && !isThisCorrectAnswer && 'bg-red-100 border-red-400'
                                )}>
                                    <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-1">
                                        {isThisCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                        {isThisUserAnswer && !isThisCorrectAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                                    </div>
                                    <KatexRenderer content={option} className="flex-1"/>
                                </div>
                            );
                        })}
                    </div>
                    {question.explanation && (
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <h4 className="font-semibold mb-2">Explanation</h4>
                            <div className="prose max-w-none text-sm">
                                <KatexRenderer content={question.explanation} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        ))}
    </div>
));
FullReviewForPdf.displayName = 'FullReviewForPdf';
