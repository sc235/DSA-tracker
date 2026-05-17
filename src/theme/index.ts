export const Theme = {
  colors: {
    primary: '#6366F1', // Indigo 500
    secondary: '#8B5CF6', // Violet 500
    background: '#0F172A', // Slate 900 (The exact dark color from the image)
    surface: '#1E293B', // Slate 800
    surfaceLight: '#334155', // Slate 700
    text: '#F8FAFC', // Slate 50
    textMuted: '#94A3B8', // Slate 400
    success: '#10B981', // Emerald 500
    error: '#EF4444', // Red 500
    warning: '#F59E0B', // Amber 500
    border: 'rgba(148, 163, 184, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
  }
};
