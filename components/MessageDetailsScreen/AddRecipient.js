import { View, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtonPrimaryOutline from '../shared/Button';
import AddContactModalPaper from './AddContactModalPaper';
import { Button, Text, IconButton, TextInput } from 'react-native-paper';
import AddContactModal from '../NewMessageScreen/AddContactModal';

export default function AddRecipient({ addRecipientCallback }) {
  //
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [insertedNumber, setInsertedNumber] = useState(null);

  const showModal = () => {
    setModalIsVisible(true);
  };

  const dismissModal = () => {
    setModalIsVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}
      >
        <Button mode="contained-tonal" icon="account-plus" onPress={showModal}>
          Import from contacts
        </Button>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <View>
            <Text>OR </Text>
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Type a Number"
              keyboardType="phone-pad"
              onChangeText={(t) => {
                setInsertedNumber(t);
              }}
              value={insertedNumber}
              style={{
                height: 35,
                minWidth: '60%',
                paddingBottom: 2,
              }}
            />
          </View>

          <Button
            compact
            mode="contained-tonal"
            icon="account-plus"
            labelStyle={{ paddingEnd: 2 }}
            disabled={!insertedNumber}
            onPress={() => {
              console.log(insertedNumber);
              addRecipientCallback({
                name: '',
                number: insertedNumber,
                id: Math.random().toString(),
              });
              setInsertedNumber(null);
            }}
          >
            ADD
          </Button>
        </View>
      </View>
      {modalIsVisible ? (
        <AddContactModalPaper
          isVisible={modalIsVisible}
          closeModal={dismissModal}
          addRecipientCallback={addRecipientCallback}
        />
      ) : (
        <></>
      )}
    </View>
  );
}
