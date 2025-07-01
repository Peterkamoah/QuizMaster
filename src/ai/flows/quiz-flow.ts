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

Your response MUST be a valid JSON object that is an array containing exactly {{{numQuestions}}} question objects. Do not generate more or fewer questions than requested.

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
    
    if (!output) {
      return [];
    }
    
    // Ensure the number of questions matches the request.
    // If the model generates more, truncate the list.
    if (output.length > input.numQuestions) {
      return output.slice(0, input.numQuestions);
    }
    
    // If the model generates fewer, we return what we have,
    // which is better than returning nothing.
    return output;
  }
);
