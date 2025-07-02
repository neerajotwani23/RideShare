import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// You can add more icon families here if needed
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
  family?: 'material' | 'fontawesome6' | 'evilicons'; // For future expansion
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000000', 
  style,
  family = 'material' // Default to MaterialCommunityIcons
}) => {
  // For now, we only use MaterialCommunityIcons
  // In the future, you can expand this to support multiple icon families
  switch (family) {
    case 'material':
    default:
      return (
        <MaterialCommunityIcons 
          name={name} 
          size={size} 
          color={color} 
          style={style}
        />
      );
    // case 'fontawesome6':
    //   return (
    //     <FontAwesome6 
    //       name={name} 
    //       size={size} 
    //       color={color} 
    //       style={style}
    //     />
    //   );
    // case 'evilicons':
    //   return (
    //     <EvilIcons 
    //       name={name} 
    //       size={size} 
    //       color={color} 
    //       style={style}
    //     />
    //   );
  }
};

export default Icon; 