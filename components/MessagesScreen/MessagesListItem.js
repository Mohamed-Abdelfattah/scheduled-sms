import { useState } from 'react';
import {
  Surface,
  Card,
  Text,
  FAB,
  useTheme,
  Divider,
  Portal,
} from 'react-native-paper';
import React from 'react';
import Hr from '../shared/Hr';
import { useAppStateContext } from '../../store/context';
import { useNavigation } from '@react-navigation/native';
import DeletionDialog from '../SettingsScreen/DeletionDialog';
// import { theme } from '../utils/theme';

const Actions = ({ id }) => {
  //
  const theme = useTheme();
  const { deleteMessageHandler } = useAppStateContext();
  const navigation = useNavigation();

  const [dialogState, setDialogState] = useState({
    visible: false,
    type: '',
  });

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
        onPress={() => {
          console.log('edit was Pressed');
          navigation.navigate('Messages', {
            screen: 'Message Details',
            params: {
              id,
              // title: route.params?.title,
            },
          });
        }}
      />
      <FAB
        color={theme.colors.onError}
        style={{ backgroundColor: theme.colors.error }}
        size="small"
        mode="flat"
        icon="delete-forever-outline"
        //    style={styles.fab}
        onPress={() => {
          console.log('delete card pressed');
          // deleteMessageHandler({ id });
          setDialogState({ visible: true, type: 'single-message' });
        }}
      />
      <Portal>
        <DeletionDialog
          visible={dialogState.visible}
          itemsToBeDeleted={dialogState.type}
          hideDialog={() => setDialogState({ visible: false, type: '' })}
          messageId={id}
        />
      </Portal>
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

  const rules = message?.rules?.repeat
    ? `To be sent every ${message.rules.repeatEvery}`
    : 'To be sent once';

  const date =
    message?.sendingDate.toString() === 'Invalid Date'
      ? 'No Date was specified'
      : message.sendingDate.toString();

  console.log('rendering MessagesListItem component');

  return (
    <Card
      //   mode="outlined"
      style={{
        width: '92%',
        // marginHorizontal: 20,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginVertical: 10,
        // backgroundColor: theme.colors.primary,
      }}
    >
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

        <Actions id={message.id} />
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
        <Text variant="bodyMedium">
          {'  '}
          {recipients}
        </Text>

        <Text variant="bodyLarge">Rules: </Text>
        <Text>
          {'  '}
          {rules}
        </Text>

        <Text variant="bodyLarge">On: </Text>
        <Text>
          {'  '}
          {date}
        </Text>
      </Card.Content>

      {/* <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions> */}
    </Card>
  );
};

export default React.memo(MessagesListItem);

// const [dialogState, setDialogState] = useState({ visible: false, type: '' });

// <Portal>
//   <DeletionDialog
//     visible={dialogState.visible}
//     itemsToBeDeleted={dialogState.type}
//     hideDialog={() => setDialogState({ visible: false, type: '' })}
//   />
// </Portal>;
