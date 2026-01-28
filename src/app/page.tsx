'use client';

import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HopeSidebar } from '@/components/hope-sidebar';
import { ChatPanel } from '@/components/chat-panel';
import type { Tone } from '@/lib/types';

export default function Home() {
  const [tone, setTone] = useState<Tone>('Casual');
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);

  return (
    <SidebarProvider>
      <HopeSidebar
        tone={tone}
        setTone={setTone}
        useShortTermMemory={useShortTermMemory}
        setUseShortTermMemory={setUseShortTermMemory}
        useLongTermMemory={useLongTermMemory}
        setUseLongTermMemory={setUseLongTermMemory}
      />
      <ChatPanel
        tone={tone}
        useShortTermMemory={useShortTermMemory}
        useLongTermMemory={useLongTermMemory}
      />
    </SidebarProvider>
  );
}
