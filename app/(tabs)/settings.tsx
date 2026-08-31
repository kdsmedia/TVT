import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';

interface SettingItem {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  desc?: string;
  type: 'nav' | 'toggle' | 'info';
  value?: boolean;
  color?: string;
}

const SETTINGS: { section: string; items: SettingItem[] }[] = [
  {
    section: 'Pemutaran',
    items: [
      { id: 'quality', icon: 'hd', label: 'Kualitas Default', desc: 'Otomatis (Disarankan)', type: 'nav', color: Colors.Primary },
      { id: 'buffer', icon: 'speed', label: 'Mode Buffer', desc: 'Normal', type: 'nav', color: Colors.Success },
      { id: 'autoplay', icon: 'play-arrow', label: 'Autoplay', type: 'toggle', value: true, color: Colors.Gold },
    ],
  },
  {
    section: 'Tampilan',
    items: [
      { id: 'darkmode', icon: 'dark-mode', label: 'Mode Gelap', type: 'toggle', value: true, color: Colors.Primary },
      { id: 'lang', icon: 'language', label: 'Bahasa', desc: 'Indonesia', type: 'nav', color: Colors.Warning },
    ],
  },
  {
    section: 'Tentang',
    items: [
      { id: 'version', icon: 'info', label: 'Versi Aplikasi', desc: '1.0.0', type: 'info', color: Colors.TextMuted },
      { id: 'channels', icon: 'tv', label: 'Total Channel', desc: '24 Channel', type: 'info', color: Colors.Primary },
      { id: 'support', icon: 'help', label: 'Bantuan & Dukungan', type: 'nav', color: Colors.Success },
    ],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.title}>Pengaturan</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={[Colors.Primary + '30', Colors.SurfaceCard]}
          style={styles.profileCard}
        >
          <View style={styles.avatar}>
            <MaterialIcons name="account-circle" size={52} color={Colors.Primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Pengguna TVT</Text>
            <Text style={styles.profileSub}>Paket Gratis • 24 Channel</Text>
          </View>
          <View style={styles.proChip}>
            <Text style={styles.proText}>PRO</Text>
          </View>
        </LinearGradient>

        {/* Settings sections */}
        {SETTINGS.map(section => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.section}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.settingRow,
                    index < section.items.length - 1 && styles.settingBorder,
                    pressed && item.type === 'nav' && { opacity: 0.75 },
                  ]}
                >
                  <View style={[styles.iconWrap, { backgroundColor: (item.color || Colors.Primary) + '20' }]}>
                    <MaterialIcons name={item.icon} size={20} color={item.color || Colors.Primary} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.desc ? <Text style={styles.settingDesc}>{item.desc}</Text> : null}
                  </View>
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      trackColor={{ false: Colors.Border, true: Colors.Primary + '80' }}
                      thumbColor={item.value ? Colors.Primary : Colors.TextMuted}
                    />
                  )}
                  {item.type === 'nav' && (
                    <MaterialIcons name="chevron-right" size={20} color={Colors.TextMuted} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>TVT © 2024 • Semua hak dilindungi</Text>
      </ScrollView>
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
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.TextPrimary },
  profileCard: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.Border,
    ...Shadow.card,
  },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.TextPrimary },
  profileSub: { fontSize: FontSize.sm, color: Colors.TextMuted },
  proChip: {
    backgroundColor: Colors.Gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  proText: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.Background },
  section: { marginBottom: Spacing.md, paddingHorizontal: Spacing.md },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.TextMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.Border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.Border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: { flex: 1, gap: 2 },
  settingLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.TextPrimary },
  settingDesc: { fontSize: FontSize.sm, color: Colors.TextMuted },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.TextDisabled,
    paddingVertical: Spacing.xl,
  },
});
