'use client';

import { User, Bot, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (message.audio && audioRef.current) {
      audioRef.current.play().catch((e) => {
        // Autoplay was prevented. This can happen if the user hasn't interacted with the page yet.
        // The user can still click the play button.
        console.warn('Audio autoplay was prevented:', e);
      });
    }
  }, [message.audio]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

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
          {message.audio && (
            <>
              <audio ref={audioRef} src={message.audio} className="hidden" />
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'mt-2 h-7 w-7',
                  isUser ? 'float-right' : 'float-left'
                )}
                onClick={handlePlayAudio}
              >
                <Volume2 className="size-4" />
                <span className="sr-only">Play audio</span>
              </Button>
            </>
          )}
        </div>
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
