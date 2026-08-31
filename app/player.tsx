import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Platform, Dimensions, StatusBar as RNStatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { getChannelById, CHANNELS, getPrevChannel, getNextChannel, getChannelIndex } from '@/services/channelService';
import { useChannels } from '@/hooks/useChannels';

const QUALITY_COLORS: Record<string, string> = {
  '4K': '#FFD700',
  'FHD': '#00E5FF',
  'HD': '#00E676',
  'SD': '#9E9E9E',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite, addToRecent } = useChannels();

  const [currentId, setCurrentId] = useState(id || CHANNELS[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const channel = getChannelById(currentId);
  const channelIndex = getChannelIndex(currentId);
  const totalChannels = CHANNELS.length;

  const player = useVideoPlayer(
    channel?.streamUrl ? { uri: channel.streamUrl } : null,
    (p) => {
      p.loop = true;
      p.play();
    }
  );

  // Switch channel
  const switchChannel = useCallback((newId: string) => {
    setCurrentId(newId);
    addToRecent(newId);
    showControlsTemporarily();
  }, [addToRecent]);

  const handlePrev = useCallback(() => {
    const prev = getPrevChannel(currentId);
    if (prev) {
      setStatusMsg(`${prev.name}`);
      switchChannel(prev.id);
    }
  }, [currentId, switchChannel]);

  const handleNext = useCallback(() => {
    const next = getNextChannel(currentId);
    if (next) {
      setStatusMsg(`${next.name}`);
      switchChannel(next.id);
    }
  }, [currentId, switchChannel]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  const handleScreenTap = useCallback(() => {
    if (showControls) {
      setShowControls(false);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    } else {
      showControlsTemporarily();
    }
  }, [showControls, showControlsTemporarily]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setIsFullscreen(true);
      }
    } catch {
      setIsFullscreen(prev => !prev);
    }
    showControlsTemporarily();
  }, [isFullscreen, showControlsTemporarily]);

  // Lock portrait when leaving
  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, []);

  // Auto hide controls
  useEffect(() => {
    showControlsTemporarily();
  }, [currentId]);

  // Clear status message
  useEffect(() => {
    if (statusMsg) {
      const t = setTimeout(() => setStatusMsg(''), 2000);
      return () => clearTimeout(t);
    }
  }, [statusMsg]);

  const related = CHANNELS.filter(c => c.id !== currentId && c.category === channel?.category).slice(0, 4);

  if (!channel) {
    return (
      <View style={[styles.screen, styles.center]}>
        <MaterialIcons name="tv-off" size={48} color={Colors.TextMuted} />
        <Text style={styles.errorText}>Channel tidak ditemukan</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const playerHeight = isFullscreen
    ? Dimensions.get('window').height
    : 240 + insets.top;

  return (
    <View style={[styles.screen, isFullscreen && styles.fullscreenScreen]}>
      <StatusBar style="light" hidden={isFullscreen} />

      {/* ===== VIDEO PLAYER ===== */}
      <Pressable
        style={[styles.playerArea, { height: playerHeight }]}
        onPress={handleScreenTap}
      >
        {/* Video */}
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          nativeControls={false}
        />

        {/* Dark overlay top/bottom for controls readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
          locations={[0, 0.25, 0.6, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Channel switch OSD */}
        {statusMsg !== '' && (
          <View style={styles.statusOSD}>
            <MaterialIcons name="tv" size={16} color={Colors.Primary} />
            <Text style={styles.statusOSDText}>{statusMsg}</Text>
          </View>
        )}

        {/* Controls overlay */}
        {showControls && (
          <View style={[styles.controls, { paddingTop: isFullscreen ? 16 : insets.top + 8 }]}>
            {/* Top bar */}
            <View style={styles.topBar}>
              {!isFullscreen && (
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
                  <MaterialIcons name="arrow-back" size={22} color={Colors.TextPrimary} />
                </Pressable>
              )}
              <View style={styles.titleArea}>
                <Text style={styles.playerChannelName} numberOfLines={1}>{channel.name}</Text>
                <View style={styles.liveRow}>
                  {channel.isLive && (
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                  <Text style={[styles.qualityTag, { color: QUALITY_COLORS[channel.quality] }]}>
                    {channel.quality}
                  </Text>
                  <Text style={styles.chIndexTag}>
                    {channelIndex + 1}/{totalChannels}
                  </Text>
                </View>
              </View>
              {/* Fullscreen button */}
              <Pressable onPress={toggleFullscreen} hitSlop={12} style={styles.iconBtn}>
                <MaterialIcons
                  name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                  size={26}
                  color={Colors.TextPrimary}
                />
              </Pressable>
            </View>

            {/* Center controls: Prev | Play/Pause | Next */}
            <View style={styles.centerControls}>
              {/* Previous channel */}
              <Pressable onPress={handlePrev} style={styles.channelNavBtn} hitSlop={8}>
                <View style={styles.navBtnInner}>
                  <MaterialIcons name="skip-previous" size={28} color={Colors.TextPrimary} />
                  <Text style={styles.navBtnLabel} numberOfLines={1}>
                    {getPrevChannel(currentId)?.name || ''}
                  </Text>
                </View>
              </Pressable>

              {/* Play/Pause */}
              <Pressable
                onPress={() => {
                  if (player.playing) {
                    player.pause();
                  } else {
                    player.play();
                  }
                  showControlsTemporarily();
                }}
                style={styles.playBtn}
              >
                <View style={styles.playCircle}>
                  <MaterialIcons
                    name={player.playing ? 'pause' : 'play-arrow'}
                    size={44}
                    color={Colors.TextPrimary}
                  />
                </View>
              </Pressable>

              {/* Next channel */}
              <Pressable onPress={handleNext} style={styles.channelNavBtn} hitSlop={8}>
                <View style={styles.navBtnInner}>
                  <MaterialIcons name="skip-next" size={28} color={Colors.TextPrimary} />
                  <Text style={styles.navBtnLabel} numberOfLines={1}>
                    {getNextChannel(currentId)?.name || ''}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Bottom controls */}
            <View style={styles.bottomBar}>
              <Text style={styles.nowPlaying} numberOfLines={1}>
                {channel.currentShow}
              </Text>
              <View style={styles.bottomRight}>
                <Pressable onPress={() => { toggleFavorite(channel.id); showControlsTemporarily(); }} hitSlop={8}>
                  <MaterialIcons
                    name={isFavorite(channel.id) ? 'star' : 'star-border'}
                    size={24}
                    color={isFavorite(channel.id) ? Colors.Gold : Colors.TextSecondary}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Tap hint when controls hidden */}
        {!showControls && (
          <View style={styles.tapHint} pointerEvents="none">
            <Text style={styles.tapHintText}>Ketuk untuk kontrol</Text>
          </View>
        )}
      </Pressable>

      {/* ===== INFO SECTION (hidden in fullscreen) ===== */}
      {!isFullscreen && (
        <ScrollView
          style={styles.infoScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Channel Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoLogoWrap}>
                <Image source={{ uri: channel.logo }} style={styles.infoLogo} contentFit="contain" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoName}>{channel.name}</Text>
                <Text style={styles.infoDesc}>{channel.description}</Text>
                <View style={styles.infoMeta}>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="people" size={12} color={Colors.Primary} />
                    <Text style={styles.metaChipText}>{channel.viewers}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="language" size={12} color={Colors.Gold} />
                    <Text style={styles.metaChipText}>{channel.language}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="category" size={12} color={Colors.Success} />
                    <Text style={styles.metaChipText}>{channel.genre}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Channel navigation list */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Channel Terkait</Text>
            {related.map(ch => (
              <Pressable
                key={ch.id}
                onPress={() => switchChannel(ch.id)}
                style={({ pressed }) => [styles.relatedRow, pressed && { opacity: 0.8 }]}
              >
                <View style={styles.relatedLogo}>
                  <Image source={{ uri: ch.logo }} style={styles.relatedLogoImg} contentFit="contain" />
                </View>
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedName}>{ch.name}</Text>
                  <Text style={styles.relatedShow} numberOfLines={1}>{ch.currentShow}</Text>
                </View>
                <View style={styles.relatedLive}>
                  <View style={styles.liveDot} />
                  <Text style={styles.relatedLiveText}>LIVE</Text>
                </View>
                <MaterialIcons name="play-circle-filled" size={30} color={Colors.Primary} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Fullscreen exit button (bottom right, always visible) */}
      {isFullscreen && (
        <Pressable
          onPress={() => router.back()}
          style={[styles.fsBackBtn, { top: 16, left: 16 }]}
        >
          <MaterialIcons name="arrow-back" size={22} color={Colors.TextPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  fullscreenScreen: { backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  errorText: { fontSize: FontSize.lg, color: Colors.TextSecondary },
  backBtn: {
    backgroundColor: Colors.Primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  backBtnText: { fontSize: FontSize.md, color: Colors.Background, fontWeight: '700' },

  // Player
  playerArea: {
    backgroundColor: '#000',
    width: '100%',
    position: 'relative',
  },

  // Controls overlay
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: { flex: 1, gap: 2 },
  playerChannelName: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.TextPrimary,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.Live + '30',
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.Live + '60',
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
  qualityTag: {
    fontSize: 10,
    fontWeight: '700',
  },
  chIndexTag: {
    fontSize: 10,
    color: Colors.TextMuted,
    fontWeight: '600',
  },

  // Center controls
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  channelNavBtn: {
    alignItems: 'center',
    gap: 4,
  },
  navBtnInner: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    minWidth: 70,
  },
  navBtnLabel: {
    fontSize: FontSize.xs,
    color: Colors.TextSecondary,
    maxWidth: 70,
    textAlign: 'center',
  },
  playBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 2,
    borderColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nowPlaying: {
    fontSize: FontSize.sm,
    color: Colors.TextSecondary,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  // OSD
  statusOSD: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.Primary + '40',
  },
  statusOSDText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.TextPrimary,
  },

  // Tap hint
  tapHint: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  tapHintText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.3)',
  },

  // Fullscreen back button
  fsBackBtn: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info section
  infoScroll: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  infoCard: {
    backgroundColor: Colors.Surface,
    borderTopWidth: 1,
    borderTopColor: Colors.Border,
    padding: Spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoLogoWrap: {
    width: 64,
    height: 48,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.sm,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLogo: { width: '100%', height: '100%' },
  infoText: { flex: 1, gap: 4 },
  infoName: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.TextPrimary,
  },
  infoDesc: {
    fontSize: FontSize.sm,
    color: Colors.TextSecondary,
    lineHeight: 18,
  },
  infoMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  metaChipText: {
    fontSize: FontSize.xs,
    color: Colors.TextSecondary,
    fontWeight: '600',
  },

  // Related
  relatedSection: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  relatedTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.TextPrimary,
    marginBottom: 4,
  },
  relatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  relatedLogo: {
    width: 48,
    height: 36,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: Radius.sm,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedLogoImg: { width: '100%', height: '100%' },
  relatedInfo: { flex: 1, gap: 2 },
  relatedName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.TextPrimary,
  },
  relatedShow: {
    fontSize: FontSize.xs,
    color: Colors.TextMuted,
  },
  relatedLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  relatedLiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.Live,
  },
});
