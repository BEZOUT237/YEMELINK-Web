export const theme = {
  colors: {
    primary: '#00bcd4',
    secondary: '#0a0f1a',
    background: '#0a0f1a',
    surface: '#1a2035',
    surfaceLight: '#242f45',
    text: '#ffffff',
    textSecondary: '#b3b9c9',
    muted: '#6b7280',
    border: '#2d3a52',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  fonts: {
    primary: '"Inter", system-ui, sans-serif',
    secondary: '"Poppins", system-ui, sans-serif',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
  },
  typography: {
    h1: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    h2: {
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: '1.3',
    },
    h3: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '1.4',
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '1.6',
    },
    small: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '1.5',
    },
    tiny: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '1.4',
    },
  },
  shadows: {
    soft: '0 12px 30px rgba(10,15,26,0.6)',
    glow: '0 0 20px rgba(0,188,212,0.3)',
    elevated: '0 20px 50px rgba(0,0,0,0.5)',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  animations: {
    duration: {
      fast: 200,
      normal: 400,
      slow: 600,
    },
    easing: {
      easeInOut: 'cubic-bezier(.4,0,.2,1)',
      easeOutCubic: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
    },
  },
} as const;

export default theme;
