import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { COLORS } from './colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.accent,        // Emerald Green (#00C853)
    secondary: COLORS.success,     // Green (#4CAF50)
    background: COLORS.primary,    // White (#FFFFFF)
    surface: COLORS.primary,       // White (#FFFFFF)
    text: COLORS.secondary,        // Black (#000000)
    onSurface: COLORS.secondary,   // Black (#000000)
    outline: COLORS.border,        // Light Gray (#E0E0E0)
    surfaceVariant: COLORS.lightGray, // Light Gray (#F5F5F5)
    error: COLORS.error,           // Red (#E53935)
    disabled: COLORS.disabled,     // Cool Gray (#BDBDBD)
    onPrimary: COLORS.primary,     // White text on primary
    onSecondary: COLORS.primary,   // White text on secondary
    onBackground: COLORS.secondary, // Black text on background
    onSurfaceVariant: COLORS.textSecondary, // Dark Gray text on surface variant
  },
  fonts: {
    ...DefaultTheme.fonts,
    bodyLarge: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 16,
    },
    bodyMedium: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 14,
    },
    bodySmall: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
    },
    titleLarge: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: '700',
      fontSize: 22,
    },
    titleMedium: {
      fontFamily: 'Montserrat-SemiBold',
      fontWeight: '600',
      fontSize: 18,
    },
    titleSmall: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: '500',
      fontSize: 16,
    },
    labelLarge: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: '500',
      fontSize: 14,
    },
    labelMedium: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 12,
    },
    labelSmall: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '400',
      fontSize: 10,
    },
    displayLarge: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: '700',
      fontSize: 32,
    },
    displayMedium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: '700',
      fontSize: 28,
    },
    displaySmall: {
      fontFamily: 'Montserrat-SemiBold',
      fontWeight: '600',
      fontSize: 24,
    },
    headlineLarge: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: '700',
      fontSize: 28,
    },
    headlineMedium: {
      fontFamily: 'Montserrat-SemiBold',
      fontWeight: '600',
      fontSize: 24,
    },
    headlineSmall: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: '500',
      fontSize: 20,
    },
  },
  roundness: 12, // Rounded corners like in Figma
};

export default theme; 