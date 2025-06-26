"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, FileUp, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import type { QuizGenerationInput } from '@/ai/flows/quiz-flow';
import { extractTextFromPdf } from '@/lib/pdf';

interface QuizSetupProps {
    onStartQuiz: (input: QuizGenerationInput, timerMinutes: number) => void;
    onStartSampleQuiz: () => void;
    onLoadingChange: (isLoading: boolean) => void;
}

export function QuizSetup({ onStartQuiz, onStartSampleQuiz, onLoadingChange }: QuizSetupProps) {
    const [text, setText] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
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
        onLoadingChange(true);
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
            onLoadingChange(false);
        }
    };

    return (
        <>
            <Card className="mb-8 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings /> Quiz Options</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="num-questions">Number of Questions</Label>
                        <Input
                            id="num-questions"
                            type="number"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, Number(e.target.value))))}
                            min="1"
                            max="20"
                            placeholder="e.g., 10"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="timer-minutes" className={!isTimerEnabled ? "text-muted-foreground" : ""}>Timer (minutes)</Label>
                            <Switch
                                id="timer-enabled"
                                checked={isTimerEnabled}
                                onCheckedChange={setIsTimerEnabled}
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
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> From Text</CardTitle>
                        <CardDescription>Paste your content below.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste your notes, article, or any text here..."
                            className="h-48 resize-none"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleGenerateFromText}>Generate Quiz</Button>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileUp /> From PDF</CardTitle>
                        <CardDescription>Upload a PDF document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pdf-upload">PDF File</Label>
                            <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                        </div>
                        {pdfFile && <p className="text-sm text-muted-foreground">Selected: {pdfFile.name}</p>}
                        <Button className="w-full" onClick={handleGenerateFromPdf} disabled={!pdfFile}>Generate Quiz from PDF</Button>
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-8" />
            <div className="text-center">
                <p className="text-muted-foreground mb-4">Or try our sample quiz:</p>
                <Button variant="secondary" onClick={onStartSampleQuiz}>Try Sample Quiz</Button>
            </div>
        </>
    );
}
