export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type Tone = 'Technical' | 'Casual' | 'Emotional';
