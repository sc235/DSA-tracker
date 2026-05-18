export const Theme = {
  colors: {
    primary: '#6366F1', 
    secondary: '#8B5CF6', 
    background: '#0F172A', 
    surface: '#1E293B', 
    surfaceLight: '#334155', 
    text: '#F8FAFC', 
    textMuted: '#94A3B8', 
    success: '#10B981', 
    error: '#EF4444', 
    warning: '#F59E0B', 
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
