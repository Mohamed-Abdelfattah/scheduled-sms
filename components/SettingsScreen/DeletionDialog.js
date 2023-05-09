import { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Divider,
  Surface,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
  Portal,
  Dialog,
  ActivityIndicator,
} from 'react-native-paper';
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useAppStateContext } from '../../store/context';

export default function DeletionDialog({
  visible,
  hideDialog,
  itemsToBeDeleted,
  messageId,
}) {
  //
  const {
    state,
    deleteMessageHandler,
    deleteEventHandler,
    deleteAllDataHandler,
  } = useAppStateContext();

  let data = [];
  let nothingMoreToBeDeleted = false;
  let deleteHandler = () => {
    console.log(
      '@DeletionDialog -- this means that delete button was pressed but the deleteHandler has the default value'
    );
  };
  let assertionMessage = `Are you sure you want to delete All ${itemsToBeDeleted}?\n\nThis is an irreversible action and `;

  if (itemsToBeDeleted === 'Events') {
    data = ['Events'];
    assertionMessage +=
      'all scheduled events and logs will be deleted permanently!';
    deleteHandler = deleteEventHandler.bind(this, { deleteAll: true });
  } else if (itemsToBeDeleted === 'Messages') {
    data = ['Messages'];
    assertionMessage +=
      'all the messages and scheduled events will be deleted permanently!';
    deleteHandler = deleteMessageHandler.bind(this, { deleteAll: true });
  } else if (itemsToBeDeleted === 'Data') {
    data = ['Messages', 'Events'];
    assertionMessage +=
      'all the messages, scheduled events, and logs will be deleted permanently';
    deleteHandler = deleteAllDataHandler;
  } else if (itemsToBeDeleted === 'single-message') {
    data = ['Message'];
    assertionMessage = `Are you sure you want to delete this message?\n\nThis is an irreversible action and the message data and all of its scheduled events will be deleted permanently!`;
    deleteHandler = deleteMessageHandler.bind(this, { id: messageId });
  }

  // the state.status will be 'success' after any successful db and state manipulations (for any other reason as it's a global status(here proves why it's not ideal to use a global status for the app)) so we can't relay on status only to control the transition between 'loading' to 'success' states cause here we need to assert that all the deleting have ended already before rendering the success ui
  // a good solution maybe to have a local ref or state that holds a flag representing the if the deletion happened or not and to be changed when upon the deleteHandler execution (deleteHandler = ()=>{delete();setFlag(done)}) rendering the ui will depend on that, but here I won't do that instead i'll assert that the deletion happened and set the flag independently
  // by looping over the data to be deleted we want to assert that that the deletion happened by checking the app state for the data to be deleted
  for (let el of data) {
    if (el === 'Message') {
      if (!state.messages.some((message) => message.id === messageId)) {
        nothingMoreToBeDeleted = true;
      }
      break;
    }
    if (state[el.toLowerCase()]?.length > 0) {
      nothingMoreToBeDeleted = false;
      break;
    }
    nothingMoreToBeDeleted = true;
  }

  const content =
    state.status === 'loading' ? (
      <DeletionLoading data={data} />
    ) : state.status === 'success' && nothingMoreToBeDeleted ? (
      <DeletionSuccess
        itemsToBeDeleted={itemsToBeDeleted}
        hideDialog={hideDialog}
      />
    ) : state.status === 'error' ? (
      <DeletionError
        itemsToBeDeleted={itemsToBeDeleted}
        hideDialog={hideDialog}
      />
    ) : (
      // ) : true ? (
      <ConfirmingMessage
        assertionMessage={assertionMessage}
        deleteHandler={deleteHandler}
        hideDialog={hideDialog}
      />
    );
  // <Text>Something Unexpected happened!{'\n'}Please contact support!</Text>
  console.log('@DeletionDialog --- ');

  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title style={{ textAlign: 'center' }}>
        {itemsToBeDeleted === 'single-message'
          ? `Delete Message`
          : `Delete All ${itemsToBeDeleted}`}
      </Dialog.Title>

      {content}
    </Dialog>
  );
}

function ConfirmingMessage({ assertionMessage, deleteHandler, hideDialog }) {
  //
  const theme = useTheme();

  return (
    <>
      <MaterialCommunityIcons
        name="delete-alert"
        size={40}
        color={theme.colors.error}
        style={{ alignSelf: 'center', paddingBottom: 20 }}
      />

      <Dialog.Content>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          {assertionMessage}
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={hideDialog}>Cancel</Button>
        <Button onPress={deleteHandler}>Delete</Button>
      </Dialog.Actions>
    </>
  );
}

function DeletionLoading({ data }) {
  //
  return (
    <Dialog.Content>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingBottom: 20,
        }}
      >
        <ActivityIndicator size="large" />

        <View>
          {data.map((el) => (
            <Text key={el}>Deleting {el} ...</Text>
          ))}
        </View>
      </View>
    </Dialog.Content>
  );
}

function DeletionSuccess({ itemsToBeDeleted, hideDialog }) {
  //
  return (
    <>
      <MaterialCommunityIcons
        name="check-circle"
        size={40}
        color="green"
        style={{ alignSelf: 'center', paddingBottom: 20 }}
      />

      <Dialog.Content>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          All {itemsToBeDeleted} were deleted successfully.
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={hideDialog}>Ok</Button>
      </Dialog.Actions>
    </>
  );
}

function DeletionError({ itemsToBeDeleted, hideDialog }) {
  //
  const theme = useTheme();

  return (
    <>
      <MaterialCommunityIcons
        name="alert"
        size={40}
        color={theme.colors.error}
        style={{ alignSelf: 'center', paddingBottom: 20 }}
      />

      <Dialog.Content style={{ alignItems: 'center' }}>
        <Text variant="titleLarge" style={{ paddingBottom: 10 }}>
          Ooops!
        </Text>
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          Something went wrong while deleting the {itemsToBeDeleted}.{'\n'}
          Please restart the App and try again or contact support!
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={hideDialog}>Ok</Button>
      </Dialog.Actions>
    </>
  );
}
