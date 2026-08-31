import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { CategoryFilter } from '@/hooks/useChannels';

interface Category {
  id: CategoryFilter;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'Semua', icon: 'tv' },
  { id: 'indonesia', label: 'Indonesia', icon: 'flag' },
  { id: 'international', label: 'Internasional', icon: 'public' },
  { id: 'favorites', label: 'Favorit', icon: 'star' },
];

interface Props {
  active: CategoryFilter;
  onSelect: (cat: CategoryFilter) => void;
}

const CategoryBar = memo(({ active, onSelect }: Props) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map(cat => {
          const isSelected = active === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              style={({ pressed }) => [
                styles.pill,
                isSelected && styles.pillActive,
                pressed && { opacity: 0.8 },
              ]}
            >
              <MaterialIcons
                name={cat.icon}
                size={14}
                color={isSelected ? Colors.Background : Colors.TextMuted}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

CategoryBar.displayName = 'CategoryBar';

const styles = StyleSheet.create({
  wrapper: {
    height: 52,
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.SurfaceElevated,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  pillActive: {
    backgroundColor: Colors.Primary,
    borderColor: Colors.Primary,
  },
  pillText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.TextMuted,
  },
  pillTextActive: {
    color: Colors.Background,
  },
});

export default CategoryBar;
