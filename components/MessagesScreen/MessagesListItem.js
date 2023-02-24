import {
  Surface,
  Button,
  Card,
  Text,
  FAB,
  useTheme,
  Divider,
} from 'react-native-paper';
import React from 'react';
import Hr from '../shared/Hr';
// import { theme } from '../utils/theme';

const Actions = (props) => {
  //
  const theme = useTheme();

  return (
    <Surface
      elevation={0}
      style={{
        flex: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <FAB
        variant="surface"
        size="small"
        mode="flat"
        icon="square-edit-outline"
        style={{}}
        //    style={styles.fab}
        onPress={() => console.log('Pressed')}
      />
      <FAB
        color={theme.colors.error}
        style={{ backgroundColor: theme.colors.errorContainer }}
        size="small"
        mode="flat"
        icon="delete-forever-outline"
        //    style={styles.fab}
        onPress={() => console.log('Pressed')}
      />
    </Surface>
  );
};

const MessagesListItem = ({ message }) => {
  //

  const recipients = message.recipients.length
    ? message.recipients.reduce((accumulator, currentValue, index, array) => {
        if (index === array.length - 1)
          return accumulator + `${currentValue.name} (${currentValue.number})`;
        return accumulator + `${currentValue.name} (${currentValue.number}) - `;
      }, '')
    : 'No contacts were selected';

  console.log('rendering MessagesListItem component');

  return (
    <Card
      //   mode="outlined"
      style={{
        width: '85%',
        margin: 20,
        // backgroundColor: theme.colors.primary,
      }}
      onPress={() => {
        console.log('card pressed');
      }}
    >
      {/* <Card.Title
        title={message.title}
        titleVariant="titleLarge"
        // subtitle="Card Subtitle"
        right={Actions}
        rightStyle={{ flexDirection: 'row' }}
      /> */}
      <Card.Content
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 10,
        }}
      >
        <Text style={{ flex: 1 }} variant="titleLarge">
          {message.title}
        </Text>
        <Actions />
      </Card.Content>

      <Card.Content>
        <Text variant="bodyLarge">Message: </Text>
        <Text variant="bodyMedium">
          {message.content}
          Card content Card content Card content Card content Card content Card
          content Card content Card content Card content
        </Text>

        <Divider style={{ marginTop: 10, marginBottom: 8 }} />

        <Text variant="bodyLarge">Recipients: </Text>
        <Text variant="bodyMedium">{recipients}</Text>
      </Card.Content>

      {/* <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions> */}
    </Card>
  );
};

export default React.memo(MessagesListItem);
