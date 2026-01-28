'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SidebarProvider } from '@/components/ui/sidebar';
import { HopeSidebar } from '@/components/hope-sidebar';
import { ChatPanel } from '@/components/chat-panel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);
  const bgImage = PlaceHolderImages.find((img) => img.id === 'sunset-background');

  return (
    <div className="relative min-h-screen">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover z-0"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      <div className="relative z-10">
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
      </div>
    </div>
  );
}
