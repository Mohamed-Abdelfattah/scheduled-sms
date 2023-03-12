import React from 'react';
import { Card, Text } from 'react-native-paper';

function ListEmptyComponent() {
  //

  return (
    <Card
      style={{
        marginVertical: 50,
        width: '92%',
        // marginHorizontal: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
      }}
    >
      <Card.Content>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          No Messages were added yet!{'\n'}You can add some by clicking the plus
          button below
        </Text>
      </Card.Content>
    </Card>
  );
}

export default React.memo(ListEmptyComponent);
