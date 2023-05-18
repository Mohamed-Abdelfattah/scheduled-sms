import { View } from 'react-native';
import React from 'react';
// import Card from './shared/Card';
import { Card, Divider, Text } from 'react-native-paper';

export default function EmptyEventsListComponent({
  isNotificationsList = false,
}) {
  console.log(
    '@EmptyEventsListComponent --- rendering EmptyEventsListComponent'
  );

  return (
    <Card
      mode="elevated"
      style={{
        marginVertical: 10,
        width: '85%',
        // height: 150,
        // marginHorizontal: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
      }}
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{ textAlign: 'center', color: '#656565' }}
        >
          No Events were added yet!
        </Text>
        <Divider bold style={{ marginVertical: 15 }} />
        <Text
          variant="bodyLarge"
          style={{ textAlign: 'center', color: '#656565' }}
        >
          You can add some by clicking the button below
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Card isCardDisabled>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#787878', fontSize: 16 }}>
          {isNotificationsList
            ? 'No Notifications\n Any upcoming notification will appear here \n Create new messages to see some action!'
            : 'No Events'}
        </Text>
      </View>
    </Card>
  );
}
