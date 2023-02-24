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

import MessagesScreen from './pages/MessagesScreen';
import NewMessageScreen from './pages/NewMessageScreen';
import MessageDetailsScreen from './pages/MessageDetailsScreen';
import Events from './pages/Events';
import Settings from './pages/Settings';
import HomeScreen from './pages/HomeScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { init } from './store/database';
import * as SplashScreen from 'expo-splash-screen';
import GlobalContextProvider, { useAppStateContext } from './store/context';
import { theme } from './utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();
// to ensure that splash screen will be kept visible until hideAsync() got called when finishing loading all the assets and fetching data and rendering a component
SplashScreen.preventAutoHideAsync();

export default function App() {
  //
  return (
    <GlobalContextProvider>
      <PaperProvider theme={theme}>
        <AppWithContext />
      </PaperProvider>
    </GlobalContextProvider>
  );
}

function AppWithContext() {
  // should move loading state to the reducer
  const [status, setStatus] = useState('');
  const {
    state,
    initializeApp,
    createNewMessage,
    editMessageHandler,
    updateEventHandler,
  } = useAppStateContext();
  console.log('@App -- state =', state);

  useEffect(() => {
    // initialize the database tables with the base tables structure
    // no need to await as
    console.log('@useEffect @AppWithContext @App --- for initializing');
    initializeApp().then((res) => {
      console.log(
        '@useEffect @AppWithContext @App --- for initializing --- finished initializing and will hide splash'
      );
      SplashScreen.hideAsync();
    });
  }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   console.log('@onLayoutRootView --- before checking status ---', status);
  //   if (status === 'success') {
  //     console.log('@onLayoutRootView --- checking status ---', status);
  //     await SplashScreen.hideAsync();
  //   }
  // }, [status]);

  // neither <View onLayout> nor <NavigationContainer onReady> works with onLayoutView so using useEffect to monitor status and hide the splash screen when needed (discord's expo advice)
  // useEffect(() => {
  //   if (state.status === 'success' || state.status === 'error') {
  //     SplashScreen.hideAsync();
  //   }
  // }, [state.status]);

  // console.log('status ===', status);

  if (state.status === 'error') {
    console.log('@AppWithContext @App --- rendering --- error =', state.error);
    return (
      <View>
        <Text>
          Something went wrong! Try restarting the App or contacting support
        </Text>
        <Text>{state.error}</Text>
      </View>
    );
  }

  console.log('@AppWithContext @App --- rendering ');
  return (
    <NavigationContainer>
      {/* <SafeAreaView style={styles.appContainer}> */}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            // height: '8%',
            paddingBottom: 5,
            paddingTop: 5,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#add1e3',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesStackScreen}
          options={({ route, navigation }) => ({
            // headerTitle: getFocusedRouteNameFromRoute(route),
            // headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="view-list" size={size} color={color} />
            ),
          })}
        />
        <Tab.Screen
          name="Events"
          component={Events}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="event" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* </SafeAreaView> */}
    </NavigationContainer>
  );
}

function MessagesStackScreen({ navigation }) {
  //
  return (
    // <>
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Messages',
        headerTitleAlign: 'center',
        headerBackVisible: true,
      }}
    >
      <Stack.Screen
        name="Messages List"
        component={MessagesScreen}
        options={{ headerTitle: 'Messages', headerShown: false }}
      />
      <Stack.Screen name="New Message" component={NewMessageScreen} />
      <Stack.Screen
        name="Message Details"
        component={MessageDetailsScreen}
        options={({ route, navigation }) => {
          const { title } = route.params;
          return { headerTitle: title };
        }}
      />
    </Stack.Navigator>
    // </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 10,
  },

  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    // flex: 1,
  },

  headingText: {
    fontSize: 22,
    textTransform: 'uppercase',
    margin: 5,
    marginVertical: 10,
    fontWeight: 'bold',
  },
});
