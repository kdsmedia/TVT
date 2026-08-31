// TVT - Design Tokens
export const Colors = {
  // Base
  Background: '#070B14',
  Surface: '#0D1526',
  SurfaceElevated: '#111D35',
  SurfaceCard: '#152040',
  Border: '#1E2D4A',
  BorderLight: '#243555',

  // Brand
  Primary: '#00BFFF',
  PrimaryDark: '#0088CC',
  PrimaryGlow: 'rgba(0,191,255,0.25)',
  Gold: '#FFD700',
  GoldDim: '#CC9900',
  GoldGlow: 'rgba(255,215,0,0.2)',

  // Semantic
  Success: '#00E676',
  Warning: '#FFB300',
  Error: '#FF3D71',
  Live: '#FF1744',
  LiveGlow: 'rgba(255,23,68,0.3)',

  // Text
  TextPrimary: '#FFFFFF',
  TextSecondary: '#A0BCDE',
  TextMuted: '#5A7A9E',
  TextDisabled: '#2E4A6A',

  // Gradient stops
  GradientStart: '#070B14',
  GradientMid: '#0D1A30',
  GradientEnd: '#0A1220',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const Shadow = {
  card: {
    shadowColor: '#00BFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardActive: {
    shadowColor: '#00BFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
  gold: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
};
