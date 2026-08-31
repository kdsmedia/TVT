import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { CHANNELS, getChannelsByCategory, Channel } from '@/services/channelService';

const FAVORITES_KEY = 'tvt_favorites';
const RECENT_KEY = 'tvt_recent';

export type CategoryFilter = 'all' | 'indonesia' | 'international' | 'favorites';

export function useChannels() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentChannels, setRecentChannels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFavorites();
    loadRecent();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  };

  const loadRecent = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY);
      if (stored) setRecentChannels(JSON.parse(stored));
    } catch {}
  };

  const toggleFavorite = useCallback(async (channelId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [channelId, ...prev];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToRecent = useCallback(async (channelId: string) => {
    setRecentChannels(prev => {
      const filtered = prev.filter(id => id !== channelId);
      const updated = [channelId, ...filtered].slice(0, 10);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const filteredChannels = useMemo(() => {
    let channels = getChannelsByCategory(activeCategory, favorites);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      channels = channels.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.genre.toLowerCase().includes(q) ||
        c.currentShow.toLowerCase().includes(q)
      );
    }
    return channels;
  }, [activeCategory, favorites, searchQuery]);

  const recentChannelData = useMemo<Channel[]>(() => {
    return recentChannels
      .map(id => CHANNELS.find(c => c.id === id))
      .filter((c): c is Channel => c !== undefined)
      .slice(0, 6);
  }, [recentChannels]);

  const featuredChannel = useMemo(() => CHANNELS[0], []);

  return {
    channels: filteredChannels,
    activeCategory,
    setActiveCategory,
    favorites,
    toggleFavorite,
    isFavorite,
    addToRecent,
    recentChannelData,
    searchQuery,
    setSearchQuery,
    featuredChannel,
    totalChannels: CHANNELS.length,
  };
}
