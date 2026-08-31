import { StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from './theme';

export const CommonStyles = StyleSheet.create({
  flex1: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  screenBg: { flex: 1, backgroundColor: Colors.Background },
  card: {
    backgroundColor: Colors.SurfaceCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.Border,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});
