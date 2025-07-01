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
    // Set a max number of questions to generate in a single API call to avoid model output limits.
    const CHUNK_SIZE = 25;
    const promises = [];
    let remainingQuestions = input.numQuestions;

    while (remainingQuestions > 0) {
      const questionsInChunk = Math.min(remainingQuestions, CHUNK_SIZE);
      const chunkInput = { ...input, numQuestions: questionsInChunk };
      promises.push(prompt(chunkInput));
      remainingQuestions -= questionsInChunk;
    }

    // Use Promise.allSettled to handle potential failures in individual chunks.
    const results = await Promise.allSettled(promises);
    
    const allQuestions = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.output) {
        // Add questions from successful chunks.
        allQuestions.push(...result.value.output);
      } else if (result.status === 'rejected') {
        // Log errors from failed chunks but don't stop the entire process.
        console.error("A quiz generation chunk failed:", result.reason);
      }
    }

    // If, after all chunks, we still don't have enough questions, it's an unrecoverable error.
    if (allQuestions.length < input.numQuestions) {
      throw new Error(`The AI failed to generate all questions. It produced ${allQuestions.length} out of ${input.numQuestions} requested. Please try again.`);
    }

    // Truncate the result to the exact number requested, in case any chunk over-produced.
    return allQuestions.slice(0, input.numQuestions);
  }
);
