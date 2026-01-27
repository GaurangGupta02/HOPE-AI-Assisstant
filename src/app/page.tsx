'use client';

import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HopeSidebar } from '@/components/hope-sidebar';
import { ChatPanel } from '@/components/chat-panel';
import type { Tone, UserGender } from '@/lib/types';

export default function Home() {
  const [tone, setTone] = useState<Tone>('Casual');
  const [userGender, setUserGender] = useState<UserGender>('unspecified');
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);

  return (
    <SidebarProvider>
      <HopeSidebar
        tone={tone}
        setTone={setTone}
        userGender={userGender}
        setUserGender={setUserGender}
        useShortTermMemory={useShortTermMemory}
        setUseShortTermMemory={setUseShortTermMemory}
        useLongTermMemory={useLongTermMemory}
        setUseLongTermMemory={setUseLongTermMemory}
      />
      <ChatPanel
        tone={tone}
        userGender={userGender}
        useShortTermMemory={useShortTermMemory}
        useLongTermMemory={useLongTermMemory}
      />
    </SidebarProvider>
  );
}
