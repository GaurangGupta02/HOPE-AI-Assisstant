'use client';

import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HopeSidebar } from '@/components/hope-sidebar';
import { ChatPanel } from '@/components/chat-panel';
import type { Tone, Voice } from '@/lib/types';

export default function Home() {
  const [tone, setTone] = useState<Tone>('Casual');
  const [voice, setVoice] = useState<Voice>('female');
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);

  return (
    <SidebarProvider>
      <HopeSidebar
        tone={tone}
        setTone={setTone}
        voice={voice}
        setVoice={setVoice}
        useShortTermMemory={useShortTermMemory}
        setUseShortTermMemory={setUseShortTermMemory}
        useLongTermMemory={useLongTermMemory}
        setUseLongTermMemory={setUseLongTermMemory}
      />
      <ChatPanel
        tone={tone}
        voice={voice}
        useShortTermMemory={useShortTermMemory}
        useLongTermMemory={useLongTermMemory}
      />
    </SidebarProvider>
  );
}
