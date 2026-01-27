'use server';

/**
 * @fileOverview Classifies user requests and routes them to the appropriate module.
 *
 * - classifyAndRouteRequest - A function that classifies and routes user requests.
 * - ClassifyAndRouteInput - The input type for the classifyAndRouteRequest function.
 * - ClassifyAndRouteOutput - The return type for the classifyAndRouteRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyAndRouteInputSchema = z.object({
  request: z.string().describe('The user request to classify and route.'),
});
export type ClassifyAndRouteInput = z.infer<typeof ClassifyAndRouteInputSchema>;

const ClassifyAndRouteOutputSchema = z.object({
  requestType: z
    .enum(['question', 'command', 'emotional_support'])
    .describe('The type of the user request.'),
  route: z.string().describe('The module to route the request to.'),
});
export type ClassifyAndRouteOutput = z.infer<typeof ClassifyAndRouteOutputSchema>;

export async function classifyAndRouteRequest(input: ClassifyAndRouteInput): Promise<ClassifyAndRouteOutput> {
  return classifyAndRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyAndRoutePrompt',
  input: {schema: ClassifyAndRouteInputSchema},
  output: {schema: ClassifyAndRouteOutputSchema},
  prompt: `You are HOPE, an AI assistant. Classify the user's request into one of the following types: question, command, or emotional_support. Based on the request type, determine the appropriate module to route the request to. Possible routes are 'knowledge', 'action', and 'empathy'.

Request: {{{request}}}

{
  "requestType": "<question|command|emotional_support>",
  "route": "<knowledge|action|empathy>"
}
`,
});

const classifyAndRouteFlow = ai.defineFlow(
  {
    name: 'classifyAndRouteFlow',
    inputSchema: ClassifyAndRouteInputSchema,
    outputSchema: ClassifyAndRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

