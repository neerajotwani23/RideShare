import React from 'react';
import { Card } from 'react-native-paper';
import { COLORS } from '../constants/colors';

interface FormCardProps {
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
}

const FormCard: React.FC<FormCardProps> = ({
  children,
  style,
  contentStyle,
}) => {
  const defaultStyle = {
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    marginBottom: 24,
    ...style,
  };

  const defaultContentStyle = {
    padding: 28,
    ...contentStyle,
  };

  return (
    <Card style={defaultStyle}>
      <Card.Content style={defaultContentStyle}>
        {children}
      </Card.Content>
    </Card>
  );
};

export default FormCard; 