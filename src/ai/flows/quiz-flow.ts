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
  prompt: `You are an expert quiz creator. Based on the following context, generate a 10-question multiple-choice quiz with a '{{{difficulty}}}' difficulty level.

Each question must have exactly 4 options.
Each question must have a detailed explanation for the correct answer.
Ensure that any mathematical equations, formulas, or chemical notations are formatted using LaTeX delimiters. Use $...$ for inline math and $$...$$ for block-level math.

The response must be a valid JSON object containing an array of 10 question objects, strictly following the provided JSON schema.

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
    return output || [];
  }
);
