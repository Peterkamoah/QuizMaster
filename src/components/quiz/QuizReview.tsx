
"use client";

import { useState, useRef, forwardRef } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react';
import KatexRenderer from './KatexRenderer';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface QuizReviewProps {
    questions: Question[];
    answers: (number | null)[];
    score: number;
    onReturnHome: () => void;
}

// This component renders the full quiz review content for PDF generation.
// It is defined outside the main component to prevent it from being recreated on every render.
const FullReviewForPdf = forwardRef<
    HTMLDivElement,
    { questions: Question[]; answers: (number | null)[]; score: number }
>(({ questions, answers, score }, ref) => (
    <div ref={ref} className="bg-background p-8" style={{ width: '1200px' }}>
        <h1 className="text-4xl font-bold text-center mb-4">Quiz Review</h1>
        <h2 className="text-2xl font-bold text-center mb-8">Final Score: {score}%</h2>
        {questions.map((question, index) => (
            <Card key={question.id} className="mb-6 break-inside-avoid">
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
                                    "flex items-start space-x-3 p-3 rounded-md border text-left",
                                    isThisCorrectAnswer && 'bg-green-100 dark:bg-green-900/30 border-green-400',
                                    isThisUserAnswer && !isThisCorrectAnswer && 'bg-red-100 dark:bg-red-900/30 border-red-400'
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
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-2">Explanation</h4>
                            <div className="prose dark:prose-invert max-w-none text-sm">
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


export function QuizReview({ questions, answers, score, onReturnHome }: QuizReviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadContainerRef = useRef<HTMLDivElement>(null);
    const currentQuestion = questions[currentIndex];
    const userAnswer = answers[currentIndex];

    const handleDownloadPdf = async () => {
        const element = downloadContainerRef.current;
        if (!element) return;

        setIsDownloading(true);

        const canvas = await html2canvas(element, { scale: 2, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save(`quiz-review-score-${score}%.pdf`);
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
                                      {isThisCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                      {isThisUserAnswer && !isThisCorrectAnswer && <XCircle className="h-5 w-5 text-red-600" />}
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
