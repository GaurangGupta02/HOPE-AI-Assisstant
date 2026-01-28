'use client';

import { useRef, useEffect } from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (message.role === 'assistant' && message.audioUrl && audioRef.current) {
      audioRef.current.src = message.audioUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name === 'NotAllowedError') {
            console.warn(
              'Audio autoplay was prevented by the browser. User interaction is required to play audio.'
            );
            toast({
              variant: 'destructive',
              title: 'Audio Autoplay Blocked',
              description:
                "The browser prevented the assistant's voice from playing automatically.",
            });
          } else {
            console.error('Audio playback failed:', error);
            toast({
              variant: 'destructive',
              title: 'Audio Playback Error',
              description: 'Could not play the audio for an unknown reason.',
            });
          }
        });
      }
    }
  }, [message.audioUrl, message.role, toast]);

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar
        className={cn('size-8', isUser && 'bg-primary text-primary-foreground')}
      >
        <AvatarFallback>
          {isUser ? <User className="size-5" /> : <Bot className="size-5" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn('max-w-[80%]', isUser ? 'text-right' : 'text-left')}>
        <div
          className={cn(
            'rounded-xl p-4',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-card'
          )}
        >
          <div className="prose prose-sm max-w-none text-current whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
        {!isUser && <audio ref={audioRef} className="hidden" />}
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="size-8">
        <AvatarFallback>
          <Bot className="size-5" />
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[80%] space-y-2">
        <Skeleton className="h-6 w-48 rounded-xl" />
        <Skeleton className="h-6 w-64 rounded-xl" />
        <Skeleton className="h-6 w-32 rounded-xl" />
      </div>
    </div>
  );
}
