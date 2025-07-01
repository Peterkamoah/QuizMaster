"use client";

import { forwardRef } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import KatexRenderer from './KatexRenderer';
import { cn } from '@/lib/utils';

// This component renders the full quiz review content for PDF generation.
// It uses explicit, non-themed colors for a consistent print output.
export const FullReviewForPdf = forwardRef<
    HTMLDivElement,
    { questions: Question[]; answers: (number | null)[]; score: number }
>(({ questions, answers, score }, ref) => (
    <div ref={ref} className="bg-white text-black p-8" style={{ width: '900px' }}>
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
                                    isThisCorrectAnswer && 'bg-emerald-50 border-emerald-300',
                                    isThisUserAnswer && !isThisCorrectAnswer && 'bg-red-50 border-red-300'
                                )}>
                                    <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-1">
                                        {isThisCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-emerald-700" />}
                                        {isThisUserAnswer && !isThisCorrectAnswer && <XCircle className="h-5 w-5 text-red-700" />}
                                    </div>
                                    <KatexRenderer content={option} className="flex-1"/>
                                </div>
                            );
                        })}
                    </div>
                    {question.explanation && (
                        <div className="p-4 bg-slate-100 rounded-lg">
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
