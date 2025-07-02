/**
 * @fileOverview Defines the data structures (schemas and types) for AI-powered quiz generation.
 */
import { z } from 'zod';

// Schema for the input required to generate a quiz.
export const QuizGenerationInputSchema = z.object({
  context: z.string().describe('The text content to generate the quiz from.'),
  difficulty: z.string().describe('The difficulty level for the quiz questions. e.g., Easy, Medium, Hard.'),
  numQuestions: z.number().min(1).max(50).describe('The number of questions to generate.'),
});
export type QuizGenerationInput = z.infer<typeof QuizGenerationInputSchema>;


// This is the schema for the final quiz question output that the frontend expects.
const FrontendQuizQuestionSchema = z.object({
  question: z.string().describe('The question text. Should use LaTeX for math.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers. Should use LaTeX for math.'),
  answer: z.number().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().describe('A detailed explanation for why the correct answer is correct. Should use LaTeX for math if necessary.'),
});
export const QuizGenerationOutputSchema = z.array(FrontendQuizQuestionSchema);
export type QuizGenerationOutput = z.infer<typeof QuizGenerationOutputSchema>;


// This is the schema we ask the AI to generate internally.
// It forces consistency by tying the correct answer text directly to its explanation.
export const AiQuizQuestionSchema = z.object({
    question: z.string().describe("The question text. Should use LaTeX for math."),
    correctAnswer: z.object({
      text: z.string().describe("The full text of the correct answer."),
      explanation: z.string().describe("A detailed, step-by-step explanation for why this answer is correct. It must logically prove the answer's correctness. Start from the problem and show all work.")
    }),
    distractors: z.array(z.string()).length(3).describe("An array of exactly 3 plausible but incorrect answer options (distractors).")
});
export const AiQuizGenerationOutputSchema = z.array(AiQuizQuestionSchema);
