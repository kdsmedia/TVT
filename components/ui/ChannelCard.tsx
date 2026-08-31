import React, { memo } from 'react';
import {
  View, Text, StyleSheet, Pressable, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { Channel } from '@/services/channelService';

interface Props {
  channel: Channel;
  isFavorite: boolean;
  onPress: () => void;
  onFavoriteToggle: () => void;
}

const QUALITY_COLORS: Record<string, string> = {
  '4K': '#FFD700',
  'FHD': '#00E5FF',
  'HD': '#00E676',
  'SD': '#9E9E9E',
};

const ChannelCard = memo(({ channel, isFavorite, onPress, onFavoriteToggle }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      {/* 3D Card Body */}
      <View style={styles.card}>
        {/* Top glow line */}
        <View style={[styles.topGlow, { backgroundColor: channel.accentColor + '60' }]} />

        {/* Channel Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoWrapper}>
            <Image
              source={{ uri: channel.logo }}
              style={styles.logo}
              contentFit="contain"
              transition={200}
            />
          </View>

          {/* Favorite Button */}
          <Pressable
            onPress={onFavoriteToggle}
            hitSlop={10}
            style={styles.favBtn}
          >
            <MaterialIcons
              name={isFavorite ? 'star' : 'star-border'}
              size={18}
              color={isFavorite ? Colors.Gold : Colors.TextMuted}
            />
          </Pressable>
        </View>

        {/* Channel Info */}
        <View style={styles.infoArea}>
          <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
          <Text style={styles.genre} numberOfLines={1}>{channel.genre}</Text>
        </View>

        {/* Current Show + Live Badge */}
        <LinearGradient
          colors={['transparent', Colors.SurfaceCard + 'EE']}
          style={styles.showBar}
        >
          <View style={styles.liveRow}>
            {channel.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
            <View style={[styles.qualityBadge, { borderColor: QUALITY_COLORS[channel.quality] + '80' }]}>
              <Text style={[styles.qualityText, { color: QUALITY_COLORS[channel.quality] }]}>
                {channel.quality}
              </Text>
            </View>
          </View>
          <Text style={styles.currentShow} numberOfLines={1}>{channel.currentShow}</Text>
        </LinearGradient>

        {/* Bottom depth shadow effect */}
        <View style={styles.depthBar} />
      </View>
    </Pressable>
  );
});

ChannelCard.displayName = 'ChannelCard';

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  containerPressed: {
    transform: [{ scale: 0.97 }, { translateY: 2 }],
    opacity: 0.9,
  },
  card: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.Border,
    overflow: 'hidden',
    ...Shadow.card,
  },
  topGlow: {
    height: 2,
    width: '100%',
  },
  logoArea: {
    height: 80,
    backgroundColor: Colors.SurfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoWrapper: {
    width: 72,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF10',
    borderRadius: Radius.sm,
    padding: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Surface + 'CC',
    borderRadius: Radius.full,
  },
  infoArea: {
    paddingHorizontal: Spacing.sm + 4,
    paddingTop: Spacing.sm,
    paddingBottom: 6,
  },
  channelName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.TextPrimary,
    letterSpacing: 0.3,
  },
  genre: {
    fontSize: FontSize.xs,
    color: Colors.TextMuted,
    marginTop: 2,
  },
  showBar: {
    paddingHorizontal: Spacing.sm + 4,
    paddingBottom: Spacing.sm,
    paddingTop: 4,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.Live + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.Live + '50',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.Live,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.Live,
    letterSpacing: 0.8,
  },
  qualityBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
  },
  qualityText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currentShow: {
    fontSize: FontSize.xs,
    color: Colors.TextSecondary,
  },
  depthBar: {
    height: 3,
    backgroundColor: Colors.Background,
    borderRadius: Radius.full,
    marginHorizontal: Spacing.sm,
    marginBottom: 4,
    opacity: 0.5,
  },
});

export default ChannelCard;
