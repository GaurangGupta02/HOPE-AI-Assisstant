'use server';

/**
 * @fileOverview This file defines a Genkit flow that generates a list of ideas from a given prompt or topic.
 *
 * - generateIdeasFromPrompt - An async function that takes a prompt and returns a list of ideas.
 * - GenerateIdeasFromPromptInput - The input type for the generateIdeasFromPrompt function.
 * - GenerateIdeasFromPromptOutput - The output type for the generateIdeasFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIdeasFromPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt or topic to generate ideas from.'),
});
export type GenerateIdeasFromPromptInput = z.infer<typeof GenerateIdeasFromPromptInputSchema>;

const GenerateIdeasFromPromptOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of ideas generated from the prompt.'),
});
export type GenerateIdeasFromPromptOutput = z.infer<typeof GenerateIdeasFromPromptOutputSchema>;

export async function generateIdeasFromPrompt(input: GenerateIdeasFromPromptInput): Promise<GenerateIdeasFromPromptOutput> {
  return generateIdeasFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateIdeasFromPromptPrompt',
  input: {schema: GenerateIdeasFromPromptInputSchema},
  output: {schema: GenerateIdeasFromPromptOutputSchema},
  prompt: `You are an expert brainstorming assistant. Generate a list of creative and relevant ideas based on the following prompt:\n\nPrompt: {{{prompt}}}\n\nIdeas:`,
});

const generateIdeasFromPromptFlow = ai.defineFlow(
  {
    name: 'generateIdeasFromPromptFlow',
    inputSchema: GenerateIdeasFromPromptInputSchema,
    outputSchema: GenerateIdeasFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
