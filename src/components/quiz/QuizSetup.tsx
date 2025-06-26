"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, FileUp, Loader2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import type { QuizGenerationInput } from '@/ai/flows/quiz-flow';
import { extractTextFromPdf } from '@/lib/pdf';

interface QuizSetupProps {
    onStartQuiz: (input: QuizGenerationInput, timerMinutes: number) => void;
    onStartSampleQuiz: () => void;
}

export function QuizSetup({ onStartQuiz, onStartSampleQuiz }: QuizSetupProps) {
    const [text, setText] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const { toast } = useToast();
  
    const [difficulty, setDifficulty] = useState('Medium');
    const [numQuestions, setNumQuestions] = useState(10);
    const [timerDuration, setTimerDuration] = useState(10);
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPdfFile(file);
        }
    };
    
    const generateQuizFromContext = (context: string) => {
        if (!context.trim()) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please provide some text or a document to generate a quiz.',
          });
          return;
        }
        const timerMinutes = isTimerEnabled ? timerDuration : 0;
        onStartQuiz({ context, difficulty, numQuestions }, timerMinutes);
    };

    const handleGenerateFromText = () => {
        generateQuizFromContext(text);
    };
  
    const handleGenerateFromPdf = async () => {
        if (!pdfFile) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a PDF file first.',
            });
            return;
        }
        setIsProcessingPdf(true);
        try {
            const extractedText = await extractTextFromPdf(pdfFile);
            generateQuizFromContext(extractedText);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
              variant: "destructive",
              title: "PDF Processing Failed",
              description: errorMessage
            });
        } finally {
            setIsProcessingPdf(false);
        }
    };

    return (
        <>
            <Card className="mb-8 shadow-lg bg-white dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200"><Settings /> Quiz Options</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="difficulty" className="text-slate-600 dark:text-slate-400">Difficulty Level</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger id="difficulty" className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-blue-500 dark:focus:border-transparent">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="num-questions" className="text-slate-600 dark:text-slate-400">Number of Questions</Label>
                        <Input
                            id="num-questions"
                            type="number"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, Number(e.target.value))))}
                            min="1"
                            max="20"
                            placeholder="e.g., 10"
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="timer-minutes" className={!isTimerEnabled ? "text-muted-foreground" : "text-slate-600 dark:text-slate-400"}>Timer (minutes)</Label>
                            <Switch
                                id="timer-enabled"
                                checked={isTimerEnabled}
                                onCheckedChange={setIsTimerEnabled}
                                className="data-[state=checked]:bg-blue-600 dark:data-[state=unchecked]:bg-slate-600"
                            />
                        </div>
                        <Input
                            id="timer-minutes"
                            type="number"
                            value={timerDuration}
                            onChange={(e) => setTimerDuration(Math.max(1, Number(e.target.value)))}
                            disabled={!isTimerEnabled}
                            min="1"
                            placeholder="e.g., 10"
                            className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-transparent"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-lg bg-white dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200"><FileText /> From Text</CardTitle>
                        <CardDescription className="dark:text-slate-400">Paste your content below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste your notes, article, or any text here..."
                            className="h-48 resize-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-2 dark:focus:ring-blue-500 dark:focus:border-transparent"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleGenerateFromText}>Generate Quiz</Button>
                    </CardContent>
                </Card>

                <Card className="shadow-lg bg-white dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200"><FileUp /> From PDF</CardTitle>
                        <CardDescription className="dark:text-slate-400">Upload a PDF document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pdf-upload" className="text-slate-600 dark:text-slate-400">PDF File</Label>
                            <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 file:text-slate-400"/>
                        </div>
                        {pdfFile && <p className="text-sm text-muted-foreground dark:text-slate-400">Selected: {pdfFile.name}</p>}
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleGenerateFromPdf} disabled={!pdfFile || isProcessingPdf}>
                            {isProcessingPdf ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing PDF...
                                </>
                            ) : (
                                'Generate Quiz from PDF'
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-8" />
            <div className="text-center">
                <p className="text-muted-foreground dark:text-slate-400 mb-4">Or try our sample quiz:</p>
                <Button variant="secondary" onClick={onStartSampleQuiz} className="dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">Try Sample Quiz</Button>
            </div>
        </>
    );
}
