'use server';

/**
 * @fileOverview A flow to improve the clarity and conciseness of a given text.
 *
 * - improveTextClarity - A function that takes a text input and returns suggestions for improved clarity and conciseness.
 * - ImproveTextClarityInput - The input type for the improveTextClarity function.
 * - ImproveTextClarityOutput - The return type for the improveTextClarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTextClarityInputSchema = z.object({
  text: z.string().describe('The text to be improved for clarity and conciseness.'),
});
export type ImproveTextClarityInput = z.infer<typeof ImproveTextClarityInputSchema>;

const ImproveTextClarityOutputSchema = z.object({
  improvedText: z.string().describe('The text improved for clarity and conciseness.'),
  explanation: z.string().describe('An explanation of the changes made and why they improve clarity.'),
});
export type ImproveTextClarityOutput = z.infer<typeof ImproveTextClarityOutputSchema>;

export async function improveTextClarity(input: ImproveTextClarityInput): Promise<ImproveTextClarityOutput> {
  return improveTextClarityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveTextClarityPrompt',
  input: {schema: ImproveTextClarityInputSchema},
  output: {schema: ImproveTextClarityOutputSchema},
  prompt: `You are an expert writing assistant. Your task is to improve the clarity and conciseness of the given text. Provide the improved text, and an explanation of the changes you made and why they improve clarity.\n\nText: {{{text}}}`,
});

const improveTextClarityFlow = ai.defineFlow(
  {
    name: 'improveTextClarityFlow',
    inputSchema: ImproveTextClarityInputSchema,
    outputSchema: ImproveTextClarityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
