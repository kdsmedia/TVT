import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { IPTVSource } from '@/services/iptvSources';

export interface RemotePlaylistSelectorProps {
  sources: IPTVSource[];
  selectedSourceId: string | null;
  onSelect: (id: string | null) => void;
  loading: boolean;
}

export function RemotePlaylistSelector({
  sources,
  selectedSourceId,
  onSelect,
  loading,
}: RemotePlaylistSelectorProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>Sumber Playlist IPTV</Text>
        {loading ? <Text style={styles.loading}>Memuat…</Text> : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <Pressable
          style={[
            styles.chip,
            selectedSourceId === null && styles.chipActive,
          ]}
          onPress={() => onSelect(null)}
        >
          <MaterialIcons name="tv" size={14} color={selectedSourceId === null ? Colors.Background : Colors.TextPrimary} />
          <Text style={[styles.chipText, selectedSourceId === null && styles.chipTextActive]}>Bawaan</Text>
        </Pressable>
        {sources.map((source) => {
          const active = selectedSourceId === source.id;
          return (
            <Pressable
              key={source.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(active ? null : source.id)}
            >
              <MaterialIcons name="playlist-play" size={14} color={active ? Colors.Background : Colors.TextPrimary} />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {source.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.TextDisabled,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loading: {
    fontSize: FontSize.xs,
    color: Colors.Primary,
  },
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.Border,
    backgroundColor: Colors.Surface,
  },
  chipActive: {
    backgroundColor: Colors.Primary,
    borderColor: Colors.Primary,
  },
  chipText: {
    fontSize: FontSize.xs,
    color: Colors.TextPrimary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.Background,
  },
});