import React from 'react';
import Card from './shared/Card';
import { View, Text } from 'react-native';
import Hr from './shared/Hr';

function MessageCard({ item }) {
  //   console.log(item.to);
  return (
    <Card>
      <View>
        <Text>{item.title}</Text>
        <Text>{item.content}</Text>
        <Hr />
        <Text>
          Sending To:{' '}
          {item.to.map(function (contact, index) {
            if (index === this.length - 1)
              return `${contact.name}(${contact.number})`;
            return `${contact.name}(${contact.number}), `;
          }, item.to)}
        </Text>
      </View>
    </Card>
  );
}

export default MessageCard;
