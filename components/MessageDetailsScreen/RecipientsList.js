import React from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Card, Divider, IconButton, Text, useTheme } from 'react-native-paper';
// import RecipientCard from './RecipientCard';

export default function RecipientsList({
  recipientsData,
  isEditing,
  removeRecipientCallback,
}) {
  return (
    <FlatList
      horizontal
      data={recipientsData}
      renderItem={({ item }) => (
        <RecipientCard
          item={item}
          isEditing={isEditing}
          removeRecipientCallback={removeRecipientCallback}
        />
      )}
      contentContainerStyle={{ padding: 15 }}
    />
  );
}

function RecipientCard({ item, isEditing, removeRecipientCallback }) {
  //
  const theme = useTheme();

  return (
    <Card
      elevation={4}
      style={{
        width: 150,
        height: 100,
        // backgroundColor: 'lightgrey'
        position: 'relative',
        marginEnd: 15,
      }}
      contentStyle={{ alignItems: 'center', paddingTop: 0 }}
    >
      <Card.Content>
        <Text>{item.name}</Text>
      </Card.Content>

      <View style={{ width: '90%', paddingVertical: 5 }}>
        <Divider bold style={{ borderColor: 'black' }} />
      </View>

      <Card.Content>
        <Text>{item.number}</Text>
      </Card.Content>

      {isEditing && (
        <View
          style={{
            // borderColor: 'black',
            //   borderWidth: 1,
            position: 'absolute',
            right: 50,
            top: -25,
          }}
        >
          <IconButton
            // mode="outlined"
            icon="delete-forever"
            size={22}
            iconColor={theme.colors.error}
            style={{ borderColor: theme.colors.error }}
            onPress={() => {
              console.log('pop ------------', item.id);
              createTwoButtonAlert(item.id, removeRecipientCallback);
              // removeRecipientCallback(item.id);
            }}
          />
        </View>
      )}
    </Card>
  );
}

function createTwoButtonAlert(id, callback) {
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
    ],
    { cancelable: true }
  );
}
