import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { useChannels } from '@/hooks/useChannels';
import { Channel } from '@/services/channelService';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { channels, searchQuery, setSearchQuery, isFavorite, toggleFavorite, addToRecent } = useChannels();

  const handlePress = useCallback((channel: Channel) => {
    addToRecent(channel.id);
    router.push({ pathname: '/player', params: { id: channel.id } });
  }, [addToRecent, router]);

  const renderItem = useCallback(({ item }: { item: Channel }) => (
    <Pressable
      onPress={() => handlePress(item)}
      style={({ pressed }) => [styles.resultCard, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.logoWrap}>
        <Image source={{ uri: item.logo }} style={styles.logo} contentFit="contain" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.show} numberOfLines={1}>{item.currentShow}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.genre}>{item.genre}</Text>
          <View style={styles.bullet} />
          <Text style={[styles.quality, { color: item.category === 'indonesia' ? Colors.Gold : Colors.Primary }]}>
            {item.category === 'indonesia' ? 'Indonesia' : 'International'}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => toggleFavorite(item.id)} hitSlop={12}>
        <MaterialIcons
          name={isFavorite(item.id) ? 'star' : 'star-border'}
          size={22}
          color={isFavorite(item.id) ? Colors.Gold : Colors.TextMuted}
        />
      </Pressable>
      <MaterialIcons name="play-circle-filled" size={32} color={Colors.Primary} style={{ marginLeft: 8 }} />
    </Pressable>
  ), [handlePress, isFavorite, toggleFavorite]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.title}>Cari Channel</Text>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={Colors.TextMuted} />
          <TextInput
            style={styles.input}
            placeholder="Cari channel, genre, atau acara..."
            placeholderTextColor={Colors.TextMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={Colors.TextMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={channels}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={52} color={Colors.TextDisabled} />
            <Text style={styles.emptyText}>
              {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Mulai ketik untuk mencari...'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          searchQuery === '' ? (
            <Text style={styles.hint}>
              {channels.length} channel tersedia
            </Text>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.Background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Border,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.TextPrimary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.TextPrimary,
    includeFontPadding: false,
  },
  hint: {
    fontSize: FontSize.sm,
    color: Colors.TextMuted,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  list: { paddingHorizontal: Spacing.md },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.Border,
    gap: Spacing.md,
    ...Shadow.card,
  },
  logoWrap: {
    width: 52,
    height: 40,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.sm,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: '100%', height: '100%' },
  cardInfo: { flex: 1, gap: 3 },
  name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.TextPrimary },
  show: { fontSize: FontSize.xs, color: Colors.TextSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  genre: { fontSize: FontSize.xs, color: Colors.TextMuted },
  bullet: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.TextMuted },
  quality: { fontSize: FontSize.xs, fontWeight: '700' },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.TextMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.xl,
  },
});
