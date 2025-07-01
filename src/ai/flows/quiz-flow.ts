'use server';
/**
 * @fileOverview A flow for generating a quiz from a given text context.
 *
 * - generateQuiz - A function that creates a quiz.
 * - QuizGenerationInput - The input type for the generateQuiz function.
 * - QuizGenerationOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuizGenerationInputSchema = z.object({
  context: z.string().describe('The text content to generate the quiz from.'),
  difficulty: z.string().describe('The difficulty level for the quiz questions. e.g., Easy, Medium, Hard.'),
  numQuestions: z.number().min(1).max(50).describe('The number of questions to generate.'),
});
export type QuizGenerationInput = z.infer<typeof QuizGenerationInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The question text. Should use LaTeX for math.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers. Should use LaTeX for math.'),
  answer: z.number().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().describe('A detailed explanation for why the correct answer is correct. Should use LaTeX for math if necessary.'),
});

const QuizGenerationOutputSchema = z.array(QuizQuestionSchema);
export type QuizGenerationOutput = z.infer<typeof QuizGenerationOutputSchema>;

export async function generateQuiz(input: QuizGenerationInput): Promise<QuizGenerationOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGenerationPrompt',
  input: { schema: QuizGenerationInputSchema },
  output: { schema: QuizGenerationOutputSchema },
  prompt: `You are an expert quiz creator. Your task is to generate EXACTLY {{{numQuestions}}} multiple-choice questions based on the provided context.
The difficulty of the questions must be '{{{difficulty}}}'.

It is absolutely critical that you generate the precise number of questions requested. Your response MUST be a valid JSON object that is an array containing exactly {{{numQuestions}}} question objects. Do not generate more or fewer questions than requested. Failure to comply will result in an error.

Each question must have:
1.  Exactly 4 multiple-choice options.
2.  A detailed explanation for why the correct answer is correct.
3.  Mathematical equations, formulas, or chemical notations formatted using LaTeX delimiters ($...$ for inline, $$...$$ for block-level).

Context:
---
{{{context}}}
---
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: QuizGenerationInputSchema,
    outputSchema: QuizGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    // First attempt check
    if (output && output.length === input.numQuestions) {
      return output;
    }

    // If first attempt fails, log it and retry once.
    console.warn(`AI failed to generate exact number of questions on first try. Expected ${input.numQuestions}, got ${output?.length || 0}. Retrying...`);
    
    const { output: secondOutput } = await prompt(input);

    if (secondOutput && secondOutput.length === input.numQuestions) {
      return secondOutput;
    }

    // If both attempts fail, throw a specific error to be handled by the client.
    const generatedCount = secondOutput?.length || output?.length || 0;
    throw new Error(`The AI failed to generate exactly ${input.numQuestions} questions, generating ${generatedCount} instead. Please try reducing the number of questions or modifying the source text.`);
  }
);
