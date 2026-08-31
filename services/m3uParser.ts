import { Channel } from '@/services/channelService';

export interface ParsedChannel {
  name: string;
  logo?: string;
  group?: string;
  url: string;
}

export function parseM3U(content: string): ParsedChannel[] {
  const lines = content.split(/\r?\n/);
  const channels: ParsedChannel[] = [];
  let info: string | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith(`#EXTINF`)) {
      info = line;
    } else if (line.startsWith(`#EXTGRP:`)) {
      if (info) info += ' ' + line;
    } else if (!line.startsWith('#') && line) {
      if (info) {
        channels.push(buildChannel(info, line));
        info = null;
      }
    }
  }

  return channels;
}

function buildChannel(info: string, url: string): ParsedChannel {
  const logoMatch = info.match(/tvg-logo="([^"]*)"/);
  const groupMatch = info.match(/group-title="([^"]*)"/);
  const name = info.replace(/^#EXTINF:[^,]*,/, '').trim();
  return {
    name,
    logo: logoMatch?.[1] ?? undefined,
    group: groupMatch?.[1] ?? undefined,
    url,
  };
}

export function toChannel(parsed: ParsedChannel, sourceId: string, index: number): Channel {
  return {
    id: `${sourceId}-${index}`,
    name: parsed.name,
    logo: parsed.logo ?? 'https://placehold.co/120x120/1a1a2e/ffffff?text=TV',
    category: sourceId === 'indonesia' ? 'indonesia' : 'international',
    genre: parsed.group ?? 'Remote',
    isLive: true,
    currentShow: 'Siaran Langsung',
    viewers: '-',
    streamUrl: parsed.url,
    description: `Saluran dari playlist ${sourceId}`,
    quality: 'HD',
    language: 'Multi',
    accentColor: '#E31E2D',
  };
}