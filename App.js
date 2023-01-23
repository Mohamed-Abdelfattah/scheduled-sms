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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationCard from './components/NotificationCard';
import ButtonPrimaryOutline from './components/shared/Button';
import Hr from './components/shared/Hr';
import MessageCard from './components/MessageCard';

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

export default function App() {
  return (
    <SafeAreaView style={styles.appContainer}>
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
            keyExtractor={(item, index) => item.id}
            horizontal
          />
        </View>

        <Hr marginV={10} color="#333" marginH={5} />

        <View style={styles.messages}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>Messages</Text>
            <ButtonPrimaryOutline label="MORE" icon="message-bookmark" />
            <ButtonPrimaryOutline label="ADD" icon="message-draw" />
          </View>
          <FlatList
            data={messagesFake}
            renderItem={(itemData) => <MessageCard message={itemData.item} />}
            // not needed as in the docs "The default extractor checks item.key, then item.id, and then falls back to using the index, like React does."
            keyExtractor={(item, index) => item.id}
            horizontal
          />
        </View>

        <View style={styles.logs}></View>

        <View style={styles.navigation}></View>
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
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
    alignItems: 'center',
  },

  headingText: {
    fontSize: 28,
    textTransform: 'uppercase',
    margin: 5,
    marginVertical: 10,
    fontWeight: 'bold',
  },
});
