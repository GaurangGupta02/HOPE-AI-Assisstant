'use client';

import { useState, useTransition, useRef } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { getAIResponse } from '@/app/actions';
import { ChatMessages } from './chat-messages';
import { Icons } from '@/components/icons';
import type { Message, Tone, UserGender } from '@/lib/types';

/**
 * Renders the chat messages and the input form.
 */
function ChatInterface({
  messages,
  tone,
  userGender,
  useShortTermMemory,
  useLongTermMemory,
  isPending,
  isCooldown,
}: {
  messages: Message[];
  tone: Tone;
  userGender: UserGender;
  useShortTermMemory: boolean;
  useLongTermMemory: boolean;
  isPending: boolean;
  isCooldown: boolean;
}) {
  const pending = isPending;

  return (
    <>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {messages.length === 0 && !pending ? (
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
          <ChatMessages messages={messages} isPending={pending} />
        )}
      </main>
      <footer className="border-t bg-card/50 p-4 md:p-6">
        <div className="relative">
          <Textarea
            name="message"
            placeholder="Ask HOPE anything..."
            rows={1}
            className="min-h-[4rem] resize-none rounded-xl border-2 bg-card p-4 pr-20 shadow-sm"
            disabled={pending || isCooldown}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !(pending || isCooldown)) {
                if ((e.target as HTMLTextAreaElement).value.trim()) {
                  e.preventDefault();
                  e.currentTarget.closest('form')?.requestSubmit();
                }
              }
            }}
          />
          <input type="hidden" name="userGender" value={userGender} />
          <input type="hidden" name="tone" value={tone} />
          <input
            type="hidden"
            name="useShortTermMemory"
            value={String(useShortTermMemory)}
          />
          <input
            type="hidden"
            name="useLongTermMemory"
            value={String(useLongTermMemory)}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
            disabled={pending || isCooldown}
            aria-label="Send message"
          >
            {pending ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </footer>
    </>
  );
}

export function ChatPanel({
  tone,
  userGender,
  useShortTermMemory,
  useLongTermMemory,
}: {
  tone: Tone;
  userGender: UserGender;
  useShortTermMemory: boolean;
  useLongTermMemory: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCooldown, setIsCooldown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userInput = formData.get('message') as string;
    if (!userInput?.trim() || isPending || isCooldown) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    formRef.current?.reset();

    startTransition(async () => {
      const recentMessages = useShortTermMemory
        ? newMessages.slice(-7)
        : [userMessage];

      // Strip audioUrl before sending to the server to reduce payload size.
      const conversationHistory = recentMessages.map(
        ({ id, role, content }) => ({
          id,
          role,
          content,
        })
      );

      const prevState = { messages: conversationHistory };

      const assistantMessage = await getAIResponse(prevState, formData);
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      // Start cooldown after response
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000); // 5-second cooldown
    });
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
          tone={tone}
          userGender={userGender}
          useShortTermMemory={useShortTermMemory}
          useLongTermMemory={useLongTermMemory}
          isPending={isPending}
          isCooldown={isCooldown}
        />
      </form>
    </SidebarInset>
  );
}
