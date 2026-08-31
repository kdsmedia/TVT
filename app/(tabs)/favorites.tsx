import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, FontSize } from '@/constants/theme';
import { ChannelCard } from '@/components';
import { useChannels } from '@/hooks/useChannels';
import { Channel } from '@/services/channelService';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { channels, isFavorite, toggleFavorite, addToRecent, setActiveCategory } = useChannels();

  // Force favorites filter
  const favoriteChannels = channels;

  const handlePress = useCallback((channel: Channel) => {
    addToRecent(channel.id);
    router.push({ pathname: '/player', params: { id: channel.id } });
  }, [addToRecent, router]);

  const renderChannel = useCallback(({ item, index }: { item: Channel; index: number }) => (
    <View style={index % 2 === 0 ? styles.leftItem : styles.rightItem}>
      <ChannelCard
        channel={item}
        isFavorite={isFavorite(item.id)}
        onPress={() => handlePress(item)}
        onFavoriteToggle={() => toggleFavorite(item.id)}
      />
    </View>
  ), [isFavorite, handlePress, toggleFavorite]);

  const { channels: favChannels } = useChannels();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        data={favChannels.filter(c => isFavorite(c.id))}
        keyExtractor={item => item.id}
        renderItem={renderChannel}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        removeClippedSubviews={Platform.OS === 'android'}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <View style={styles.titleRow}>
              <MaterialIcons name="star" size={24} color={Colors.Gold} />
              <Text style={styles.title}>Favorit Saya</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="star-border" size={64} color={Colors.TextDisabled} />
            <Text style={styles.emptyTitle}>Belum ada favorit</Text>
            <Text style={styles.emptyDesc}>
              Tekan ikon bintang pada channel manapun untuk menambah ke favorit
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.Background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Border,
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.TextPrimary,
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  leftItem: { width: '48%' },
  rightItem: { width: '48%' },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.TextSecondary,
  },
  emptyDesc: {
    fontSize: FontSize.md,
    color: Colors.TextMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
