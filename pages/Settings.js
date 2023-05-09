import { useContext, useState } from 'react';
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
} from 'react-native-paper';
import { PreferencesContext } from '../utils/theme';
import DeletionDialog from '../components/SettingsScreen/DeletionDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Settings() {
  //
  const { isThemeDark, toggleTheme } = useContext(PreferencesContext);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [dialogState, setDialogState] = useState({ visible: false, type: '' });

  return (
    <Surface
      style={{
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: insets.top + 25,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 15,
        paddingRight: insets.right + 15,
      }}
    >
      <Surface
        elevation={0}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginVertical: 5,
          marginBottom: 10,
        }}
      >
        <Text variant="titleLarge">Dark Mode</Text>
        <Switch value={isThemeDark} onValueChange={toggleTheme} />
      </Surface>

      <Divider horizontalInset />

      <Button
        mode="text"
        textColor="red"
        contentStyle={{
          padding: 10,
          // paddingStart: 50,
          // justifyContent: 'flex-start',
        }}
        theme={{ roundness: 0 }}
        onPress={() => {
          console.log(
            '@Settings -- delete All Data was pressed will update state with true, "Data"'
          );
          setDialogState({ visible: true, type: 'Data' });
        }}
      >
        <Text variant="titleLarge" style={{ color: 'red' }}>
          Delete All Data
        </Text>
      </Button>

      <Divider horizontalInset />

      <Button
        mode="text"
        textColor="red"
        contentStyle={{
          padding: 10,
          // paddingStart: 50,
          // justifyContent: 'flex-start',
        }}
        theme={{ roundness: 0 }}
        onPress={() => {
          console.log(
            '@Settings -- delete events was pressed will update state with true, "Events"'
          );
          setDialogState({ visible: true, type: 'Events' });
        }}
      >
        <Text variant="titleLarge" style={{ color: 'red' }}>
          Delete Events
        </Text>
      </Button>

      <Divider horizontalInset />

      <Button
        mode="text"
        textColor="red"
        contentStyle={{
          padding: 10,
          // paddingStart: 50,
          // justifyContent: 'flex-start',
        }}
        theme={{ roundness: 0 }}
        onPress={() => {
          console.log(
            '@Settings -- delete Messages was pressed will update state with true, "Messages"'
          );
          setDialogState({ visible: true, type: 'Messages' });
        }}
      >
        <Text variant="titleLarge" style={{ color: 'red' }}>
          Delete Messages
        </Text>
      </Button>

      <Divider horizontalInset />

      <Button
        mode="text"
        // textColor="red"
        contentStyle={{
          padding: 10,
          // paddingStart: 50,
          // justifyContent: 'flex-start',
        }}
        theme={{ roundness: 0 }}
        onPress={() => {
          console.log('lplplpl');
        }}
      >
        <Text variant="titleLarge" style={{}}>
          Contact Us
        </Text>
      </Button>

      <Portal>
        <DeletionDialog
          visible={dialogState.visible}
          itemsToBeDeleted={dialogState.type}
          hideDialog={() => setDialogState({ visible: false, type: '' })}
        />
      </Portal>
    </Surface>
  );
}
