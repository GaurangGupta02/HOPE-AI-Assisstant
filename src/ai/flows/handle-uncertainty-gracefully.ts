'use server';

/**
 * @fileOverview Handles situations where the system is unsure of the user's intent.
 *
 * - handleUncertaintyGracefully - A function that handles uncertainty by acknowledging it, explaining what is known, and asking a clarifying question.
 * - HandleUncertaintyGracefullyInput - The input type for the handleUncertaintyGracefully function.
 * - HandleUncertaintyGracefullyOutput - The return type for the handleUncertaintyGracefully function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleUncertaintyGracefullyInputSchema = z.object({
  userInput: z.string().describe('The user input that may be ambiguous.'),
});
export type HandleUncertaintyGracefullyInput = z.infer<typeof HandleUncertaintyGracefullyInputSchema>;

const HandleUncertaintyGracefullyOutputSchema = z.object({
  response: z.string().describe('The system response acknowledging uncertainty and asking a clarifying question.'),
});
export type HandleUncertaintyGracefullyOutput = z.infer<typeof HandleUncertaintyGracefullyOutputSchema>;

export async function handleUncertaintyGracefully(input: HandleUncertaintyGracefullyInput): Promise<HandleUncertaintyGracefullyOutput> {
  return handleUncertaintyGracefullyFlow(input);
}

const handleUncertaintyGracefullyPrompt = ai.definePrompt({
  name: 'handleUncertaintyGracefullyPrompt',
  input: {schema: HandleUncertaintyGracefullyInputSchema},
  output: {schema: HandleUncertaintyGracefullyOutputSchema},
  prompt: `I am unsure about your request: "{{userInput}}". Based on what I understand, here's what I know: I need more information to proceed. Could you please clarify your intent?`,
});

const handleUncertaintyGracefullyFlow = ai.defineFlow(
  {
    name: 'handleUncertaintyGracefullyFlow',
    inputSchema: HandleUncertaintyGracefullyInputSchema,
    outputSchema: HandleUncertaintyGracefullyOutputSchema,
  },
  async input => {
    const {output} = await handleUncertaintyGracefullyPrompt(input);
    return output!;
  }
);
