'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {SidebarProvider} from '@/components/ui/sidebar';
import {HopeSidebar} from '@/components/hope-sidebar';
import {ChatPanel} from '@/components/chat-panel';
import type {Tone} from '@/lib/types';
import {useUser, useDoc} from '@/firebase';
import {Skeleton} from '@/components/ui/skeleton';

type UserProfile = {
  gender: 'male' | 'female';
  displayName: string;
  email: string;
};

export default function Home() {
  const router = useRouter();
  const {user, isLoading: isUserLoading} = useUser();
  const {data: userProfile, isLoading: isProfileLoading} = useDoc<UserProfile>(
    user ? `users/${user.uid}` : ''
  );

  const [tone, setTone] = useState<Tone>('Casual');
  const [useShortTermMemory, setUseShortTermMemory] = useState(true);
  const [useLongTermMemory, setUseLongTermMemory] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  
  // Wait for profile to load, especially after social auth signup
  if (isProfileLoading || !userProfile) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

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
        userProfile={userProfile}
      />
    </SidebarProvider>
  );
}
