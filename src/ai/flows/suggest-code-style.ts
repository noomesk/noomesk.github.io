'use server';

/**
 * @fileOverview A code style advisor AI agent.
 *
 * - suggestCodeStyle - A function that handles the code style suggestion process.
 * - SuggestCodeStyleInput - The input type for the suggestCodeStyle function.
 * - SuggestCodeStyleOutput - The return type for the suggestCodeStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCodeStyleInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet to be styled.'),
  designSystem: z.string().describe('The design system to follow (e.g., Material UI, Tailwind CSS).'),
});
export type SuggestCodeStyleInput = z.infer<typeof SuggestCodeStyleInputSchema>;

const SuggestCodeStyleOutputSchema = z.object({
  styledCodeSnippet: z.string().describe('The code snippet styled according to the chosen design system.'),
  explanation: z.string().describe('An explanation of the changes made and the reasoning behind them.'),
});
export type SuggestCodeStyleOutput = z.infer<typeof SuggestCodeStyleOutputSchema>;

export async function suggestCodeStyle(input: SuggestCodeStyleInput): Promise<SuggestCodeStyleOutput> {
  return suggestCodeStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCodeStylePrompt',
  input: {schema: SuggestCodeStyleInputSchema},
  output: {schema: SuggestCodeStyleOutputSchema},
  prompt: `You are a code style advisor specializing in formatting code according to design systems.

You will receive a code snippet and a design system to follow. You will then format the code snippet according to the design system and explain the changes you made and the reasoning behind them.

Code Snippet:
{{{codeSnippet}}}

Design System:
{{{designSystem}}}`, safetySettings: [
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
  ]
});

const suggestCodeStyleFlow = ai.defineFlow(
  {
    name: 'suggestCodeStyleFlow',
    inputSchema: SuggestCodeStyleInputSchema,
    outputSchema: SuggestCodeStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
