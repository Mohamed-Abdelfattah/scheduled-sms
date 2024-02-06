import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Card,
  Chip,
  Button,
  TextInput,
  HelperText,
  Checkbox,
  MD3Colors,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import ButtonPrimaryOutline from '../../../components/shared/Button';
import Rules from '../components/NewMessageScreen/Rules';
import Recipients from '../components/NewMessageScreen/Recipients';
import * as SMS from 'expo-sms';
import { useAppStateContext } from '../../../store/context';
import InputItem from '../components/NewMessageScreen/InputItem';
import AddRecipient from '../components/MessageDetailsScreen/AddRecipient';
import RecipientsList from '../components/MessageDetailsScreen/RecipientsList';
import ChooseDate from '../components/NewMessageScreen/ChooseDate';
import SelectRules from '../components/MessageDetailsScreen/SelectRules';

const TWO_MINUTES = 2 * 60000;
const FIVE_MINUTES = 5 * 60000;

export default function NewMessageScreenPaper({ navigation, route }) {
  //
  const [wasInputTouched, setWasInputTouched] = useState(false);
  const { state, saveChanges, createNewMessage } = useAppStateContext();
  const { messageFormData } = state;
  const { title, content, recipients, rules, sendingDate } = messageFormData;

  // const tabBarHeight = useBottomTabBarHeight();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const titleInputInvalid = wasInputTouched && title?.trim() === '';
  const recipientsListShouldBeEdited = recipients.length > 0;

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

        <InputItem
          singleRow
          label={
            <>
              <Text style={{ color: MD3Colors.error50 }}>*</Text> Title
            </>
          }
        >
          <View style={{ flex: 1, paddingStart: 15 }}>
            <TextInput
              dense
              label="Message Title"
              mode="outlined"
              error={titleInputInvalid}
              style={{
                backgroundColor: 'white',
                fontSize: 22,
                textAlign: 'center',
                paddingEnd: 15,
              }}
              multiline
              value={title}
              onChangeText={(newTitle) => {
                saveChanges({ title: newTitle });
              }}
              onFocus={(e) => {
                setWasInputTouched(false);
              }}
              onBlur={() => {
                console.log('the input just lost focus!!!!!!!!1');
                setWasInputTouched(true);
              }}
            />
            {/* title will be mandatory input that shouldn't be blank */}
            {titleInputInvalid && (
              <HelperText
                type="error"
                padding="none"
                visible={titleInputInvalid}
              >
                Error: Title is required and cannot be empty!
              </HelperText>
            )}
          </View>
        </InputItem>

        <InputItem label="Message">
          <TextInput
            mode="outlined"
            dense
            label="Message text to be sent"
            style={{
              backgroundColor: 'white',
              fontSize: 16,
              lineHeight: 24,
              height: 80,
              // textAlign: 'center',
              paddingHorizontal: 7,
              paddingVertical: 0,
              marginBottom: 5,
            }}
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={(content) => {
              saveChanges({ content });
            }}
          />
        </InputItem>

        <InputItem label="Recipients">
          <Text>Add a new recipient</Text>
          <AddRecipient
            addRecipientCallback={(contact) => {
              console.log('contact to be added ---', contact);
              console.log('will add new recipient', recipients);
              const newRecipientsList = [...recipients];
              newRecipientsList.push(contact);
              console.log('after adding new recipient', newRecipientsList);

              saveChanges({ recipients: newRecipientsList });
            }}
          />
          {recipientsListShouldBeEdited && (
            <Text
              variant="bodyMedium"
              style={{
                paddingBottom: 5,
                textAlign: 'center',
                color: theme.colors.error,
              }}
            >
              click on the delete icon to remove a recipient
            </Text>
          )}

          <RecipientsList
            recipientsData={recipients}
            isEditing={recipientsListShouldBeEdited}
            removeRecipientCallback={(idToRemove) => {
              const newRecipientsList = recipients.filter(
                (recip) => recip.id !== idToRemove
              );
              saveChanges({ recipients: newRecipientsList });
            }}
          />
        </InputItem>

        <InputItem label="Sending Date">
          <ChooseDate
            dateProp={sendingDate}
            applyChoiceCallback={saveChanges}
            // applyChoiceCallback={({ sendingDate }) => {
            //   saveChanges({ sendingDate });
            // }}
          />

          {/* <Text
            variant="bodyLarge"
            style={{ paddingBottom: 5, textAlign: 'center' }}
          >
            Message will be sent on: {sendingDate.toLocaleString()}
          </Text> */}
        </InputItem>

        <InputItem label="Rules" style={{ paddingBottom: 20 }}>
          <SelectRules
            repeat={rules.repeat}
            every={rules.repeatEvery}
            callbackFn={saveChanges}
            // callbackFn={(newRules) => {
            //   saveChanges({ rules: newRules });
            // }}
          />
        </InputItem>

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <ButtonPrimaryOutline
              label="Save"
              disabled={title?.trim() === ''}
              onPress={async () => {
                // create new message
                console.log(
                  '@NewMessage --- pressed on save --- will navigate to MessagesScreen'
                );

                const validSendingTime = new Date(Date.now() + TWO_MINUTES);
                validSendingTime.setSeconds(0);

                if (
                  !state.messageFormData.sendingDate ||
                  state.messageFormData.sendingDate < validSendingTime
                ) {
                  // alert
                  console.log('should create button alert');
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
    </View>
  );
}

function createOneButtonAlert() {
  Alert.alert(
    'Sending Time!',
    'Please select a sending date/time that is at least 2 minutes later than the current time.',

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
