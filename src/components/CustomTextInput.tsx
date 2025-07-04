import React from 'react';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../constants/colors';

interface CustomTextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  contentStyle?: any;
  left?: React.ReactNode;
  right?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  contentStyle,
  left,
  right,
  error = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
}) => {
  const defaultStyle = {
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    ...style,
  };

  const defaultContentStyle = {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: COLORS.secondary,
    ...contentStyle,
  };

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={defaultStyle}
      contentStyle={defaultContentStyle}
      mode="outlined"
      outlineColor={error ? COLORS.error : COLORS.border}
      activeOutlineColor={COLORS.accent}
      left={left}
      right={right}
      error={error}
      disabled={disabled}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
};

export default CustomTextInput; 