"use client";

import { useState, useRef, forwardRef } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react';
import KatexRenderer from './KatexRenderer';
import { cn } from '@/lib/utils';
import { downloadQuizReviewAsPdf } from '@/lib/pdf-export';
import { FullReviewForPdf } from './FullReviewForPdf';


interface QuizReviewProps {
    questions: Question[];
    answers: (number | null)[];
    score: number;
    onReturnHome: () => void;
}

export function QuizReview({ questions, answers, score, onReturnHome }: QuizReviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadContainerRef = useRef<HTMLDivElement>(null);
    const currentQuestion = questions[currentIndex];
    const userAnswer = answers[currentIndex];

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        const success = await downloadQuizReviewAsPdf(downloadContainerRef.current);
        if (!success) {
            alert("Failed to download PDF. Please try again.");
        }
        setIsDownloading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="shadow-md">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Question Review</CardTitle>
                    <div className="text-lg font-bold text-primary">Score: {score}%</div>
                </CardHeader>
                <CardContent className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}>
                            <ArrowLeft /> Previous
                        </Button>
                        <Button variant="outline" onClick={() => setCurrentIndex(i => i + 1)} disabled={currentIndex === questions.length - 1}>
                            Next <ArrowRight />
                        </Button>
                    </div>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
                        Download as PDF
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl flex items-start gap-2">
                       <span>{currentIndex + 1}.</span> <KatexRenderer content={currentQuestion.question} />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {currentQuestion.options.map((option, index) => {
                            const isThisUserAnswer = userAnswer === index;
                            const isThisCorrectAnswer = currentQuestion.correctAnswerIndex === index;
                            return (
                               <div key={index} className={cn(
                                    "flex items-start space-x-3 p-3 rounded-md border",
                                    isThisCorrectAnswer && 'bg-green-100 dark:bg-green-900/30 border-green-400',
                                    isThisUserAnswer && !isThisCorrectAnswer && 'bg-red-100 dark:bg-red-900/30 border-red-400'
                                )}>
                                    <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-1">
                                      {isThisCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />}
                                      {isThisUserAnswer && !isThisCorrectAnswer && <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />}
                                    </div>
                                    <KatexRenderer content={option} className="flex-1"/>
                               </div>
                            );
                        })}
                    </div>
                    {currentQuestion.explanation && (
                        <Accordion type="single" collapsible className="w-full" defaultValue="explanation">
                            <AccordionItem value="explanation">
                                <AccordionTrigger>View Explanation</AccordionTrigger>
                                <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <KatexRenderer content={currentQuestion.explanation} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}
                </CardContent>
                <CardFooter>
                    {currentIndex === questions.length - 1 && (
                        <Button onClick={onReturnHome} className="w-full" size="lg">Finish Review & Return Home</Button>
                    )}
                </CardFooter>
            </Card>
            
            <div className="absolute -left-[9999px] top-0 opacity-0" aria-hidden="true">
                <FullReviewForPdf
                    ref={downloadContainerRef}
                    questions={questions}
                    answers={answers}
                    score={score}
                />
            </div>
        </div>
    )
}
