import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// You can add more icon families here if needed
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
  family?: 'material' | 'material-community' | 'ionicons' | 'fontawesome' | 'fontawesome5';
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000000', 
  style,
  family = 'material-community' // Default to MaterialCommunityIcons
}) => {
  switch (family) {
    case 'material':
      return (
        <MaterialIcons 
          name={name} 
          size={size} 
          color={color} 
          style={style}
        />
      );
    case 'material-community':
    default:
      return (
        <MaterialCommunityIcons 
          name={name} 
          size={size} 
          color={color} 
          style={style}
        />
      );
    case 'ionicons':
      return (
        <Ionicons 
          name={name} 
          size={size} 
          color={color} 
          style={style}
        />
      );
    case 'fontawesome':
      return (
        <FontAwesome 
          name={name} 
          size={size} 
          color={color} 
          style={style}
        />
      );
    case 'fontawesome5':
      return (
        <FontAwesome5 
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