'use client';

import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HopeSidebar } from '@/components/hope-sidebar';
import { ChatPanel } from '@/components/chat-panel';

export default function Home() {
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);

  return (
    <SidebarProvider>
      <HopeSidebar
        useShortTermMemory={useShortTermMemory}
        setUseShortTermMemory={setUseShortTermMemory}
        useLongTermMemory={useLongTermMemory}
        setUseLongTermMemory={setUseLongTermMemory}
      />
      <ChatPanel
        useShortTermMemory={useShortTermMemory}
        useLongTermMemory={useLongTermMemory}
      />
    </SidebarProvider>
  );
}
