'use client';

import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HopeSidebar } from '@/components/hope-sidebar';
import { ChatPanel } from '@/components/chat-panel';
import type { Tone } from '@/lib/types';

type UserProfile = {
  gender: 'male' | 'female';
  displayName: string;
  email: string;
};

export default function Home() {
  const [tone, setTone] = useState<Tone>('Casual');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);

  const userProfile: UserProfile = {
    gender: gender,
    displayName: 'User',
    email: '',
  };

  return (
    <SidebarProvider>
      <HopeSidebar
        tone={tone}
        setTone={setTone}
        gender={gender}
        setGender={setGender}
        useShortTermMemory={useShortTermMemory}
        setUseShortTermMemory={setUseShortTermMemory}
        useLongTermMemory={useLongTermMemory}
        setUseLongTermMemory={setUseLongTermMemory}
      />
      <ChatPanel
        tone={tone}
        useShortTermMemory={useShortTermMemory}
        useLongTermMemory={useLongTermMemory}
        userProfile={userProfile}
      />
    </SidebarProvider>
  );
}
