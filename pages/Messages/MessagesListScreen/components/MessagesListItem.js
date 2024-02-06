import { useState } from 'react';
import { View } from 'react-native';
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
import { FontAwesome5 } from '@expo/vector-icons';
import Hr from '../shared/Hr';
import { useAppStateContext } from '../../store/context';
import { useNavigation } from '@react-navigation/native';
import DeletionDialog from '../SettingsScreen/DeletionDialog';
// import { theme } from '../utils/theme';

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

  const theme = useTheme();

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
          justifyContent: 'space-between',
        }}
      >
        <View>
          <FontAwesome5
            //todo: icon name should be "whatsapp" or "sms" based on the message type after adding the messageType to db
            name="sms"
            size={24}
            color={theme.colors.primary}
            style={{ marginBottom: 10 }}
          />
        </View>

        <View>
          <Text style={{ flex: 1 }} variant="titleLarge">
            {message.title}
          </Text>
        </View>

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
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <FAB
        variant="surface"
        size="small"
        mode="flat"
        icon="square-edit-outline"
        style={{ marginHorizontal: 5 }}
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
        style={{ backgroundColor: theme.colors.error, marginHorizontal: 5 }}
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

export default React.memo(MessagesListItem);

// const [dialogState, setDialogState] = useState({ visible: false, type: '' });

// <Portal>
//   <DeletionDialog
//     visible={dialogState.visible}
//     itemsToBeDeleted={dialogState.type}
//     hideDialog={() => setDialogState({ visible: false, type: '' })}
//   />
// </Portal>;
