import React from 'react';
import { Card, Divider, Text } from 'react-native-paper';
import Hr from '../shared/Hr';

function ListEmptyComponent({ titleText, bodyText, extraCardStyles }) {
  //

  return (
    <Card
      style={{
        marginVertical: 10,
        width: 300,
        // marginHorizontal: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
        ...extraCardStyles,
      }}
    >
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{ textAlign: 'center', color: '#858585' }}
        >
          {titleText}
        </Text>

        <Divider bold style={{ marginVertical: 15 }} />

        <Text
          variant="bodyLarge"
          style={{ textAlign: 'center', color: '#858585' }}
        >
          {bodyText}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default React.memo(ListEmptyComponent);
