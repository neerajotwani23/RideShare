import React from 'react';
import { Button } from 'react-native-paper';
import { COLORS } from '../constants/colors';

interface CustomButtonProps {
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  labelStyle?: any;
  buttonColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: (props: any) => React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  style,
  contentStyle,
  labelStyle,
  buttonColor = COLORS.secondary,
  textColor = COLORS.primary,
  disabled = false,
  loading = false,
  icon,
}) => {
  const defaultContentStyle = {
    paddingVertical: 12,
    ...contentStyle,
  };

  const defaultLabelStyle = {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    color: mode === 'contained' ? COLORS.primary : COLORS.secondary,
    ...labelStyle,
  };

  const defaultStyle = {
    borderRadius: 18,
    marginVertical: 4,
    ...style,
  };

  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={defaultStyle}
      contentStyle={defaultContentStyle}
      labelStyle={defaultLabelStyle}
      buttonColor={buttonColor}
      textColor={textColor}
      disabled={disabled}
      loading={loading}
      icon={icon}
    >
      {children}
    </Button>
  );
};

export default CustomButton; 