import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Events() {
  //
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right + 10,
        paddingLeft: insets.left + 10,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <Text>Events</Text>
    </View>
  );
}
