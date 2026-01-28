'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/icons';
import type { Tone, Voice } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

interface HopeSidebarProps {
  tone: Tone;
  setTone: Dispatch<SetStateAction<Tone>>;
  voice: Voice;
  setVoice: Dispatch<SetStateAction<Voice>>;
  useShortTermMemory: boolean;
  setUseShortTermMemory: Dispatch<SetStateAction<boolean>>;
  useLongTermMemory: boolean;
  setUseLongTermMemory: Dispatch<SetStateAction<boolean>>;
}

export function HopeSidebar({
  tone,
  setTone,
  voice,
  setVoice,
  useShortTermMemory,
  setUseShortTermMemory,
  useLongTermMemory,
  setUseLongTermMemory,
}: HopeSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons name="hope" className="size-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold">HOPE</h2>
            <p className="text-sm text-muted-foreground">Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem className="!p-0">
              <div className="flex w-full flex-col gap-4 p-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="persona-select">AI Voice & Persona</Label>
                  <Select
                    value={voice}
                    onValueChange={(v) => setVoice(v as Voice)}
                  >
                    <SelectTrigger id="persona-select">
                      <SelectValue placeholder="Select a persona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female (Girlfriend)</SelectItem>
                      <SelectItem value="male">Male (Boyfriend)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tone-select">Adaptive Tone</Label>
                  <Select
                    value={tone}
                    onValueChange={(v) => setTone(v as Tone)}
                  >
                    <SelectTrigger id="tone-select">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Emotional">Emotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Memory Layers</Label>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex flex-col">
                      <Label
                        htmlFor="short-term-memory"
                        className="font-normal"
                      >
                        Short-Term
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Use conversation history.
                      </p>
                    </div>
                    <Switch
                      id="short-term-memory"
                      checked={useShortTermMemory}
                      onCheckedChange={setUseShortTermMemory}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex flex-col">
                      <Label
                        htmlFor="long-term-memory"
                        className="font-normal"
                      >
                        Long-Term
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recall saved facts.
                      </p>
                    </div>
                    <Switch
                      id="long-term-memory"
                      checked={useLongTermMemory}
                      onCheckedChange={setUseLongTermMemory}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
