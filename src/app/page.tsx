import { QuizClient } from '@/components/quiz/QuizClient';
import { quizQuestions } from '@/lib/quiz-data';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-headline font-bold text-primary">QuizMaster</h1>
          <p className="text-muted-foreground mt-2">A modern online examination portal</p>
        </header>
        <QuizClient questions={quizQuestions} />
      </div>
    </main>
  );
}
