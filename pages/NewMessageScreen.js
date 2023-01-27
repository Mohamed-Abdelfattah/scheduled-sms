import { View, Text, StyleSheet } from 'react-native';

export default function NewMessageScreen() {
  return (
    <View style={styles.container}>
      <Text>NewMessageScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
