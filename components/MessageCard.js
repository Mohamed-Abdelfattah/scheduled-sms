import Card from './shared/Card';
import { View, Text } from 'react-native';
import Hr from './shared/Hr';
import { useNavigation } from '@react-navigation/native';

const MessageCard = ({ item }) => {
  const navigation = useNavigation();
  const { id, title, content, to } = item;

  // show spinner while using useEffect to fetch message info a but here all the data will
  // be fetched locally from db upon app initialization and get populated into the global state management (context api)

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
    <Card onPress={pressHandler}>
      <View>
        <Text>{title}</Text>
        <Text>{content}</Text>
        <Hr />
        <Text>
          Sending To:{' '}
          {to?.length > 0 ? (
            to.map(function (contact, index) {
              if (index === this.length - 1)
                return `${contact.name}(${contact.number})`;
              return `${contact.name}(${contact.number}), `;
            }, to)
          ) : (
            <Text>No contacts were added</Text>
          )}
        </Text>
      </View>
    </Card>
  );
};

export default MessageCard;
