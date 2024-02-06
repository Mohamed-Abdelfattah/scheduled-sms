import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Svg, { Defs, Rect, LinearGradient, Stop } from 'react-native-svg';

// const FROM_COLOR = 'rgb(255, 255, 255)';
// const TO_COLOR = 'rgb(0,102,84)';

export default function Background({ children, style, topColor, bottomColor }) {
  //
  const theme = useTheme();

  return (
    <View style={{ flex: 1, zIndex: -1, ...style }}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={topColor} />
            <Stop offset="1" stopColor={bottomColor} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
