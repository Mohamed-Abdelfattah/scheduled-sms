import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ButtonPrimaryOutline from '../components/shared/Button';
import Rules from '../components/NewMessageScreen/Rules';
import Recipients from '../components/NewMessageScreen/Recipients';
import * as SMS from 'expo-sms';
import { useAppStateContext } from '../store/context';

export default function NewMessageScreen({ navigation, route }) {
  //
  const { state, saveChanges, createNewMessage } = useAppStateContext();

  const tabBarHeight = useBottomTabBarHeight();

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
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 10,
          paddingBottom: tabBarHeight + 20,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
