import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Pressable,
  ScrollView,
  Button,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  NavigationContainer,
  TabActions,
  useNavigation,
} from '@react-navigation/native';

import {
  Provider as PaperProvider,
  useTheme,
  Text as PaperText,
} from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as SMS from 'expo-sms';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MessagesScreen from './pages/Messages/MessagesListScreen';
import NewMessageScreen from './pages/Messages/NewMessageScreen/NewMessageScreen';
import NewMessageScreenPaper from './pages/Messages/NewMessageScreen';
import MessageDetailsScreen from './pages/Messages/MessageDetailsScreen';
import Events from './pages/Events/Events';
import Settings from './pages/Settings';
import HomeScreen from './pages/Home';
import GlobalContextProvider, { useAppStateContext } from './store/context';
import { PreferencesContext } from './utils/theme';
import Background from './components/shared/LinearGradientBackground';

// to ensure that splash screen will be kept visible until hideAsync() got called when finishing loading all the assets and fetching data and rendering a component
SplashScreen.preventAutoHideAsync();

export default function AppWithContext() {
  // should move loading state to the reducer
  const [status, setStatus] = useState('');
  const {
    state,
    initializeApp,
    createNewMessage,
    editMessageHandler,
    updateEventHandler,
    handleNotificationClick,
  } = useAppStateContext();
  console.log('@App -- state =', state);
  const theme = useTheme();

  // using useEffect to initialize the app because restoring data from db is async and if called it outside the component (in the App file directly) then after all the sync code runs the async code will run but we need the app component get rerendered after the data gets fetched and state populated - also I'm relaying on the context as a global state store and to access the functions that handles the state we need to do it from inside a component that is managed by react -
  useEffect(() => {
    async function startApp() {
      console.log(
        '@useEffect @AppWithContext @App @startApp --- will initialize database and populate state'
      );

      // initialize the database tables with the base tables structure and fetch data from them and populate global state with the data
      // I think as we are in the same useEffect the state update will be batched/scheduled and for that after calling initializeApp() the sate should be updated but this new state snapshot won't be available in this useEffect scope and for that in order to be able to process events after initializing the app and retrieving data we can either use another useEffect that will be fired after this one  or get the data back from initializeApp() and process it and this is what i'll do here
      const data = await initializeApp();
      console.log(
        "@useEffect @AppWithContext @App --- finished initializing and populating state --- will check and update events' states",
        state
      );
      // check any event that is not settled (not success nor failure) and update their states
      console.log('*-*-*-*-*- data =', data);
      await reEvaluateEvents(
        data.events.filter(
          (event) => !(event.state === 'success' || event.state === 'failure')
        ),
        updateEventHandler
      );
      console.log(
        "@useEffect @AppWithContext @App --- finished updating events' states --- will hide splash"
      );

      SplashScreen.hideAsync();
    }

    startApp();
    // // initialize the database tables with the base tables structure
    // console.log('@useEffect @AppWithContext @App --- for initializing');
    // initializeApp().then((res) => {
    //   console.log(
    //     '@useEffect @AppWithContext @App --- for initializing --- finished initializing and will hide splash'
    //   );
    //   SplashScreen.hideAsync();
    // });
  }, []);

  // register an event listener to handle the any notification that was received this one isn't related to the user interaction to the notification
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      // this will be triggered if the app is in the foreground but if it's in the background or killed it won't be triggered at all (based on experiment when app is in the background and a notification got triggered if app then comes to foreground this function won't be triggered also - so we can't rely on this function to convert the event state/color to warning when inTimeNotification triggers)
      // we can update the event state/color to warning and then if user pressed on the event card or the notification the the state will be changed to success - if the notification were never pressed nor the event card then by the arrival of the last notification (after1DayNotification) the state should be changed/color should be changed to failure/red
      // as this function isn't reliable then we need to run a function every time the app runs to check for each event state by checking for each event with scheduled state if there are inTimeNotification scheduled which means that this event is still scheduled otherwise check if there is a 2-hoursNotification or 1-dayNotification then update event state to warning with appropriate message and if there are no scheduled messages at all and the event is still have scheduled state then we will assume that user received and dismissed all the notification and so the event will be marked failure/red state
      (notification) => {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log(notification);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ response to notification received'
        );
        console.log(response);
        console.log(new Date(response.notification.date).toString());
        // response.notification.date -- contains the time when user clicked on the notification
        // response.notification.request.content.data -- contains the data that was passed to the notifications currently {messageId}
        const { messageId } = response.notification.request.content.data;
        // response.notification.request.identifier -- contains the notification identifier
        const { identifier } = response.notification.request;
        // 1- using any of the above data we can find the remaining notifications for this message event and then cancel any upcoming notification for this event
        // 2- check if the message will be repeated then create a new event and new notifications for the upcoming sending date of the same message
        // 3- redirect user to sms app to send the message and then mark this event as successful

        // the main assumption now that when user clicks the notification the app will open and then initiate and populate state and then this listener will fired
        // clear the remaining notifications by getting the event id and then call clear function for all notifications
        handleNotificationClick({
          messageId,
          clickedNotificationIdentifier: identifier,
        })
          .then(({ addresses, message }) => {
            console.log(
              'success handling notification click and will send sms'
            );
            SMS.sendSMSAsync(addresses, message);
          })
          .catch((error) =>
            console.log("couldn't send the sms -- there was an error --", error)
          );
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, [handleNotificationClick]);

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
    // if (true) {
    console.log('@AppWithContext @App --- rendering --- error =', state.error);

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}
      >
        <PaperText variant="headlineMedium">
          Something went wrong!{'\n'}Try restarting the App or contacting
          support
        </PaperText>
        <PaperText variant="bodyLarge">{state.error}</PaperText>
      </View>
    );
  }

  console.log('@AppWithContext @App --- rendering ');

  return (
    <>
      {/* <SafeAreaView style={styles.appContainer}> */}
      <TopTab.Navigator
        // sceneContainerStyle={{ paddingBottom: 40 }}
        tabBarPosition="bottom"
        screenOptions={{
          tabBarLabelStyle: { fontSize: 10, padding: 0, margin: 0 },
          tabBarStyle: {
            backgroundColor: theme.colors.primaryContainer,
            // height: '9%',
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.customGrey,
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          // wanted to show the indicator on the top but
          tabBarIndicatorContainerStyle: { height: 2 },
          // tabBarContentContainerStyle: { width: 120, height: 70 },
          // tabBarItemStyle: { alignItems: 'center' },
          tabBarIconStyle: {
            width: 28,
            height: 28,
            // paddingBottom: -30,
            // flex: 1,
            // justifyContent: 'flex-end',
            // alignItems: 'flex-start',
          },
        }}
      >
        <TopTab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => {
              return focused ? (
                <MaterialCommunityIcons name="home" size={30} color={color} />
              ) : (
                <MaterialCommunityIcons
                  name="home-outline"
                  size={30}
                  color={color}
                />
              );
            },
          }}
        />
        <TopTab.Screen
          name="Messages"
          component={MessagesStackScreen}
          options={({ route, navigation }) => ({
            // headerTitle: getFocusedRouteNameFromRoute(route),
            // headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return focused ? (
                <MaterialCommunityIcons
                  name="email-multiple"
                  size={28}
                  color={color}
                />
              ) : (
                <MaterialCommunityIcons
                  name="email-multiple-outline"
                  size={28}
                  color={color}
                />
              );
            },
          })}
        />

        <TopTab.Screen
          name="Events"
          component={EventsTabScreen}
          options={{
            // title: 'Events',
            tabBarIcon: ({ color, focused }) => {
              return focused ? (
                <MaterialCommunityIcons
                  name="calendar"
                  size={28}
                  color={color}
                />
              ) : (
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={28}
                  color={color}
                />
              );
            },
          }}
        />

        <TopTab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ color, focused }) => {
              return focused ? (
                <MaterialCommunityIcons name="cog" size={28} color={color} />
              ) : (
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={28}
                  color={color}
                />
              );
            },
          }}
        />
      </TopTab.Navigator>
      {/* </SafeAreaView> */}
    </>
  );
  // return (
  //   <>
  //     {/* <SafeAreaView style={styles.appContainer}> */}
  //     <Tab.Navigator
  //       screenOptions={{
  //         tabBarActiveTintColor: theme.colors.onPrimary,
  //         tabBarInactiveTintColor: theme.colors.outlineVariant,
  //         tabBarStyle: {
  //           // height: '8%',
  //           paddingBottom: 5,
  //           paddingTop: 5,
  //           backgroundColor: theme.colors.primary,
  //         },
  //         headerTitleAlign: 'center',
  //         headerStyle: {
  //           // backgroundColor: '#add1e3',
  //           backgroundColor: theme.colors.primary,
  //           height: 85,
  //         },
  //         headerTitle: (props) => (
  //           <PaperText
  //             variant="headlineLarge"
  //             style={{ color: theme.colors.onPrimary }}
  //           >
  //             {props.children}
  //           </PaperText>
  //         ),
  //       }}
  //     >
  //       <Tab.Screen
  //         name="Home"
  //         component={HomeScreen}
  //         options={{
  //           title: 'Home',

  //           tabBarIcon: ({ color, size }) => (
  //             <MaterialIcons name="home" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //       <Tab.Screen
  //         name="Messages"
  //         component={MessagesStackScreen}
  //         options={({ route, navigation }) => ({
  //           // headerTitle: getFocusedRouteNameFromRoute(route),
  //           // headerShown: false,
  //           tabBarIcon: ({ color, size }) => (
  //             <MaterialIcons name="view-list" size={size} color={color} />
  //           ),
  //         })}
  //       />
  //       <Tab.Screen
  //         name="Events"
  //         component={Events}
  //         options={{
  //           tabBarIcon: ({ color, size }) => (
  //             <MaterialIcons name="event" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //       <Tab.Screen
  //         name="Settings"
  //         component={Settings}
  //         options={{
  //           tabBarIcon: ({ color, size }) => (
  //             <MaterialIcons name="settings" size={size} color={color} />
  //           ),
  //         }}
  //       />
  //     </Tab.Navigator>
  //     {/* </SafeAreaView> */}
  //   </>
  // );
}

