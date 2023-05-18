import React, { useState, useRef, useEffect } from 'react';

import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getMessages } from '../store/database';
import { useAppStateContext } from '../store/context';
import MessageCard from '../components/MessageCard';
import MessagesListItem from '../components/MessagesScreen/MessagesListItem';
import {
  AnimatedFAB,
  Button,
  Card,
  Text,
  FAB,
  useTheme,
} from 'react-native-paper';
import ListEmptyComponent from '../components/MessagesScreen/ListEmptyComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let count = 0;
export default function MessagesScreen({ navigation, route }) {
  //
  const { state } = useAppStateContext();
  const [isExtended, setIsExtended] = useState(false);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  // console.log('messagesScreen --- 2 ', route.params);
  const { navigate, setParams } = navigation;

  const theme = useTheme();
  // console.log('+++++++++++++++++++++++++', theme.colors);
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
          // title: route.params?.title,
        },
      });
    }

    // // to get the AnimatedFAB extended when FlatList is empty
    // if (state?.messages?.length === 0) {
    //   setIsExtended(true);
    // }
  }, [isFocused]);

  console.log(
    'rendering messageScreen -- count =',
    count,
    '---- navigateTo =',
    route.params?.navigateTo,
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
    // <View
    //   style={{
    //     flex: 1,
    //     alignItems: 'center',
    //     paddingTop: insets.top,
    //     paddingRight: insets.right,
    //     paddingLeft: insets.left,
    //     paddingBottom: insets.bottom + 40,
    //   }}
    // >
    <FlatList
      data={state.messages}
      renderItem={({ item }) => <MessagesListItem message={item} />}
      // contentContainerStyle={{ justifyContent: 'center' }}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingRight: insets.right,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
      }}
      ListHeaderComponent={
        <>
          <Text>MessagesScreen - {count}</Text>
          <Text>state.status - {state?.status}</Text>
        </>
      }
      ListEmptyComponent={
        <ListEmptyComponent
          titleText="No Messages were added yet!"
          bodyText="Try adding some by pressing the button below"
          extraCardStyles={{ marginVertical: 50 }}
        />
      }
      ListHeaderComponentStyle={{ alignItems: 'center' }}
      ListFooterComponent={
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <FAB
            label="Add Message"
            icon={'plus'}
            onPress={function () {
              console.log(
                'Add Message pressed - will navigate to new messages screen'
              );

              navigate('Messages', { screen: 'New Message' });
              // navigate('New Message');
            }}
          />
          {/* <AnimatedFAB
              label="Add Message"
              icon={'plus'}
              extended={true}
              // extended={isExtended}
              // animateFrom="left"
              // iconMode="static"
              onPress={() => {
                console.log(
                  'Add Message pressed - will navigate to new messages screen'
                );
                navigate('Messages', { screen: 'New Message' });
                // navigate('New Message');
              }}
            /> */}
        </View>
      }
      // onScrollBeginDrag={() => setIsExtended(false)}
      // onEndReached={() => setIsExtended(true)}
    />

    /* <AnimatedFAB
        style={{
          position: 'absolute',
          left: 10,
          bottom: 10,
          // backgroundColor: theme.colors.primary,
        }}
        // color="white"
        icon={'plus'}
        label={'Add Message'}
        extended={isExtended}
        onPress={() => {
          console.log(
            'Add Message pressed - will navigate to new messages screen'
          );
          navigate('Messages', { screen: 'New Message' });
          // navigate('New Message');
        }}
        animateFrom={'left'}
        iconMode={'dynamic'}
        variant="secondary"
      />

      <AnimatedFAB
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          backgroundColor: theme.colors.error,
        }}
        color={theme.colors.onError}
        icon={'delete'}
        label={'Delete All'}
        extended={isExtended}
        onPress={() => {
          console.log('Pressed');
          deleteMessageHandler({ deleteAll: true });
        }}
        // visible={visible}
        animateFrom={'right'}
        iconMode={'dynamic'}
        // variant="secondary"
      /> */
    // </View>
  );
}
