import { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessagesScreen from './pages/MessagesScreen';
import NotificationCard from './components/NotificationCard';
import ButtonPrimaryOutline from './components/shared/Button';
import Hr from './components/shared/Hr';
import MessageCard from './components/MessageCard';
import NewMessageScreen from './pages/NewMessageScreen';
import MessageDetailsScreen from './pages/MessageDetailsScreen';

const notificationsFake = [
  {
    id: 'notification-1',
    messageId: 'message-1',
    messageTitle: 'Message Title - 1',
    sentOn: 'dateOfSendingAttempt-1',
    state: 'success',
  },
  {
    id: 'notification-2',
    messageId: 'message-2',
    messageTitle: 'Message Title - 2',
    sentOn: 'dateOfSendingAttempt-2',
    state: 'fail',
  },
  {
    id: 'notification-3',
    messageId: 'message-3',
    messageTitle: 'Message Title - 3',
    sentOn: 'dateOfSendingAttempt-3',
    state: 'inProgress',
  },
  {
    id: 'notification-4',
    messageId: 'message-4',
    messageTitle: 'Message Title - 4',
    sentOn: 'dateOfSendingAttempt-4',
    state: 'scheduled',
  },
  {
    id: 'notification-5',
    messageId: 'message-5',
    messageTitle: 'Message Title - 5',
    sentOn: 'dateOfSendingAttempt-5',
    state: 'success',
  },
];

const messagesFake = [
  {
    id: 'message-1',
    title: 'title-1',
    content:
      'content-1 -- content-1 -- content-1 -- content-1 -- content-1 -- content-1',
    to: [{ name: 'contactName-1', number: 'contactNumber-1' }],
    rules: { scheduledOn: 'date-1', repeat: 'boolean' },
  },
  {
    id: 'message-2',
    title: 'title-2',
    content:
      'content-2 -- content-2 -- content-2 -- content-2 -- content-2 -- content-2',
    to: [{ name: 'contactName-2', number: 'contactNumber-2' }],
    rules: { scheduledOn: 'date-2', repeat: 'boolean' },
  },
  {
    id: 'message-3',
    title: 'title-3',
    content:
      'content-3 -- content-3 -- content-3 -- content-3 -- content-3 -- content-3',
    to: [
      { name: 'contactName-3', number: 'contactNumber-3' },
      { name: 'contactName-3', number: 'contactNumber-3' },
      { name: 'contactName-3', number: 'contactNumber-3' },
    ],
    rules: { scheduledOn: 'date-3', repeat: 'boolean' },
  },
  {
    id: 'message-4',
    title: 'title-4',
    content:
      'content-4 -- content-4 -- content-4 -- content-4 -- content-4 -- content-4',
    to: [
      { name: 'contactName-4', number: 'contactNumber-4' },
      { name: 'contactName-4', number: 'contactNumber-4' },
    ],
    rules: { scheduledOn: 'date-4', repeat: 'boolean' },
  },
  {
    id: 'message-5',
    title: 'title-5',
    content:
      'content-5 -- content-5 -- content-5 -- content-5 -- content-5 -- content-5',
    to: [{ name: 'contactName-5', number: 'contactNumber-5' }],
    rules: { scheduledOn: 'date-5', repeat: 'boolean' },
  },
];

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  // also useNavigation hook can be used in any component to get the navigation object
  // const navigation = useNavigation();

  return (
    <ScrollView>
      {/* <View style={styles.appContainer}> */}
      {/* <View style={styles.header}></View> */}
      <StatusBar style="auto" />

      <View>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Notifications</Text>
          <ButtonPrimaryOutline label="More" icon="message-bookmark" />
        </View>
        <FlatList
          data={notificationsFake}
          renderItem={(itemData) => {
            return <NotificationCard data={itemData.item} />;
          }}
          // not needed as in the docs "The default extractor checks item.key, then item.id, and then falls back to using the index, like React does."
          // checked on devTools ... id is used by default
          // keyExtractor={(item, index) => item.messageTitle}
          horizontal
        />
      </View>

      <Hr marginV={10} color="#333" marginH={5} />

      <View style={styles.messages}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Messages</Text>
          <View style={{ flexDirection: 'row' }}>
            <ButtonPrimaryOutline
              label="ADD"
              icon="message-plus"
              onPress={() => {
                // console.log('button was pressed ');
                navigation.navigate('New Message');
              }}
            />
            <ButtonPrimaryOutline
              label="MORE"
              icon="message-bookmark"
              onPress={() => {
                console.log('button was pressed ');
                navigation.navigate('Messages');
              }}
            />
          </View>
        </View>
        <FlatList
          data={messagesFake}
          renderItem={MessageCard}
          // not needed as in the docs "The default extractor checks item.key, then item.id, and then falls back to using the index, like React does."
          keyExtractor={(item, index) => item.id}
          horizontal
        />
      </View>

      <View style={styles.logs}></View>

      <View style={styles.navigation}></View>
      {/* </View> */}
    </ScrollView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      {/* <SafeAreaView style={styles.appContainer}> */}
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Overview' }}
        />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="New Message" component={NewMessageScreen} />
        <Stack.Screen name="Message Details" component={MessageDetailsScreen} />
      </Stack.Navigator>
      {/* </SafeAreaView> */}
    </NavigationContainer>
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
