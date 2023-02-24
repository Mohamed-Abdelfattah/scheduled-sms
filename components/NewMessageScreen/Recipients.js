import { View, Text, Pressable, Alert, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AddContactModal from './AddContactModal';
import ButtonPrimaryOutline from '../shared/Button';
import { useAppStateContext } from '../../store/context';

export default function Recipients() {
  //
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [insertedNumber, setInsertedNumber] = useState(null);

  const { state, saveChanges } = useAppStateContext();
  const { recipients } = state.messageFormData;

  const showModal = () => {
    setModalIsVisible(true);
  };

  const dismissModal = () => {
    setModalIsVisible(false);
  };

  const removeRecipients = (id) => {
    saveChanges({
      recipients: recipients.filter((contact) => contact.id !== id),
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18 }}>Send to:</Text>
      <View
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-around',
          // alignItems: 'center',
          // gap: 50,
        }}
      >
        {!recipients?.length ? (
          <Text style={{ fontSize: 18 }}>No recipients were added yet</Text>
        ) : (
          recipients.map((contact) => {
            return (
              <View
                key={contact.id}
                style={{
                  width: '48%',
                  // padding: 5,
                  borderWidth: 1,
                  // alignItems: 'center',
                  marginVertical: 3,
                  borderRadius: 25,
                  elevation: 5,
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  // gap: 20,
                  overflow: 'hidden',
                  minHeight: 50,
                }}
              >
                <Pressable
                  onPress={createTwoButtonAlert.bind(
                    this,
                    contact.id,
                    removeRecipients
                  )}
                  style={({ pressed }) => [
                    {
                      // backgroundColor: 'pink',
                      width: '100%',
                      padding: 5,
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    pressed
                      ? { backgroundColor: '#e8cbc6ff' }
                      : { backgroundColor: '#dcf1ddff' },
                  ]}
                >
                  <Text>{contact.name.slice(0, 20)}</Text>
                  <Text> {contact.number}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>

      <View
        style={{
          flexDirection: 'column',
          // alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{}}>Import from contacts: </Text>

          <View style={{ flex: 1 }}>
            <ButtonPrimaryOutline label="Add Contact" onPress={showModal} />
          </View>
        </View>
        <View
          style={{
            // width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>or add Number: </Text>
          <TextInput
            keyboardType="phone-pad"
            onChangeText={(t) => {
              setInsertedNumber(t);
            }}
            value={insertedNumber}
            style={{
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 2,
              height: 30,
              minWidth: '50%',
              // flex: 1,
              paddingHorizontal: 5,
              backgroundColor: 'white',
            }}
          />
          <ButtonPrimaryOutline
            disabled={!insertedNumber}
            label="  Add  "
            onPress={() => {
              console.log(insertedNumber);
              saveChanges({
                recipients: [
                  ...recipients,
                  {
                    name: '',
                    number: insertedNumber,
                    id: Math.random().toString(),
                  },
                ],
              });
              setInsertedNumber(null);
            }}
          />
        </View>
      </View>
      {modalIsVisible ? (
        <AddContactModal isVisible={modalIsVisible} closeModal={dismissModal} />
      ) : (
        <></>
      )}
    </View>
  );
}

const createTwoButtonAlert = (id, callback) =>
  Alert.alert(
    'Remove Contact!',
    'Are you sure you want to remove this contact from the recipients list?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => callback(id) },
    ]
  );
