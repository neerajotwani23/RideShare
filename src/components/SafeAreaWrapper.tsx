import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

/**
 * SafeAreaWrapper - A reusable component that provides consistent safe area handling
 * across the app. It automatically handles safe areas for different device types
 * including notched devices and devices with gesture navigation.
 * 
 * @param children - The content to be wrapped
 * @param style - Additional styles to apply to the container
 * @param edges - Which edges to apply safe area insets to (default: all edges)
 * @param backgroundColor - Background color for the safe area (default: transparent)
 */
const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = 'transparent'
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor },
        style
      ]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper; 