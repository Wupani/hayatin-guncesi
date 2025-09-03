import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: number;
  style?: any;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 32, style }) => {
  return (
    <Image
      source={require('../../assets/iOS/icon_1024x1024.png')}
      style={[
        styles.logo,
        { width: size, height: size },
        style
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    borderRadius: 8,
  },
});

export default AppLogo; 