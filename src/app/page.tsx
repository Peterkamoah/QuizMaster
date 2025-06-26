"use client";

import { useState } from 'react';
import { QuizClient } from '@/components/quiz/QuizClient';
import { quizQuestions as sampleQuiz } from '@/lib/quiz-data';
import type { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, FileUp, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, type QuizGenerationOutput } from '@/ai/flows/quiz-flow';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/theme-toggle';

type Status = 'idle' | 'loading' | 'active';

declare const pdfjsLib: any;

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [text, setText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
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
  
  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) {
          return reject(new Error("Failed to read file."));
        }
        try {
          const pdf = await pdfjsLib.getDocument(event.target.result).promise;
          let content = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            content += textContent.items.map((item: any) => item.str).join(' ');
          }
          resolve(content);
        } catch (error) {
          console.error("PDF processing error:", error);
          reject(new Error("Could not process PDF file. It might be corrupted or protected."));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file."));
      reader.readAsArrayBuffer(file);
    });
  };

  const createQuiz = async (context: string) => {
    if (!context.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide some text or a document to generate a quiz.',
      });
      return;
    }
    
    setStatus('loading');
    try {
      const result: QuizGenerationOutput = await generateQuiz({ context, difficulty, numQuestions });
      if (!result || result.length === 0) {
        throw new Error("The AI failed to generate questions.");
      }
      const formattedQuestions: Question[] = result.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.answer,
        explanation: q.explanation,
      }));
      setQuizQuestions(formattedQuestions);
      setStatus('active');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Quiz Generation Failed",
        description: `Sorry, we couldn't generate a quiz. ${errorMessage}`
      });
      setStatus('idle');
    }
  };

  const handleGenerateFromText = () => {
    createQuiz(text);
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
    setStatus('loading');
    try {
        const extractedText = await extractTextFromPdf(pdfFile);
        await createQuiz(extractedText);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
          variant: "destructive",
          title: "PDF Processing Failed",
          description: errorMessage
        });
        setStatus('idle');
    }
  };

  const handleStartSampleQuiz = () => {
    setQuizQuestions(sampleQuiz);
    setStatus('active');
  };

  const handleReturnHome = () => {
    setStatus('idle');
    setQuizQuestions([]);
  };

  if (status === 'active') {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-headline font-bold text-primary">QuizMaster</h1>
             <ThemeToggle />
          </header>
          <QuizClient 
            questions={quizQuestions} 
            timerDuration={isTimerEnabled ? timerDuration : 0}
            onReturnHome={handleReturnHome}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div />
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold text-primary">QuizMaster</h1>
                <p className="text-muted-foreground mt-2">Generate a custom quiz from your study materials.</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {status === 'loading' ? (
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold text-muted-foreground">Brewing your questions...</p>
          </div>
        ) : (
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
          </>
        )}
        
        <Separator className="my-8" />
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Or try our sample quiz:</p>
          <Button variant="secondary" onClick={handleStartSampleQuiz}>Try Sample Web Dev Quiz</Button>
        </div>
      </div>
    </main>
  );
}