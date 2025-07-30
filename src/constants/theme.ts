import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';

// Light theme
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.accent,
    secondary: lightColors.success,
    background: lightColors.primary,
    surface: lightColors.primary,
    onSurface: lightColors.textPrimary,
    outline: lightColors.border,
    surfaceVariant: lightColors.lightGray,
    error: lightColors.error,
    disabled: lightColors.disabled,
    onPrimary: lightColors.primary,
    onSecondary: lightColors.primary,
    onBackground: lightColors.textPrimary,
    onSurfaceVariant: lightColors.textSecondary,
  },
  roundness: 16,
};

// Dark theme
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.accent,
    secondary: darkColors.success,
    background: darkColors.primary,
    surface: darkColors.primary,
    onSurface: darkColors.textPrimary,
    outline: darkColors.border,
    surfaceVariant: darkColors.lightGray,
    error: darkColors.error,
    disabled: darkColors.disabled,
    onPrimary: darkColors.primary,
    onSecondary: darkColors.primary,
    onBackground: darkColors.textPrimary,
    onSurfaceVariant: darkColors.textSecondary,
  },
  roundness: 16,
};

// Hook to get theme based on current color scheme
export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

// Default export for backward compatibility (uses light theme)
export default lightTheme; 