import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF', // Primary blue from Figma
    secondary: '#34C759', // Secondary green
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    onSurface: '#000000',
    outline: '#E5E5EA',
    surfaceVariant: '#F2F2F7',
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