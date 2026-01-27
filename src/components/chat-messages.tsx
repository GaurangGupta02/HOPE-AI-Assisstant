'use client';

import { useEffect, useRef } from 'react';
import type { Message, UserGender } from '@/lib/types';
import { ChatMessage, ChatMessageSkeleton } from './chat-message';

interface ChatMessagesProps {
  messages: Message[];
  isPending: boolean;
  userGender: UserGender;
}

export function ChatMessages({
  messages,
  isPending,
  userGender,
}: ChatMessagesProps) {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  return (
    <div ref={scrollableContainerRef} className="h-full space-y-6">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          userGender={userGender}
        />
      ))}
      {isPending && <ChatMessageSkeleton />}
    </div>
  );
}