function EventsTabScreen() {
  //
  const theme = useTheme();

  return (
    <TopTab.Navigator
      // screenOptions={{
      //   headerBackTitle: 'Events',
      //   headerTitleAlign: 'center',

      //   // headerBackVisible: true,
      //   headerStyle: { backgroundColor: theme.colors.primaryContainer },
      //   tabBarStyle: {
      //     width: '95%',
      //     alignSelf: 'center',
      //     backgroundColor: theme.colors.primaryContainer,
      //     // height: '9%',
      //   },
      //   tabBarActiveTintColor: theme.colors.primary,

      //   tabBarInactiveTintColor: theme.colors.customGrey,
      //   // tabBarInactiveTintColor: theme.colors.outlineVariant,
      //   tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
      //   tabBarItemStyle: {
      //     // borderTopLeftRadius: 10,
      //     // borderTopRightRadius: 10,
      //     // borderBottomLeftRadius: -10,
      //     // // backgroundColor: theme.colors.primaryContainer,
      //     // borderWidth: 1,
      //     // borderBottomWidth: 0,
      //   },
      // }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <TopTab.Screen
        name="Messages"
        component={() => (
          <Background
            topColor={theme.colors.primaryContainer}
            bottomColor={theme.colors.background}
          >
            <Events />
          </Background>
        )}
        options={{ headerTitle: 'Events', headerShown: true }}
      />
      <TopTab.Screen name="Calls" component={Events} />
    </TopTab.Navigator>
  );
}

