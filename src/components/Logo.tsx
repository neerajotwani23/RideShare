import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium' 
}) => {
  const logoWidth = {
    small: screenWidth * 0.7,   // 70% of screen width
    medium: screenWidth * 1.0,  // 100% of screen width
    large: screenWidth * 1.2,   // 120% of screen width
  };
  
  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image 
        source={require('../assets/images/logo.png')} 
        style={[
          styles.logoImage, 
          { 
            width: logoWidth[size],
            height: undefined,
            aspectRatio: 1, // Maintain square aspect ratio
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  logoImage: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Logo; 