import { useCallback, useEffect, useState } from 'react';
import { Channel } from '@/services/channelService';
import { IPTVSource, IPTV_SOURCES } from '@/services/iptvSources';
import { parseM3U, toChannel } from '@/services/m3uParser';

export interface RemotePlaylistState {
  channels: Channel[];
  loading: boolean;
  error: string | null;
}

export function useRemotePlaylist(sourceId: string | null) {
  const [state, setState] = useState<RemotePlaylistState>({
    channels: [],
    loading: false,
    error: null,
  });

  const load = useCallback(async (id: string) => {
    const source = IPTV_SOURCES.find((s) => s.id === id);
    if (!source) return;
    setState({ channels: [], loading: true, error: null });
    try {
      const res = await fetch(source.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseM3U(text);
      const channels = parsed.map((c, i) => toChannel(c, source.id, i));
      setState({ channels, loading: false, error: null });
    } catch (e) {
      setState({ channels: [], loading: false, error: e instanceof Error ? e.message : 'Gagal memuat playlist' });
    }
  }, []);

  useEffect(() => {
    if (sourceId) void load(sourceId);
  }, [sourceId, load]);

  const refresh = useCallback(() => {
    if (sourceId) void load(sourceId);
  }, [sourceId, load]);

  return { ...state, refresh, sources: IPTV_SOURCES, currentSource: IPTV_SOURCES.find((s) => s.id === sourceId) ?? null };
}