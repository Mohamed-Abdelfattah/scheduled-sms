import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Text } from 'react-native-paper';
import * as Contacts from 'expo-contacts';

import Hr from '../shared/Hr';
import ContactCard from '../NewMessageScreen/ContactCard';
import ButtonPrimaryOutline from '../shared/Button';
import ContactCardPaper from './ContactCardPaper';

let contacts;
let refresh = true;

export default function AddContactModalPaper({
  isVisible,
  closeModal,
  addRecipientCallback,
}) {
  const [filteredContactsList, setFilteredContactsList] = useState(contacts);
  const [loading, setLoading] = useState(true);

  // load the contacts from device only at the first render and if reload button was clicked
  useEffect(() => {
    console.log('@effect -- refresh =', loading);
    if (refresh) {
      getContacts().then((res) => {
        // console.log('a --', res);
        contacts = res;
        setFilteredContactsList(res);
        setLoading(false);
        // setRefresh(false);
        refresh = false;
      });
    } else {
      setLoading(false);
    }
  }, [loading]);

  const renderContactCard = React.useMemo(
    () => (itemData) => {
      // console.log(itemData.item);
      return (
        <ContactCardPaper
          data={itemData.item}
          closeModal={closeModal}
          addRecipientCallback={addRecipientCallback}
        />
      );
    },
    []
  );

  const searchContacts = (value) => {
    setFilteredContactsList(
      contacts.filter((contact) =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <Modal visible={isVisible} onDismiss={closeModal} dismissable>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name="account-search-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={{ fontSize: 18, margin: 5 }}>
                    search for a contact
                  </Text>
                </View>
                <TextInput
                  onChangeText={searchContacts}
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    margin: 5,
                  }}
                />
              </View>
              <Text style={{ margin: 5, fontWeight: '600', marginBottom: 15 }}>
                click on the number to add a recipient
              </Text>
              <FlatList
                data={filteredContactsList}
                renderItem={renderContactCard}
                keyExtractor={(item, index) => item.name + index}
                ItemSeparatorComponent={Hr}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  // flex: 1,
                  justifyContent: 'space-around',
                }}
              >
                <View style={{ flex: 1 }}>
                  <ButtonPrimaryOutline label="close" onPress={closeModal} />
                </View>
                <View style={{ flex: 1 }}>
                  <ButtonPrimaryOutline
                    label="reload"
                    onPress={() => {
                      console.log('refresh was clicked');
                      refresh = true;
                      // setRefresh(true);
                      setLoading(true);
                    }}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'lightgrey',
  },
  modalView: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    // marginVertical: 20,
    width: '95%',
    padding: 20,
  },
});

/**gets a list of all contacts in the device and returns a formatted list of the contacts containing name and numbers : [ { name:String, number:[ string,] }, ] */
const getContacts = async () => {
  // const { status } = await Contacts.requestPermissionsAsync();
  const permission = await Contacts.requestPermissionsAsync();

  if (
    permission.granted ||
    permission.status === Contacts.PermissionStatus.GRANTED
  ) {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });

    // console.log('@getContacts -- data =', typeof data);
    // console.log(data[0]);

    if (!data?.length || data.length === 0) {
      // return null to render no contacts selection instead of checking before rendering, in case of a name without numbers should also return null in numbers
      return [{ name: null, number: [null] }];
    }

    const filteredList = data.map((contact) => {
      // console.log(contact);
      const numbers = [];
      if (!contact?.phoneNumbers?.length) {
        return { name: contact.name, number: [null] };
      }
      /**remove spaces and - from the numbers */
      for (let register of contact.phoneNumbers) {
        let numb = register.number.replace(/\s+/g, '').replace(/\-+/g, '');
        // numb = register.number.replace(/\-+/g, '');
        numbers.push(numb);
        // numbers.push(register.number);
      }

      return { name: contact.name, number: numbers };
      // console.log(
      //   i.name,
      //   '---- numbers --',
      //   i?.phoneNumbers?.length ? i.phoneNumbers.length : 0,
      //   '----- has digits --',
      //   i?.phoneNumbers?.[0]?.digits ? 'yes' : 'no'
      // );

      // return i.name.toLowerCase().includes('محمد عبد الوهاب'.toLowerCase());

      // if (!i?.phoneNumbers?.[0]?.digits) return false;
      // if (i?.phoneNumbers?.length > 1) return true;
      // return false;
    });

    // console.log('filtered list');
    // console.log(filteredList);
    return filteredList;

    // for (let person of filtered) {
    //   for (let number of person.phoneNumbers) {
    // console.log(number?.digits ? 'yes' : 'no', '-----', person.name);
  }
  // console.log(
  //   person.phoneNumbers
  //   // person[0].name,
  //   // person[0].phoneNumbers
  // );
  // }
  // }
};
