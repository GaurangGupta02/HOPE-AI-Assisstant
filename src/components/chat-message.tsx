'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Bot, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message, UserGender } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { getAudioForText } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
  userGender: UserGender;
}

export function ChatMessage({ message, userGender }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState(message.audioUrl);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const { toast } = useToast();

  const handlePlayAudio = async () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {});
      return;
    }

    if (isLoadingAudio) return;

    setIsLoadingAudio(true);
    const result = await getAudioForText(message.content, userGender);
    setIsLoadingAudio(false);

    if (result.audioUrl) {
      setAudioUrl(result.audioUrl);
    } else if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: result.error,
      });
    }
  };

  useEffect(() => {
    // When the audioUrl is set (either initially or after fetching), play it.
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((e) => {
        console.error('Audio play failed:', e);
        // This can happen if the user hasn't interacted with the page yet.
        // The audio will still be playable via the button.
      });
    }
  }, [audioUrl]);

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
        {!isUser && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="mt-2 h-8 w-8 rounded-full"
              onClick={handlePlayAudio}
              disabled={isLoadingAudio}
              aria-label="Play audio"
            >
              {isLoadingAudio ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} className="hidden" />
            )}
          </>
        )}
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
