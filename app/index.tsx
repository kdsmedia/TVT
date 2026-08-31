import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const SPLASH_DURATION = 10000;

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Menghubungkan ke server...');

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;
  const scanLine = useRef(new Animated.Value(-height)).current;

  const loadingSteps = [
    { at: 10, text: 'Memuat daftar channel...' },
    { at: 25, text: 'Mengambil data siaran langsung...' },
    { at: 45, text: 'Memeriksa koneksi stream...' },
    { at: 65, text: 'Memuat channel Indonesia...' },
    { at: 80, text: 'Memuat channel internasional...' },
    { at: 90, text: 'Hampir selesai...' },
    { at: 97, text: 'Selamat datang di TVT!' },
  ];

  useEffect(() => {
    // Logo entrance
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 12,
          stiffness: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Scan line
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: height,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: -height,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SPLASH_DURATION) * 100, 100);
      setProgress(pct);

      const step = loadingSteps.slice().reverse().find(s => pct >= s.at);
      if (step) setLoadingText(step.text);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => router.replace('/(tabs)'), 300);
      }
    }, 100);

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SPLASH_DURATION,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#020510', '#040C1E', '#070B14', '#030A18']}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Grid pattern overlay */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: i * (height / 20) }]} />
        ))}
      </View>

      {/* Scan line effect */}
      <Animated.View
        style={[styles.scanLine, { transform: [{ translateY: scanLine }] }]}
        pointerEvents="none"
      />

      {/* Center glow */}
      <Animated.View style={[styles.centerGlow, { opacity: glowPulse }]} />

      {/* TV Screen Frame */}
      <View style={styles.tvFrame}>
        <LinearGradient
          colors={[Colors.SurfaceCard, Colors.SurfaceElevated]}
          style={styles.tvScreen}
        >
          {/* Screen reflection */}
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'transparent']}
            style={styles.screenReflect}
          />

          {/* Logo area */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.Primary, '#0066FF', '#7B2FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>TVT</Text>
            </LinearGradient>
          </Animated.View>

          {/* Corner screws */}
          {['TL', 'TR', 'BL', 'BR'].map(pos => (
            <View key={pos} style={[styles.screw, styles[`screw${pos}` as keyof typeof styles] as any]} />
          ))}
        </LinearGradient>

        {/* TV Stand */}
        <View style={styles.tvStandNeck} />
        <View style={styles.tvStandBase} />
      </View>

      {/* App title */}
      <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
        <Text style={styles.title}>TVT</Text>
        <View style={styles.titleUnderline} />
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Televisi Digital Indonesia
        </Animated.Text>
      </Animated.View>

      {/* Loading section */}
      <View style={styles.loadingSection}>
        <Text style={styles.loadingText}>{loadingText}</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <LinearGradient
              colors={[Colors.Primary, '#00FFAA', Colors.Primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Shimmer */}
            <View style={styles.progressShimmer} />
          </Animated.View>
        </View>

        <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
      </View>

      {/* Bottom info */}
      <Text style={styles.versionText}>TVT v1.0 • All Channels Indonesia & International</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020510',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,191,255,0.04)',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'transparent',
  },
  centerGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.Primary + '15',
  },
  tvFrame: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  tvScreen: {
    width: 200,
    height: 140,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.BorderLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 20,
  },
  screenReflect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(0,191,255,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  screw: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.BorderLight,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  screwTL: { top: 8, left: 8 },
  screwTR: { top: 8, right: 8 },
  screwBL: { bottom: 8, left: 8 },
  screwBR: { bottom: 8, right: 8 },
  tvStandNeck: {
    width: 20,
    height: 24,
    backgroundColor: Colors.SurfaceElevated,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.Border,
  },
  tvStandBase: {
    width: 90,
    height: 12,
    backgroundColor: Colors.SurfaceCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.TextPrimary,
    letterSpacing: 12,
    textShadowColor: Colors.Primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  titleUnderline: {
    width: 80,
    height: 3,
    backgroundColor: Colors.Primary,
    borderRadius: 2,
    marginTop: 4,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.TextMuted,
    letterSpacing: 2,
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
  },
  loadingSection: {
    width: width * 0.75,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.TextSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.SurfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressShimmer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 3,
  },
  progressPct: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.Primary,
    letterSpacing: 1,
  },
  versionText: {
    position: 'absolute',
    bottom: 32,
    fontSize: FontSize.xs,
    color: Colors.TextDisabled,
    letterSpacing: 0.5,
  },
});
