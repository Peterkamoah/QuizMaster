"use client";

import { useState, useRef } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Download, Loader2 } from 'lucide-react';
import KatexRenderer from './KatexRenderer';
import { cn } from '@/lib/utils';
import { FullReviewForPdf } from './FullReviewForPdf';


interface QuizReviewProps {
    questions: Question[];
    answers: (number | null)[];
    score: number;
    onReturnHome: () => void;
    onReturnToSummary: () => void;
}

export function QuizReview({ questions, answers, score, onReturnHome, onReturnToSummary }: QuizReviewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadContainerRef = useRef<HTMLDivElement>(null);
    const currentQuestion = questions[currentIndex];
    const userAnswer = answers[currentIndex];

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        const printElement = downloadContainerRef.current;
    
        if (!printElement) {
            alert("Could not find content to download.");
            setIsDownloading(false);
            return;
        }
    
        try {
            const { default: jsPDF } = await import('jspdf');
            const { default: html2canvas } = await import('html2canvas');
    
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            iframe.style.visibility = 'hidden';
    
            document.body.appendChild(iframe);
    
            const iframeDoc = iframe.contentWindow!.document;
    
            const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
            styleSheets.forEach(sheet => {
                iframeDoc.head.appendChild(sheet.cloneNode(true));
            });
    
            const clonedContent = printElement.cloneNode(true) as HTMLElement;
            iframeDoc.body.appendChild(clonedContent);
    
            await new Promise(resolve => setTimeout(resolve, 200));
    
            const canvas = await html2canvas(iframeDoc.body, {
                scale: 1,
                useCORS: true,
                windowWidth: iframeDoc.documentElement.scrollWidth,
                windowHeight: iframeDoc.documentElement.scrollHeight,
            });
    
            document.body.removeChild(iframe);
    
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 0;
    
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
    
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }
            
            pdf.save(`quiz-review-score.pdf`);
    
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to download PDF. Please try again.");
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                if (iframe.style.visibility === 'hidden') {
                    document.body.removeChild(iframe);
                }
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="shadow-md sticky top-4 z-10">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Question Review</CardTitle>
                    <div className="text-lg font-bold text-primary">Score: {score}%</div>
                </CardHeader>
                <CardContent className="flex items-center justify-between flex-wrap gap-2">
                     <Button variant="outline" onClick={onReturnToSummary}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Summary
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
                        Download Review
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
                                    isThisCorrectAnswer && 'bg-success/20 border-success',
                                    isThisUserAnswer && !isThisCorrectAnswer && 'bg-destructive/20 border-destructive'
                                )}>
                                    <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-1">
                                      {isThisCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-success" />}
                                      {isThisUserAnswer && !isThisCorrectAnswer && <XCircle className="h-5 w-5 text-destructive" />}
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
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    
                    {currentIndex === questions.length - 1 ? (
                        <Button onClick={onReturnHome} size="lg">Finish & Go Home</Button>
                    ) : (
                         <Button onClick={() => setCurrentIndex(i => i + 1)}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
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
