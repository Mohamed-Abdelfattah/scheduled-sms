import React from 'react';
import Card from './shared/Card';
import { View, Text } from 'react-native';
import Hr from './shared/Hr';

function MessageCard({ message }) {
  //   console.log(message.to);
  return (
    <Card>
      <View>
        <Text>{message.title}</Text>
        <Text>{message.content}</Text>
        <Hr />
        <Text>
          Sending To:{' '}
          {message.to.map(function (contact, index) {
            if (index === this.length - 1)
              return `${contact.name}(${contact.number})`;
            return `${contact.name}(${contact.number}), `;
          }, message.to)}
        </Text>
      </View>
    </Card>
  );
}

export default MessageCard;
