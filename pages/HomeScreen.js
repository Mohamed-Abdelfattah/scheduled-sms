import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ButtonPrimaryOutline from '../components/shared/Button';
import NotificationCard from '../components/NotificationCard';
import MessageCard from '../components/MessageCard';
import Hr from '../components/shared/Hr';
import { CommonActions, StackActions } from '@react-navigation/native';
import { useAppStateContext } from '../store/context';
import MessageCardPaper from '../components/MessagesScreen/MessageCardPaper';
import WavingHandSvg from '../assets/WavingHand';
import { Card, Text, Surface, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  // also useNavigation hook can be used in any component to get the navigation object
  // const navigation = useNavigation();
  const { state } = useAppStateContext();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const upcoming = state.events.filter(
    (el) => el.state !== 'success' && el.state !== 'failure'
  );

  return (
    // <View style={{ flex: 1 }}>
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom + 40,
      }}
    >
      <Surface>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: 20,
            backgroundColor: theme.colors.primaryContainer,
          }}
        >
          <Text variant="displayMedium">Hi there!</Text>
          <WavingHandSvg />
        </View>
      </Surface>

      <View>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Notifications</Text>
          <ButtonPrimaryOutline label="More" icon="message-bookmark" />
        </View>
        <FlatList
          data={upcoming}
          // data={state.events}
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
                // navigation.navigate('Messages', { screen: 'New Message' });
                navigation.navigate('Messages', {
                  screen: 'Messages List',
                  params: {
                    navigateTo: 'createMessage',
                  },
                });
              }}
            />
            <ButtonPrimaryOutline
              label="MORE"
              icon="message-bookmark"
              onPress={() => {
                navigation.navigate('Messages', {
                  screen: 'Messages List',
                  params: { navigateTo: '' },
                });
              }}
            />
          </View>
        </View>
        <FlatList
          data={state.messages}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}
          // renderItem={MessageCard}
          // won't be able to use hooks (useNavigation) as it should be called in a react component not a function the above won't work
          renderItem={(itemData) => <MessageCardPaper item={itemData.item} />}
          ItemSeparatorComponent={<View style={{ width: 20 }}></View>}
          // not needed as in the docs "The default extractor checks item.key, then item.id, and then falls back to using the index, like React does."
          keyExtractor={(item, index) => item.id}
          horizontal
        />
      </View>

      <View style={styles.logs}>
        <MessageCard item={{ title: 'test', id: 'test', content: 'test' }} />
      </View>

      <View style={styles.navigation}>
        <MessageCard item={{ title: 'test', id: 'test', content: 'test' }} />
      </View>
    </ScrollView>
    // </View>
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
