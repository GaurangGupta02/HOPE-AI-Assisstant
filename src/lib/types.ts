export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
};

export type Tone = 'Technical' | 'Casual' | 'Emotional';

export type Voice = 'female';
