import { View } from 'react-native';
import React from 'react';
import { Card, Divider, Text } from 'react-native-paper';

export default function RecipientCard({ item }) {
  return (
    <View>
      <Card
        style={{ width: 150, height: 100 }}
        contentStyle={{ alignItems: 'center' }}
      >
        <Card.Content>{item.name}</Card.Content>
        <Divider />
        <Card.Content>{item.number}</Card.Content>
      </Card>
    </View>
  );
}
