import { View, ScrollView } from 'react-native';
import { useAppStateContext } from '../store/context';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Card,
  Chip,
} from 'react-native-paper';

export default function MessageDetailsScreen({ route }) {
  //
  const { id } = route.params;
  const { state } = useAppStateContext();
  const message = state.messages.find((el) => el.id === id);
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
      }}
    >
      <ScrollView contentContainerStyle={{ padding: 5 }}>
        <Surface
          style={{
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Chip
            disabled
            style={{
              paddingTop: 5,
            }}
          >
            <Text variant="titleLarge" style={{ fontStyle: 'italic' }}>
              Title:
            </Text>
          </Chip>

          <Text variant="headlineMedium">{message.title}</Text>
          <IconButton
            icon="square-edit-outline"
            iconColor={theme.colors.primary}
          />
        </Surface>

        <Surface
          style={{
            flexDirection: 'column',
            padding: 10,
            // alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Chip
              disabled
              style={{
                paddingTop: 5,
              }}
            >
              <Text variant="titleLarge" style={{ fontStyle: 'italic' }}>
                Content:
              </Text>
            </Chip>

            <IconButton
              icon="square-edit-outline"
              iconColor={theme.colors.primary}
            />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              // padding: 10,
            }}
          >
            <Text
              variant="headlineMedium"
              style={{ margin: 10, flexWrap: 'wrap', flex: 1 }}
            >
              {message.content}
            </Text>
          </View>
        </Surface>

        <Surface
          style={{
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Chip
            disabled
            style={{
              paddingTop: 5,
            }}
          >
            <Text variant="titleLarge" style={{ fontStyle: 'italic' }}>
              Title:
            </Text>
          </Chip>

          <Text variant="headlineMedium">{message.title}</Text>
          <IconButton
            icon="square-edit-outline"
            iconColor={theme.colors.primary}
          />
        </Surface>

        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen</Text>
        <Text>{id}</Text>
        <Text>MessageDetailsScreen 100</Text>
        <Text>{id}</Text>
      </ScrollView>
    </View>
  );
}
