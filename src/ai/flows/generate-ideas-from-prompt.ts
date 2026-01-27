'use server';

/**
 * @fileOverview This file defines a Genkit flow that generates a response from a given prompt and tone.
 *
 * - generateIdeasFromPrompt - An async function that takes a prompt and tone and returns a response.
 * - GenerateIdeasFromPromptInput - The input type for the generateIdeasFromPrompt function.
 * - GenerateIdeasFromPromptOutput - The output type for the generateIdeasFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIdeasFromPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt or topic to generate ideas from.'),
  tone: z.string().describe('The desired tone for the response.'),
});
export type GenerateIdeasFromPromptInput = z.infer<typeof GenerateIdeasFromPromptInputSchema>;

const GenerateIdeasFromPromptOutputSchema = z.object({
  response: z.string().describe('The generated response.'),
});
export type GenerateIdeasFromPromptOutput = z.infer<typeof GenerateIdeasFromPromptOutputSchema>;

export async function generateIdeasFromPrompt(input: GenerateIdeasFromPromptInput): Promise<GenerateIdeasFromPromptOutput> {
  return generateIdeasFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIdeasFromPromptPrompt',
  input: {schema: GenerateIdeasFromPromptInputSchema},
  output: {schema: GenerateIdeasFromPromptOutputSchema},
  prompt: `{{{prompt}}}\n\n---\nRespond in a {{{tone}}} tone.`,
});

const generateIdeasFromPromptFlow = ai.defineFlow(
  {
    name: 'generateIdeasFromPromptFlow',
    inputSchema: GenerateIdeasFromPromptInputSchema,
    outputSchema: GenerateIdeasFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { response: '' };
  }
);
