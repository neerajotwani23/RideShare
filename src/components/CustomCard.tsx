import React from 'react';
import { Card } from 'react-native-paper';
import { COLORS } from '../constants/colors';

interface CustomCardProps {
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
  onPress?: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  style,
  contentStyle,
  onPress,
}) => {
  const defaultStyle = {
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 8,
    ...style,
  };

  const defaultContentStyle = {
    padding: 16,
    ...contentStyle,
  };

  return (
    <Card
      style={defaultStyle}
      contentStyle={defaultContentStyle}
      onPress={onPress}
    >
      <Card.Content>
        {children}
      </Card.Content>
    </Card>
  );
};

export default CustomCard; 