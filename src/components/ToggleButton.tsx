import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  style?: any;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  isActive,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.toggleButton,
        isActive && styles.toggleButtonActive,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.toggleText,
        isActive && styles.toggleTextActive,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold',
  },
});

export default ToggleButton; 