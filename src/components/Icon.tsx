import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleProp, ViewStyle } from 'react-native';

// You can add more icon families here if needed
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#0A80ED',
  style,
}) => {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default Icon; 