import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import ButtonPrimaryOutline from '../components/shared/Button';
import Rules from '../components/NewMessageScreen/Rules';
import Recipients from '../components/NewMessageScreen/Recipients';
import * as SMS from 'expo-sms';
import { useAppStateContext } from '../store/context';

export default function NewMessageScreen({ navigation, route }) {
  //
  const { state, saveChanges, createNewMessage } = useAppStateContext();
  const insets = useSafeAreaInsets();
  // const tabBarHeight = useBottomTabBarHeight();

  if (state.status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ooops! something went wrong</Text>
      </View>
    );
  }

  return (
    // <View
    //   style={{
    //     flex: 1,
    //     paddingBottom: insets.bottom + 30,
    //     paddingTop: insets.top,
    //     paddingRight: insets.right,
    //     paddingLeft: insets.left,
    //   }}
    // >
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingRight: insets.right + 10,
        paddingLeft: insets.left + 10,
        paddingBottom: insets.bottom + 40,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          alignSelf: 'center',
          margin: 10,
        }}
      >
        Create New Message
      </Text>

      <View style={{}}>
        <Text style={{ fontSize: 18 }}>Title:</Text>
        <TextInput
          textAlignVertical="top"
          style={{
            borderWidth: 1,
            flex: 1,
            marginHorizontal: 5,
            marginVertical: 10,
            padding: 5,
            fontSize: 15,
            backgroundColor: 'white',
          }}
          value={state.messageFormData.title}
          onChangeText={(input) => {
            saveChanges({ title: input });
          }}
        />
      </View>

      <View style={{ minHeight: '25%' }}>
        <Text style={{ fontSize: 18 }}>Message:</Text>
        <TextInput
          multiline
          numberOfLines={5}
          // maxLength={100}
          textAlignVertical="top"
          style={{
            borderWidth: 1,
            flex: 1,
            marginHorizontal: 5,
            marginVertical: 10,
            padding: 5,
            fontSize: 15,
            backgroundColor: 'white',
          }}
          value={state.messageFormData.content}
          onChangeText={(input) => {
            saveChanges({ content: input });
          }}
        />
      </View>

      <Recipients />

      <Rules />

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 50,
        }}
      >
        <View style={{ flex: 1 }}>
          <ButtonPrimaryOutline
            label="Save"
            onPress={async () => {
              // create new message
              console.log(
                '@NewMessage --- pressed on save --- will navigate to MessagesScreen'
              );

              const validSendingTime = new Date(Date.now() + 2 * 60000);
              validSendingTime.setSeconds(0);
              // console.log(
              //   'date.now =',
              //   new Date(),
              //   'comparing sendingTime:',
              //   state.messageFormData.sendingDate.toLocaleString(),
              //   '=',
              //   state.messageFormData.sendingDate.getTime(),
              //   'with now + 2 minutes:',
              //   '=',
              //   validSendingTime.getTime(),
              //   validSendingTime.toLocaleString(),
              //   state.messageFormData.sendingDate.getTime() <
              //     validSendingTime.getTime()
              // );
              // validate time/date choice and alert user to choose date in the future (at least 2 minutes after the moment the button was pressed)
              if (state.messageFormData.sendingDate < validSendingTime) {
                // alert
                createOneButtonAlert();
                return;
              }
              await createNewMessage();
              navigation.navigate('Messages', {
                screen: 'Messages List',
              });
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ButtonPrimaryOutline label="Cancel" />
        </View>
      </View>
    </ScrollView>
    // </View>
  );
}

function createOneButtonAlert(id, callback) {
  Alert.alert(
    'Sending Time!',
    'Please choose a sending date/time that at least 2 minutes after now.',
    [
      {
        text: 'Close',
        onPress: () => {
          console.log('sending date error');
        },
      },
    ]
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