// custom tabBar
function MyTabBar({ state, descriptors, navigation, position }) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        // width: '95%',
        alignSelf: 'center',
        // borderWidth: 1,
        // padding: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);

        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0.4)),
        });

        // const color =

        return (
          <Background
            bottomColor={theme.colors.primaryContainer}
            topColor={theme.colors.background}
            style={{ width: '50%', height: 70 }}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                // borderTopRightRadius: 50,
                // borderTopLeftRadius: 50,
                // borderWidth: 1,
                // borderBottomWidth: 0,
                // padding: 15,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animated.Text
                style={{ opacity, fontSize: 20, fontWeight: '500' }}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          </Background>
        );
      })}
    </View>
  );
}

/**function will check events and update their state based on the notifications which were sent to user it should be called for the upcoming events only - will accept a list of events and a callback function to be called (which will be the state updating function 'dispatch') */
async function reEvaluateEvents(eventsList, callback) {
  // get all scheduled notifications for the app to use in checking if a notification was sent or not
  const allUpcomingNotifications =
    await Notifications.getAllScheduledNotificationsAsync();
  // will group the updates of states of events to so that each state update will map to list of ids
  const warning = [];
  const warning2Hours = [];
  const warning1Day = [];
  const success = [];
  const failure = [];
  console.log(
    '@App @reEvaluateEvents -- before looping over events -- eventsList =',
    eventsList
  );
  console.log(allUpcomingNotifications);
  // loop over all events and check the current state of notifications
  for (const event of eventsList) {
    // if there is an upcoming inTime notification for this event another check will be done to check if the time to send is less than 1 hour to give the event warning state
    console.log(
      '@App @reEvaluateEvents -- looping over events -- event.id =',
      event.id,
      'inTimeNotificationIdentifier =',
      event.notificationId.inTimeNotificationIdentifier
    );
    console.log(
      (new Date(event.sentOn).getTime() - new Date().getTime()) / (1000 * 60)
    );
    if (
      allUpcomingNotifications.some(
        (el) =>
          el.identifier === event.notificationId.inTimeNotificationIdentifier &&
          (new Date(event.sentOn).getTime() - new Date().getTime()) /
            (1000 * 60) <=
            60
      )
    ) {
      console.log(
        '******************** in case of finding inTime notification and time less than 1 hour should be pushed to warning'
      );
      // not to update an event with the same exact state again
      event.state !== 'warning' && warning.push(event.id);
      continue;
    }
    if (
      // this means that the time for the notification to get triggered is more than 1 hour and thus event should stay in scheduled state
      allUpcomingNotifications.some(
        (el) =>
          el.identifier === event.notificationId.inTimeNotificationIdentifier
      )
    ) {
      // do nothing as we only want to break out without modifying the event state
      console.log(
        '******************** in case of time more than 1 hour should do nothing'
      );
      continue;
    }
    if (
      allUpcomingNotifications.some(
        (el) =>
          el.identifier ===
          event.notificationId.after2HoursNotificationIdentifier
      )
    ) {
      console.log(
        '******************** in case of finding 2hours notification should be pushed to warning2Hours'
      );
      // not to update an event with the same exact state again
      event.state !== 'warning2Hours' && warning2Hours.push(event.id);
      continue;
    }
    if (
      allUpcomingNotifications.some(
        (el) =>
          el.identifier === event.notificationId.after1DayNotificationIdentifier
      )
    ) {
      console.log(
        '******************** in case of finding 1day notification should be pushed to warning1Day'
      );
      // not to update an event with the same exact state again
      event.state !== 'warning1Day' && warning1Day.push(event.id);
      continue;
    }
    console.log(
      '******************** in case of no notification found should be pushed to failure'
    );
    // if there no notification identifier was found in the upcoming notification this will mean that user should have already received the notifications but didn't click any of them and thus this event will be marked as fail, cause whenever the user press the notification and event listener should handle it and mark event as success
    failure.push(event.id);
  }

  // after checking the notifications we need to update the events in db and repopulate the state
  await callback({
    warning,
    warning2Hours,
    warning1Day,
    failure,
  });
  console.log(
    '@App @reEvaluateEvents -- after saving updated events in db and repopulate the state'
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
