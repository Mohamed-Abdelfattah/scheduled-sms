import { View, Text } from 'react-native';

export default function MessageDetailsScreen({ route }) {
  const { id } = route.params;

  return (
    <View>
      <Text>MessageDetailsScreen</Text>
      <Text>{id}</Text>
    </View>
  );
}
