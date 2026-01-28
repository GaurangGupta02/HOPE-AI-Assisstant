export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audio?: string;
};
