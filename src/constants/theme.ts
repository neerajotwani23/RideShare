import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { COLORS } from './colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.accent,        // Blue (#248CFE)
    secondary: COLORS.success,     // Blue (#248CFE)
    background: COLORS.primary,    // White (#FFFFFF)
    surface: COLORS.primary,       // White (#FFFFFF)
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
  roundness: 16, // Increased roundness for more rounded input boxes
};

export default theme; 