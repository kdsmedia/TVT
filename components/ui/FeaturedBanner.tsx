import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '@/constants/theme';
import { Channel } from '@/services/channelService';

interface Props {
  channel: Channel;
  onPress: () => void;
}

const FeaturedBanner = memo(({ channel, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
      ]}
    >
      <LinearGradient
        colors={[channel.accentColor + '40', Colors.SurfaceCard, Colors.Surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        {/* Left: logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBox}>
            <Image
              source={{ uri: channel.logo }}
              style={styles.logo}
              contentFit="contain"
              transition={300}
            />
          </View>
        </View>

        {/* Right: info */}
        <View style={styles.info}>
          <View style={styles.topRow}>
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>SIARAN LANGSUNG</Text>
            </View>
          </View>

          <Text style={styles.name}>{channel.name}</Text>
          <Text style={styles.show} numberOfLines={2}>{channel.currentShow}</Text>

          <View style={styles.metaRow}>
            <MaterialIcons name="people" size={12} color={Colors.TextMuted} />
            <Text style={styles.viewers}>{channel.viewers}</Text>
            <View style={styles.dot} />
            <Text style={styles.quality}>{channel.quality}</Text>
          </View>
        </View>

        {/* Play button */}
        <View style={styles.playBtn}>
          <MaterialIcons name="play-arrow" size={28} color={Colors.TextPrimary} />
        </View>

        {/* 3D bottom border */}
        <View style={[styles.accentLine, { backgroundColor: channel.accentColor }]} />
      </LinearGradient>
    </Pressable>
  );
});

FeaturedBanner.displayName = 'FeaturedBanner';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
    ...Shadow.cardActive,
  },
  banner: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.BorderLight,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 80,
    height: 64,
    backgroundColor: '#FFFFFF15',
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.Live + '25',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.Live + '50',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.Live,
  },
  liveLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.Live,
    letterSpacing: 0.6,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.TextPrimary,
    letterSpacing: 0.5,
  },
  show: {
    fontSize: FontSize.sm,
    color: Colors.TextSecondary,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  viewers: {
    fontSize: FontSize.xs,
    color: Colors.TextMuted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.TextMuted,
  },
  quality: {
    fontSize: FontSize.xs,
    color: Colors.Primary,
    fontWeight: '700',
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    opacity: 0.7,
  },
});

export default FeaturedBanner;
