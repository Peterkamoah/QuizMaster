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
import { 
  QuizGenerationInputSchema, 
  QuizGenerationOutputSchema, 
  AiQuizGenerationOutputSchema,
  type QuizGenerationInput,
  type QuizGenerationOutput
} from '@/ai/types';

// Re-export types for client-side consumption
export type { QuizGenerationInput, QuizGenerationOutput };


export async function generateQuiz(input: QuizGenerationInput): Promise<QuizGenerationOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGenerationPrompt',
  input: { schema: QuizGenerationInputSchema },
  output: { schema: AiQuizGenerationOutputSchema }, // Prompt now uses the AI-specific schema
  prompt: `You are a meticulous and expert quiz creator specializing in factual accuracy. Your task is to generate EXACTLY {{{numQuestions}}} multiple-choice questions based on the provided context.
The difficulty of the questions must be '{{{difficulty}}}'.

For each question, follow these steps to ensure consistency and accuracy:
1.  **Formulate Question**: Create a clear question based on the context.
2.  **Solve and Explain**: Determine the single correct answer and write a detailed, step-by-step explanation that proves it. Package the correct answer text and its explanation together.
3.  **Create Distractors**: Generate three other plausible, but definitively incorrect, answer options. These are the distractors.
4.  **Formatting**: Use LaTeX delimiters ($...$ for inline, $$...$$ for block-level) for all mathematical notations.

Your output MUST be a valid JSON array matching the required schema. The structure you provide is critical for avoiding inconsistencies.

Context:
---
{{{context}}}
---
`,
  // Relax safety settings to prevent false positives on educational content
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
        },
    ]
  }
});


const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: QuizGenerationInputSchema,
    outputSchema: QuizGenerationOutputSchema, // The flow's final output matches the frontend schema
  },
  async (input) => {
    // Set a max number of questions to generate in a single API call to avoid model output limits.
    const CHUNK_SIZE = 10;
    const promises = [];
    let remainingQuestions = input.numQuestions;

    while (remainingQuestions > 0) {
      const questionsInChunk = Math.min(remainingQuestions, CHUNK_SIZE);
      const chunkInput = { ...input, numQuestions: questionsInChunk };
      promises.push(prompt(chunkInput));
      remainingQuestions -= questionsInChunk;
    }

    const results = await Promise.allSettled(promises);
    
    const allAiQuestions: z.infer<typeof AiQuizGenerationOutputSchema> = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.output) {
        allAiQuestions.push(...result.value.output);
      } else if (result.status === 'rejected') {
        console.error("A quiz generation chunk failed:", result.reason);
      }
    }

    if (allAiQuestions.length < input.numQuestions) {
      throw new Error(`The AI failed to generate all questions. It produced ${allAiQuestions.length} out of ${input.numQuestions} requested. Please try again.`);
    }

    // Transform the AI's consistent output into the format the frontend needs.
    const finalQuestions: QuizGenerationOutput = allAiQuestions.map((aiQuestion) => {
        const correctAnswerText = aiQuestion.correctAnswer.text;
        const options = [correctAnswerText, ...aiQuestion.distractors];

        // Shuffle the options array to randomize the position of the correct answer (Fisher-Yates shuffle)
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        const correctAnswerIndex = options.findIndex(opt => opt === correctAnswerText);

        // If for some reason the answer isn't found, default to 0 to prevent crashes
        if (correctAnswerIndex === -1) {
            console.error("Critical error: Correct answer text not found in options array after shuffle.", aiQuestion);
        }

        return {
            question: aiQuestion.question,
            options: options,
            answer: correctAnswerIndex === -1 ? 0 : correctAnswerIndex, // Return the index
            explanation: aiQuestion.correctAnswer.explanation,
        };
    });

    // Truncate the result to the exact number requested, in case any chunk over-produced.
    return finalQuestions.slice(0, input.numQuestions);
  }
);
