import React from 'react';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const PreferencesContext = React.createContext({
  // theme: CombinedDefaultTheme,
  toggleTheme: () => {},
  isThemeDark: false,
});

const target = 'rgb(74, 129, 163)';
const start = '#1a3e88';

const lightColors = {
  colors: {
    primary: 'rgb(58, 91, 169)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(218, 226, 255)',
    onPrimaryContainer: 'rgb(0, 24, 71)',
    secondary: 'rgb(88, 94, 113)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(220, 226, 249)',
    onSecondaryContainer: 'rgb(21, 27, 44)',
    tertiary: 'rgb(115, 84, 113)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(254, 215, 249)',
    onTertiaryContainer: 'rgb(43, 18, 43)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(254, 251, 255)',
    onBackground: 'rgb(27, 27, 31)',
    surface: 'rgb(254, 251, 255)',
    onSurface: 'rgb(27, 27, 31)',
    surfaceVariant: 'rgb(225, 226, 236)',
    onSurfaceVariant: 'rgb(69, 70, 79)',
    outline: 'rgb(117, 119, 128)',
    outlineVariant: 'rgb(197, 198, 208)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(48, 48, 52)',
    inverseOnSurface: 'rgb(242, 240, 244)',
    inversePrimary: 'rgb(178, 197, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(244, 243, 251)',
      level2: 'rgb(238, 238, 248)',
      level3: 'rgb(232, 233, 246)',
      level4: 'rgb(231, 232, 245)',
      level5: 'rgb(227, 229, 243)',
    },
    surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
    backdrop: 'rgba(46, 48, 56, 0.4)',
    customGrey: 'grey',
  },
};

const darkColors = {
  colors: {
    primary: 'rgb(191, 194, 255)',
    onPrimary: 'rgb(24, 29, 140)',
    primaryContainer: 'rgb(50, 57, 163)',
    onPrimaryContainer: 'rgb(224, 224, 255)',
    secondary: 'rgb(197, 196, 221)',
    onSecondary: 'rgb(46, 47, 66)',
    secondaryContainer: 'rgb(68, 69, 89)',
    onSecondaryContainer: 'rgb(225, 224, 249)',
    tertiary: 'rgb(232, 185, 213)',
    onTertiary: 'rgb(70, 38, 59)',
    tertiaryContainer: 'rgb(94, 60, 82)',
    onTertiaryContainer: 'rgb(255, 216, 238)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(27, 27, 31)',
    onBackground: 'rgb(229, 225, 230)',
    surface: 'rgb(27, 27, 31)',
    onSurface: 'rgb(229, 225, 230)',
    surfaceVariant: 'rgb(70, 70, 79)',
    onSurfaceVariant: 'rgb(199, 197, 208)',
    outline: 'rgb(145, 143, 154)',
    outlineVariant: 'rgb(70, 70, 79)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(229, 225, 230)',
    inverseOnSurface: 'rgb(48, 48, 52)',
    inversePrimary: 'rgb(75, 83, 188)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(35, 35, 42)',
      level2: 'rgb(40, 40, 49)',
      level3: 'rgb(45, 45, 56)',
      level4: 'rgb(47, 47, 58)',
      level5: 'rgb(50, 50, 62)',
    },
    surfaceDisabled: 'rgba(229, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(229, 225, 230, 0.38)',
    backdrop: 'rgba(48, 48, 56, 0.4)',
    customGrey: 'lightgrey',
  },
};

export const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,

  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...lightColors.colors,
  },
};

export const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,

  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...darkColors.colors,
  },
};
