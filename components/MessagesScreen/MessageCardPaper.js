import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Card,
  Chip,
  Divider,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function MessageCardPaper({ item }) {
  //
  const navigation = useNavigation();
  const { id, title, content, recipients, sendingDate, rules } = item;
  const { height, width } = useWindowDimensions();
  const theme = useTheme();

  //   console.log(item, id, title, content, recipients, sendingDate, rules);

  const pressHandler = () => {
    console.log('pressed on message - id =', item.id);
    // navigate to the message details/edit page and will render/populate the message input fields using the id
    // navigation.navigate('Messages', {
    //   screen: 'Message Details',
    //   params: { id: item.id },
    // });
    navigation.navigate('Messages', {
      screen: 'Messages List',
      params: { id, title, navigateTo: 'MessageDetails' },
    });
  };

  return (
    <Card
      onPress={pressHandler}
      style={{
        width: 0.6 * width,
        height: 200,
        marginEnd: 20,
      }}
    >
      <Card.Title title={title} titleVariant="titleLarge" />

      <Card.Content style={{ minHeight: '25%' }}>
        <Text variant="bodyLarge">{content}</Text>
      </Card.Content>

      {/* <Divider horizontalInset /> */}

      <Card.Content
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingVertical: 15,
        }}
      >
        {!recipients.length ? (
          <Chip icon="account-off">
            <Text>No recipients</Text>
          </Chip>
        ) : recipients.length > 1 ? (
          <Chip icon="account-group">{recipients.length + ' recipients'}</Chip>
        ) : (
          <Chip icon="account">{recipients.length + ' recipient'}</Chip>
        )}

        {rules.repeat ? (
          <Chip icon="repeat">{rules.repeatEvery}</Chip>
        ) : (
          <Chip icon="repeat-off">Once</Chip>
        )}
      </Card.Content>

      {/* <Card.Content>
        <Chip
          icon="calendar-clock"
          style={{ backgroundColor: 'transparent' }}
          textStyle={{ color: 'grey' }}
        >
          {sendingDate.toLocaleString()}
        </Chip>
      </Card.Content> */}

      <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <MaterialCommunityIcons
          name="calendar-clock"
          size={24}
          color={theme.colors.primary}
        /> */}
        {/* <MaterialCommunityIcons
            name="message-text-clock-outline"
            size={24}
            color={theme.colors.primary}
          /> */}
        <MaterialCommunityIcons
          name="clock-check-outline"
          size={24}
          color={theme.colors.primary}
        />
        <Text
          variant="titleSmall"
          style={{ fontStyle: 'italic', color: 'grey', paddingHorizontal: 10 }}
        >
          {sendingDate.toLocaleString()}
        </Text>
        <MaterialCommunityIcons
          name="email-fast-outline"
          size={24}
          color={theme.colors.primary}
        />
        {/* <Text>{new Date().toLocaleString()}</Text> */}
      </Card.Content>
    </Card>
  );
}
