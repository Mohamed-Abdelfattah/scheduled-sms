import React, { useCallback, useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Pressable,
  ScrollView,
  Button,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  TabActions,
  useNavigation,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as SMS from 'expo-sms';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MessagesScreen from './pages/MessagesScreen';
import NewMessageScreen from './pages/NewMessageScreen';
import MessageDetailsScreen from './pages/MessageDetailsScreen';
import Events from './pages/Events';
import Settings from './pages/Settings';
import HomeScreen from './pages/HomeScreen';
import GlobalContextProvider, { useAppStateContext } from './store/context';
import {
  CombinedDefaultTheme,
  CombinedDarkTheme,
  PreferencesContext,
} from './utils/theme';
import AppWithContext from './AppWithContext';
// import {
//   // NavigationContainer,
//   DarkTheme as NavigationDarkTheme,
//   DefaultTheme as NavigationDefaultTheme,
// } from '@react-navigation/native';
// import {
//   MD3DarkTheme,
//   MD3LightTheme,
//   // Provider as PaperProvider,
//   adaptNavigationTheme,
// } from 'react-native-paper';

// console.log(NavigationDarkTheme);
// console.log(NavigationDefaultTheme);

// handle notifications
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  //
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      // theme,
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark, theme]
  );

  console.log(theme);

  return (
    <GlobalContextProvider>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <StatusBar style={isThemeDark ? 'dark' : 'light'} />
            <AppWithContext />
          </NavigationContainer>
        </PaperProvider>
      </PreferencesContext.Provider>
    </GlobalContextProvider>
  );
}
