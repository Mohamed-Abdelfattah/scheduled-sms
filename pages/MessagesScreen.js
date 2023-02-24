import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useState, useRef, useEffect } from 'react';
import { getMessages } from '../store/database';
import { useAppStateContext } from '../store/context';
import MessageCard from '../components/MessageCard';
import MessagesListItem from '../components/MessagesScreen/MessagesListItem';
import { AnimatedFAB, Button, FAB, useTheme } from 'react-native-paper';

let count = 0;
function MessagesScreen({ navigation, route }) {
  //
  const { state } = useAppStateContext();
  const [isExtended, setIsExtended] = useState(true);

  const isFocused = useIsFocused();
  // console.log('messagesScreen --- 2 ', route.params);
  const { navigate, setParams } = navigation;

  const theme = useTheme();
  console.log('+++++++++++++++++++++++++', theme.colors);
  // const { backgroundColor, borderColor, textColor } =
  //   theme.colors.button.contained;

  useEffect(() => {
    count += 1;
    console.log('effect -', count);

    if (route.params?.navigateTo === 'createMessage') {
      setParams({ navigateTo: '' });
      navigate('Messages', { screen: 'New Message' });
    }
    if (route.params?.navigateTo === 'MessageDetails') {
      // console.log(
      //   'hit messagesScreen and will navigate to details',
      //   route.params
      // );
      setParams({ navigateTo: '' });
      navigate('Messages', {
        screen: 'Message Details',
        params: {
          id: route.params?.id,
          title: route.params?.title,
        },
      });
    }
  }, [isFocused]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  console.log(
    'rendering messageScreen -- count =',
    count,
    '---- navigateTo =',
    route.params?.navigateTo,
    // '---- status =',
    // status,
    '---- state =',
    state
  );

  if (state?.status === 'loading')
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  if (state?.status === 'error')
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error</Text>
        <Text>{state.error}</Text>
      </View>
    );

  return (
    //   <StatusBar style="auto" />
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          // flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
        }}
        onScroll={onScroll}
        onScrollEndDrag={() => {}}
      >
        <Text>MessagesScreen - {count}</Text>
        <Text>state.status - {state?.status}</Text>
        {state.messages.map((message) => (
          <MessagesListItem key={message.id} message={message} />
        ))}

        <Text style={{ padding: 5 }}>No More messages</Text>
      </ScrollView>

      <AnimatedFAB
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          backgroundColor: theme.colors.primary,
        }}
        color="white"
        icon={'plus'}
        label={'Add Message'}
        extended={isExtended}
        onPress={() => console.log('Pressed')}
        animateFrom={'left'}
        iconMode={'dynamic'}
        // variant="secondary"
      />

      <AnimatedFAB
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          backgroundColor: `rgba(${theme.colors.error},0.2)`,
        }}
        color="white"
        icon={'delete'}
        label={'Delete All'}
        extended={isExtended}
        onPress={() => console.log('Pressed')}
        // visible={visible}
        animateFrom={'right'}
        iconMode={'dynamic'}
        // variant="secondary"
      />

      {/* <View
        style={{
          flexDirection: 'row',
          padding: 5,
          justifyContent: 'space-evenly',
        }}
      >
        <Button
          mode="contained"
          icon="plus"
          uppercase
          contentStyle={{ padding: 3 }}
          onPress={() => {
            console.log('Add Message pressed');
          }}
        >
          Add Message
        </Button>
        <Button
          mode="contained"
          icon="delete"
          uppercase
          contentStyle={{ padding: 3 }}
          onPress={() => {
            console.log('delete all pressed');
          }}
        >
          Delete All
        </Button>
      </View> */}
    </View>
  );
}

export default MessagesScreen;
