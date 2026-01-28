'use client';

import { useState, useTransition, useRef } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { getAIResponse } from '@/app/actions';
import { ChatMessages } from './chat-messages';
import { Icons } from '@/components/icons';
import type { Message } from '@/lib/types';

/**
 * Renders the chat messages and the input form.
 */
function ChatInterface({
  messages,
  isPending,
  textareaValue,
  onTextareaChange,
}: {
  messages: Message[];
  isPending: boolean;
  textareaValue: string;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {

  return (
    <>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {messages.length === 0 && !isPending ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icons name="hope" className="h-12 w-12" />
            </div>
            <h2 className="font-headline text-2xl font-semibold">
              Human-Oriented Processing Entity
            </h2>
            <p className="max-w-md text-muted-foreground">
              I am a persistent, cross-platform personal AI system designed to
              assist you in thinking, creating, and learning.
            </p>
          </div>
        ) : (
          <ChatMessages
            messages={messages}
            isPending={isPending}
          />
        )}
      </main>
      <footer className="border-t bg-card/50 p-4 md:p-6">
        <div className="relative">
          <Textarea
            name="message"
            placeholder="Ask HOPE anything..."
            rows={1}
            className="min-h-[4rem] resize-none rounded-xl border-2 bg-card p-4 pr-16 shadow-sm"
            disabled={isPending}
            value={textareaValue}
            onChange={onTextareaChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isPending) {
                if ((e.target as HTMLTextAreaElement).value.trim()) {
                  e.preventDefault();
                  e.currentTarget.closest('form')?.requestSubmit();
                }
              }
            }}
          />
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <Button
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={isPending || !textareaValue.trim()}
              aria-label="Send message"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}

export function ChatPanel({
  useShortTermMemory,
  useLongTermMemory,
}: {
  useShortTermMemory: boolean;
  useLongTermMemory: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [textareaValue, setTextareaValue] = useState('');
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userInput = textareaValue;

    if (!userInput?.trim() || isPending) {
      return;
    }

    formData.set('message', userInput);
    formData.set('useShortTermMemory', String(useShortTermMemory));
    formData.set('useLongTermMemory', String(useLongTermMemory));


    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setTextareaValue('');

    startTransition(async () => {
      const recentMessages = useShortTermMemory
        ? newMessages.slice(-7)
        : [userMessage];

      const conversationHistory = recentMessages.map(
        ({ id, role, content }) => ({
          id,
          role,
          content,
        })
      );

      // Pass conversation history as a JSON string in FormData
      formData.set('conversationHistory', JSON.stringify(conversationHistory));

      // Call the server action with only the FormData object
      const assistantMessage = await getAIResponse(formData);
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    });
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(e.target.value);
  };
  
  return (
    <SidebarInset>
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2">
          <h1 className="font-headline text-xl font-semibold">
            HOPE Assistant
          </h1>
        </div>
      </header>
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="flex h-[calc(100svh-4rem)] flex-col"
      >
        <ChatInterface
          messages={messages}
          isPending={isPending}
          textareaValue={textareaValue}
          onTextareaChange={handleTextareaChange}
        />
      </form>
    </SidebarInset>
  );
}
