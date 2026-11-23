/**
 * @metr/ui — Precision Ledger & Flow Design Tokens
 * Exported as typed constants for shared consumption across apps/web and packages/ui.
 */

export const metrTokens = {
  name: 'Precision Ledger & Flow',
  colors: {
    primary: '#0F766E',
    primaryDeep: '#005C55',
    primaryHover: '#0D655E',
    primaryActive: '#0B544E',
    primaryFixed: '#9CF2E8',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#A3FAEF',

    secondaryNavy: '#102A43',
    secondary: '#49607C',
    secondaryContainer: '#C7DFFF',
    tertiaryMint: '#2DD4BF',
    tertiaryDeep: '#005C52',

    ink: '#172B4D',
    onSurface: '#041B3C',
    mutedText: '#526579',

    canvas: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceBright: '#F9F9FF',
    surfaceContainerLow: '#F1F3FF',
    darkSurface: '#0B1724',
    inverseSurface: '#1D3052',

    borderSubtle: '#E5EBF0',
    borderDefault: '#D7E0E8',
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
  },
  typography: {
    display: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '56px',
      fontWeight: 800,
      lineHeight: '64px',
      letterSpacing: '-0.03em',
    },
    headlineLg: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: '48px',
      letterSpacing: '-0.02em',
    },
    headlineMd: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: '36px',
      letterSpacing: '-0.015em',
    },
    headlineSm: {
      fontFamily: 'Manrope, sans-serif',
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '28px',
      letterSpacing: '-0.01em',
    },
    bodyLg: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '18px',
      fontWeight: 400,
      lineHeight: '28px',
    },
    bodyMd: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: '24px',
    },
    eyebrow: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      lineHeight: '16px',
      letterSpacing: '0.08em',
    },
  },
  radius: {
    sm: '0.25rem',
    default: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  spacing: {
    gutter: '1.5rem',
    gutterMobile: '1rem',
    margin: '3rem',
    marginMobile: '1.25rem',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },
  elevation: {
    resting: '0 1px 3px rgba(16, 42, 69, 0.04), 0 1px 2px rgba(16, 42, 69, 0.02)',
    hover: '0 10px 24px -4px rgba(16, 42, 69, 0.08), 0 4px 8px -2px rgba(16, 42, 69, 0.04)',
  },
} as const;

export type MetrTokens = typeof metrTokens;
