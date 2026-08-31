import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { ChannelCard, CategoryBar, FeaturedBanner } from '@/components';
import { RemotePlaylistSelector } from '@/components/RemotePlaylistSelector';
import { useChannels } from '@/hooks/useChannels';
import { useRemotePlaylist } from '@/hooks/useRemotePlaylist';
import { Channel } from '@/services/channelService';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    channels,
    activeCategory,
    setActiveCategory,
    isFavorite,
    toggleFavorite,
    addToRecent,
    featuredChannel,
    totalChannels,
  } = useChannels();
  const [remoteSourceId, setRemoteSourceId] = useState<string | null>(null);
  const { channels: remoteChannels, sources, loading: remoteLoading } = useRemotePlaylist(remoteSourceId);
  const displayChannels = remoteSourceId ? remoteChannels : channels;

  const handleChannelPress = useCallback((channel: Channel) => {
    addToRecent(channel.id);
    router.push({ pathname: '/player', params: { id: channel.id } });
  }, [addToRecent, router]);

  const renderChannel = useCallback(({ item, index }: { item: Channel; index: number }) => (
    <View style={index % 2 === 0 ? styles.leftItem : styles.rightItem}>
      <ChannelCard
        channel={item}
        isFavorite={isFavorite(item.id)}
        onPress={() => handleChannelPress(item)}
        onFavoriteToggle={() => toggleFavorite(item.id)}
      />
    </View>
  ), [isFavorite, handleChannelPress, toggleFavorite]);

  const ListHeader = useCallback(() => (
    <View>
      {/* Header Bar */}
      <LinearGradient
        colors={[Colors.Background, Colors.Surface + 'CC']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.logoChip}>
            <Text style={styles.logoChipText}>TVT</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Saluran TV</Text>
            <Text style={styles.headerSub}>{totalChannels} channel tersedia</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>LIVE</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Featured */}
      <View style={styles.sectionLabel}>
        <MaterialIcons name="star" size={16} color={Colors.Gold} />
        <Text style={styles.sectionTitle}>Channel Unggulan</Text>
      </View>
      <FeaturedBanner
        channel={featuredChannel}
        onPress={() => handleChannelPress(featuredChannel)}
      />

      {/* Category Filter */}
      <View style={styles.sectionLabel}>
        <MaterialIcons name="tv" size={16} color={Colors.Primary} />
        <Text style={styles.sectionTitle}>Semua Channel</Text>
      </View>
      <CategoryBar active={activeCategory} onSelect={setActiveCategory} />

      <RemotePlaylistSelector
        sources={sources}
        selectedSourceId={remoteSourceId}
        onSelect={setRemoteSourceId}
        loading={remoteLoading}
      />

      <View style={{ height: Spacing.sm }} />
    </View>
  ), [insets.top, totalChannels, featuredChannel, activeCategory, setActiveCategory, handleChannelPress, sources, remoteSourceId, setRemoteSourceId, remoteLoading]);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="tv-off" size={56} color={Colors.TextDisabled} />
      <Text style={styles.emptyTitle}>Tidak ada channel</Text>
      <Text style={styles.emptyDesc}>Coba kategori lain atau tambahkan favorit</Text>
    </View>
  ), []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        data={displayChannels}
        keyExtractor={item => item.id}
        renderItem={renderChannel}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={8}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Border,
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoChip: {
    backgroundColor: Colors.Primary,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  logoChipText: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: Colors.Background,
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.TextPrimary,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: Colors.TextMuted,
    marginTop: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.Live + '20',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.Live + '40',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.Live,
  },
  onlineText: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    color: Colors.Live,
    letterSpacing: 0.8,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.TextPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  leftItem: {
    width: '48%',
  },
  rightItem: {
    width: '48%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.TextSecondary,
  },
  emptyDesc: {
    fontSize: FontSize.sm,
    color: Colors.TextMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
