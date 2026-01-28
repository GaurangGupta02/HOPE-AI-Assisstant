'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
import { getAIResponse, getAudioForText } from '@/app/actions';
import { ChatMessages } from './chat-messages';
import { Icons } from '@/components/icons';
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Renders the chat messages and the input form.
 */
function ChatInterface({
  messages,
  isPending,
  textareaValue,
  onTextareaChange,
  handleMicClick,
  isListening,
  micSupported,
}: {
  messages: Message[];
  isPending: boolean;
  textareaValue: string;
  onTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleMicClick: () => void;
  isListening: boolean;
  micSupported: boolean;
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
            placeholder="Ask HOPE anything, or use the mic..."
            rows={1}
            className="min-h-[4rem] resize-none rounded-xl border-2 bg-card p-4 pr-32 shadow-sm"
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
            {micSupported && (
              <Button
                type="button"
                size="icon"
                variant={isListening ? 'destructive' : 'ghost'}
                className="rounded-full"
                onClick={handleMicClick}
                disabled={isPending}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <MicOff /> : <Mic />}
              </Button>
            )}
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

// Global SpeechRecognition instance
let recognition: SpeechRecognition | null = null;

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
        let description = `An error occurred: ${event.error}. Please try again.`;

        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            description =
              'Microphone access was denied. Please allow microphone permissions in your browser settings to use this feature.';
            break;
          case 'network':
            description =
              'Speech recognition failed due to a network issue. Please check your internet connection and try again.';
            break;
          case 'no-speech':
            description =
              'No speech was detected. Please make sure your microphone is working and try again.';
            break;
          case 'audio-capture':
            description =
              'Could not capture audio. Please ensure your microphone is connected and working correctly.';
            break;
        }

        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: description,
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

      const prevState = { messages: conversationHistory };

      // Get text response
      let assistantMessage = await getAIResponse(prevState, formData);

      // Check for errors before generating audio
      const isError =
        assistantMessage.content.includes("I'm sorry") ||
        assistantMessage.content.includes('high volume of requests') ||
        assistantMessage.content.includes('issue while processing');
      
      if (assistantMessage.content && !isError) {
        try {
          const audioResult = await getAudioForText(
            assistantMessage.content
          );
          if (audioResult.audioUrl) {
            assistantMessage.audioUrl = audioResult.audioUrl;
          } else if (audioResult.error) {
            // Non-blocking warning if audio fails
            console.warn('Audio generation failed:', audioResult.error);
            toast({
              variant: 'destructive',
              title: 'Audio Generation Failed',
              description: audioResult.error,
              duration: 5000,
            });
          }
        } catch (e) {
          console.error('An unexpected error occurred during audio generation:', e);
        }
      }

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
          handleMicClick={handleMicClick}
          isListening={isListening}
          micSupported={micSupported}
        />
      </form>
    </SidebarInset>
  );
}
