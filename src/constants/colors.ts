import { useColorScheme } from 'react-native';

// Light theme colors
export const lightColors = {
  // Backgrounds
  primary: '#FFFFFF',           // Main background
  lightGray: '#F2F2F7',         // Surface variant
  disabled: '#E5E5EA',          // Disabled state
  transparent: 'transparent',   // Transparent

  // Text colors
  textPrimary: '#000000',       // Primary text
  textSecondary: '#808080',     // Secondary text
  textTertiary: '#A0A0A0',      // Tertiary text

  // Accent colors
  secondary: '#0A80ED',         // Primary blue
  accent: '#0A80ED',            // Accent blue
  success: '#34C759',           // Success green
  error: '#FF3B30',             // Error red
  warning: '#FF9500',           // Warning orange

  // UI elements
  border: '#E5E5EA',            // Borders
  cardBackground: '#FFFFFF',    // Card backgrounds
  inputBackground: '#FFFFFF',   // Input backgrounds
};

// Dark theme colors
export const darkColors = {
  // Backgrounds
  primary: '#000000',           // Main background
  lightGray: '#1C1C1E',         // Surface variant
  disabled: '#3A3A3C',          // Disabled state
  transparent: 'transparent',   // Transparent

  // Text colors
  textPrimary: '#FFFFFF',       // Primary text
  textSecondary: '#A0A0A0',     // Secondary text
  textTertiary: '#808080',      // Tertiary text

  // Accent colors
  secondary: '#0A80ED',         // Primary blue
  accent: '#0A80ED',            // Accent blue
  success: '#34C759',           // Success green
  error: '#FF453A',             // Error red
  warning: '#FF9F0A',           // Warning orange

  // UI elements
  border: '#38383A',            // Borders
  cardBackground: '#1C1C1E',    // Card backgrounds
  inputBackground: '#1C1C1E',   // Input backgrounds
};

// Hook to get colors based on current theme
export const useColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
};

// Default export for backward compatibility (uses light theme)
export const COLORS = lightColors;

export default COLORS;
