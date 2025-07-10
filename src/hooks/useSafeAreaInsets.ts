import { useSafeAreaInsets as useRNSSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Custom hook that provides safe area insets with additional utility functions
 * for common safe area calculations across different device types.
 * 
 * @returns Object containing safe area insets and utility functions
 */
export const useSafeAreaInsets = () => {
  const insets = useRNSSafeAreaInsets();

  return {
    ...insets,
    /**
     * Get the total height needed for a bottom tab bar
     * @param baseHeight - Base height of the tab bar (default: 60)
     * @param minPadding - Minimum padding to apply (default: 8)
     * @returns Total height including safe area bottom inset
     */
    getTabBarHeight: (baseHeight: number = 60, minPadding: number = 8) => {
      return baseHeight + Math.max(insets.bottom, minPadding);
    },

    /**
     * Get the padding bottom for a bottom tab bar
     * @param minPadding - Minimum padding to apply (default: 8)
     * @returns Padding bottom value
     */
    getTabBarPaddingBottom: (minPadding: number = 8) => {
      return Math.max(insets.bottom, minPadding);
    },

    /**
     * Get the total height needed for a header
     * @param baseHeight - Base height of the header (default: 56)
     * @returns Total height including safe area top inset
     */
    getHeaderHeight: (baseHeight: number = 56) => {
      return baseHeight + insets.top;
    },

    /**
     * Check if the device has a notch or punch-hole
     * @returns Boolean indicating if device has a notch
     */
    hasNotch: () => {
      return insets.top > 20;
    },

    /**
     * Check if the device has gesture navigation (Android)
     * @returns Boolean indicating if device has gesture navigation
     */
    hasGestureNavigation: () => {
      return insets.bottom > 0;
    },
  };
}; 