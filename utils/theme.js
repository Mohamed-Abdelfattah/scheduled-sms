import * as React from 'react';
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

const lightColors = {
  colors: {
    primary: 'rgb(0, 104, 121)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(169, 237, 255)',
    onPrimaryContainer: 'rgb(0, 31, 38)',
    secondary: 'rgb(75, 98, 104)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(206, 231, 238)',
    onSecondaryContainer: 'rgb(6, 31, 36)',
    tertiary: 'rgb(86, 93, 126)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(221, 225, 255)',
    onTertiaryContainer: 'rgb(18, 26, 55)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(251, 252, 253)',
    onBackground: 'rgb(25, 28, 29)',
    surface: 'rgb(251, 252, 253)',
    onSurface: 'rgb(25, 28, 29)',
    surfaceVariant: 'rgb(219, 228, 231)',
    onSurfaceVariant: 'rgb(63, 72, 75)',
    outline: 'rgb(111, 121, 123)',
    outlineVariant: 'rgb(191, 200, 203)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(46, 49, 50)',
    inverseOnSurface: 'rgb(239, 241, 242)',
    inversePrimary: 'rgb(84, 215, 243)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(238, 245, 246)',
      level2: 'rgb(231, 240, 242)',
      level3: 'rgb(223, 236, 239)',
      level4: 'rgb(221, 234, 237)',
      level5: 'rgb(216, 231, 235)',
    },
    surfaceDisabled: 'rgba(25, 28, 29, 0.12)',
    onSurfaceDisabled: 'rgba(25, 28, 29, 0.38)',
    backdrop: 'rgba(41, 50, 52, 0.4)',
  },
};

const darkColors = {
  colors: {
    primary: 'rgb(87, 214, 246)',
    onPrimary: 'rgb(0, 54, 65)',
    primaryContainer: 'rgb(0, 78, 93)',
    onPrimaryContainer: 'rgb(175, 236, 255)',
    secondary: 'rgb(178, 203, 211)',
    onSecondary: 'rgb(29, 52, 58)',
    secondaryContainer: 'rgb(52, 74, 81)',
    onSecondaryContainer: 'rgb(206, 231, 239)',
    tertiary: 'rgb(192, 196, 235)',
    onTertiary: 'rgb(41, 46, 77)',
    tertiaryContainer: 'rgb(64, 69, 101)',
    onTertiaryContainer: 'rgb(222, 224, 255)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(25, 28, 29)',
    onBackground: 'rgb(225, 227, 228)',
    surface: 'rgb(25, 28, 29)',
    onSurface: 'rgb(225, 227, 228)',
    surfaceVariant: 'rgb(64, 72, 75)',
    onSurfaceVariant: 'rgb(191, 200, 203)',
    outline: 'rgb(137, 146, 149)',
    outlineVariant: 'rgb(64, 72, 75)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(225, 227, 228)',
    inverseOnSurface: 'rgb(46, 49, 50)',
    inversePrimary: 'rgb(0, 104, 123)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(28, 37, 40)',
      level2: 'rgb(30, 43, 46)',
      level3: 'rgb(32, 49, 53)',
      level4: 'rgb(32, 50, 55)',
      level5: 'rgb(34, 54, 59)',
    },
    surfaceDisabled: 'rgba(225, 227, 228, 0.12)',
    onSurfaceDisabled: 'rgba(225, 227, 228, 0.38)',
    backdrop: 'rgba(41, 50, 53, 0.4)',
  },
};

const lightTheme = { ...MD3LightTheme, ...lightColors };

const darkTheme = { ...MD3DarkTheme, ...darkColors };

export const theme = {
  ...DefaultTheme,
  ...lightColors,
  //   colors: yourGeneratedLightOrDarkScheme, // Copy it from the color codes scheme and then use it here
};
