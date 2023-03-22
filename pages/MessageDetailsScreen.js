import { View, ScrollView } from 'react-native';
import { useAppStateContext } from '../store/context';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Card,
  Chip,
  Button,
  TextInput,
  HelperText,
  Checkbox,
} from 'react-native-paper';
import EditableItem from '../components/MessageDetailsScreen/EditableItem';
import { useState } from 'react';
import ChooseDate from '../components/NewMessageScreen/ChooseDate';
import SelectRules from '../components/MessageDetailsScreen/SelectRules';

export default function MessageDetailsScreen({ route }) {
  //
  const { id } = route.params;
  const { state } = useAppStateContext();
  const message = state.messages.find((el) => el.id === id);
  const theme = useTheme();
  const [editState, setEditState] = useState({
    isEditing: {
      title: false,
      content: false,
      recipients: false,
      sendingDate: false,
      rules: false,
    },
    changes: {},
  });

  function startEditingHandler(field) {
    setEditState((prev) => ({
      ...prev,
      isEditing: { ...prev.isEditing, [field]: true },
    }));
  }

  function cancelEditingHandler(field) {
    setEditState((prev) => {
      const { [field]: _, ...rest } = prev.changes;
      return {
        ...prev,
        changes: rest,
        isEditing: { ...prev.isEditing, [field]: false },
      };
    });
  }

  const { repeat, repeatEvery } = editState.changes?.rules || message?.rules;

  console.log(
    '@MessageDetailsScreen -- editState.changes.length =',
    Object.keys(editState.changes).length,
    '--- rules:',
    repeat,
    repeatEvery
  );
  console.log(editState);

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
      }}
    >
      <ScrollView contentContainerStyle={{ padding: 5 }}>
        <EditableItem
          label="Title"
          singleRow
          isEditing={editState.isEditing.title}
          startEditing={startEditingHandler.bind(this, 'title')}
          cancelEditing={cancelEditingHandler.bind(this, 'title')}
        >
          {editState.isEditing.title ? (
            <View style={{ flex: 1, paddingStart: 15 }}>
              <TextInput
                dense
                error={editState.changes?.title?.trim() === ''}
                style={{
                  backgroundColor: 'white',
                  fontSize: 22,
                  textAlign: 'center',
                  paddingEnd: 15,
                }}
                multiline
                value={editState.changes?.title ?? message.title}
                onChangeText={(title) => {
                  setEditState((prev) => ({
                    ...prev,
                    changes: { ...prev.changes, title },
                  }));
                }}
              />
              {/* title will be mandatory input that shouldn't be blank */}
              {editState.changes?.title?.trim() === '' && (
                <HelperText
                  type="error"
                  padding="none"
                  visible={editState.changes?.title?.trim() === ''}
                >
                  Error: Title is required
                </HelperText>
              )}
            </View>
          ) : (
            <Text variant="titleLarge" style={{ maxWidth: '50%' }}>
              {message.title}
            </Text>
          )}
        </EditableItem>

        <EditableItem
          label="Content"
          isEditing={editState.isEditing.content}
          startEditing={startEditingHandler.bind(this, 'content')}
          cancelEditing={cancelEditingHandler.bind(this, 'content')}
        >
          {editState.isEditing.content ? (
            <TextInput
              dense
              style={{
                backgroundColor: 'white',
                fontSize: 16,
                lineHeight: 24,
                // textAlign: 'center',
                paddingHorizontal: 7,
                paddingVertical: 0,
                marginBottom: 5,
              }}
              multiline
              numberOfLines={4}
              value={editState.changes?.content ?? message.content}
              onChangeText={(content) => {
                setEditState((prev) => ({
                  ...prev,
                  changes: { ...prev.changes, content },
                }));
              }}
            />
          ) : (
            <Text
              variant="bodyLarge"
              style={{
                padding: 5,
                paddingBottom: 10,
                paddingTop: 11,
                alignSelf: 'center',
              }}
            >
              {message.content}
            </Text>
          )}
        </EditableItem>

        <EditableItem
          label="Recipients"
          isEditing={editState.isEditing.recipients}
          startEditing={startEditingHandler.bind(this, 'recipients')}
          cancelEditing={cancelEditingHandler.bind(this, 'recipients')}
        >
          <Text variant="bodyLarge" style={{ paddingBottom: 5 }}>
            render a flatList or scrollView with the recipients cards
          </Text>
        </EditableItem>

        <EditableItem
          label="Sending Date"
          isEditing={editState.isEditing.sendingDate}
          startEditing={startEditingHandler.bind(this, 'sendingDate')}
          cancelEditing={cancelEditingHandler.bind(this, 'sendingDate')}
        >
          {editState.isEditing.sendingDate ? (
            <ChooseDate
              dateProp={editState.changes?.sendingDate || message.sendingDate}
              applyChoiceCallback={({ sendingDate }) => {
                setEditState((prev) => {
                  return {
                    ...prev,
                    changes: { ...prev.changes, sendingDate },
                  };
                });
              }}
            />
          ) : (
            <Text
              variant="bodyLarge"
              style={{ paddingBottom: 5, textAlign: 'center' }}
            >
              {message.sendingDate.toLocaleString()}
            </Text>
          )}
        </EditableItem>

        <EditableItem
          label="Rules"
          isEditing={editState.isEditing.rules}
          startEditing={startEditingHandler.bind(this, 'rules')}
          cancelEditing={cancelEditingHandler.bind(this, 'rules')}
        >
          {editState.isEditing.rules ? (
            <SelectRules
              repeat={repeat}
              every={repeatEvery}
              callbackFn={(newRules) => {
                setEditState((prev) => {
                  return {
                    ...prev,
                    changes: {
                      ...prev.changes,
                      rules: { ...prev.changes.rules, ...newRules },
                    },
                  };
                });
              }}
            />
          ) : (
            <></>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingBottom: 5,
            }}
          >
            <Text variant="bodyLarge" style={{ maxWidth: '60%' }}>
              Message will be sent{' '}
              {repeat ? 'multiple times, every:' : 'one time only'}
            </Text>
            <View>
              {repeat ? (
                <Chip icon="repeat">{repeatEvery}</Chip>
              ) : (
                <Chip icon="repeat-off">Once</Chip>
              )}
            </View>
          </View>
        </EditableItem>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          padding: 5,
          justifyContent: 'space-between',
        }}
      >
        <Button
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.error}
          icon="delete"
          mode="elevated"
          onPress={() => console.log('Pressed')}
        >
          Delete Message
        </Button>

        <Button
          // allow saving changes only when there are values that were changed and the title value is not blank value
          disabled={
            !Object.keys(editState.changes).length ||
            editState.changes?.title?.trim() === ''
          }
          buttonColor={theme.colors.primary}
          textColor={theme.colors.primaryContainer}
          icon="checkbox-multiple-marked-outline"
          mode="elevated"
          onPress={() => console.log('Pressed')}
        >
          Save Changes
        </Button>
      </View>
    </View>
  );
}
