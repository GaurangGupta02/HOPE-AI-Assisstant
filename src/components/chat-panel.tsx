'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { getAIResponse } from '@/app/actions';
import { ChatMessages } from './chat-messages';
import { Icons } from '@/components/icons';
import type { Message, Tone } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Renders the chat messages and the input form.
 */
function ChatInterface({
  messages,
  tone,
  useShortTermMemory,
  useLongTermMemory,
  isPending,
  isCooldown,
  textareaValue,
  onTextareaChange,
  handleMicClick,
  isListening,
  micSupported,
}: {
  messages: Message[];
  tone: Tone;
  useShortTermMemory: boolean;
  useLongTermMemory: boolean;
  isPending: boolean;
  isCooldown: boolean;
  textareaValue: string;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleMicClick: () => void;
  isListening: boolean;
  micSupported: boolean;
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
          <ChatMessages
            messages={messages}
            isPending={pending}
          />
        )}
      </main>
      <footer className="border-t bg-card/50 p-4 md:p-6">
        <div className="relative">
          <Textarea
            name="message"
            placeholder="Ask HOPE anything, or use the mic..."
            rows={1}
            className="min-h-[4rem] resize-none rounded-xl border-2 bg-card p-4 pr-32 shadow-sm"
            disabled={pending || isCooldown}
            value={textareaValue}
            onChange={onTextareaChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !(pending || isCooldown)) {
                if ((e.target as HTMLTextAreaElement).value.trim()) {
                  e.preventDefault();
                  e.currentTarget.closest('form')?.requestSubmit();
                }
              }
            }}
          />
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
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
            {micSupported && (
              <Button
                type="button"
                size="icon"
                variant={isListening ? 'destructive' : 'ghost'}
                className="rounded-full"
                onClick={handleMicClick}
                disabled={pending || isCooldown}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <MicOff /> : <Mic />}
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={pending || isCooldown || !textareaValue.trim()}
              aria-label="Send message"
            >
              {pending ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}

// Global SpeechRecognition instance
let recognition: SpeechRecognition | null = null;

export function ChatPanel({
  tone,
  useShortTermMemory,
  useLongTermMemory,
}: {
  tone: Tone;
  useShortTermMemory: boolean;
  useLongTermMemory: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isCooldown, setIsCooldown] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [textareaValue, setTextareaValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setMicSupported(true);
      recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop after one utterance.
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTextareaValue(finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: `An error occurred: ${event.error}. Please ensure you've given microphone permissions.`,
        });
        setIsListening(false);
      };
    } else {
      setMicSupported(false);
    }
  }, [toast]);

  const handleMicClick = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTextareaValue(''); // Clear previous text before starting
      recognition.start();
      setIsListening(true);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userInput = textareaValue;

    if (!userInput?.trim() || isPending || isCooldown) {
      return;
    }

    formData.set('message', userInput);

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

      const prevState = { messages: conversationHistory };

      const assistantMessage = await getAIResponse(prevState, formData);
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
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
          tone={tone}
          useShortTermMemory={useShortTermMemory}
          useLongTermMemory={useLongTermMemory}
          isPending={isPending}
          isCooldown={isCooldown}
          textareaValue={textareaValue}
          onTextareaChange={handleTextareaChange}
          handleMicClick={handleMicClick}
          isListening={isListening}
          micSupported={micSupported}
        />
      </form>
    </SidebarInset>
  );
}
