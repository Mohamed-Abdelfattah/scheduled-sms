import { StyleSheet, View, Text, Pressable } from 'react-native';

function GoalItem(props) {
  // console.log(props);
  return (
    <View style={styles.goalItem}>
      <Pressable
        onPress={props.onDelete.bind(this, props.id)}
        android_ripple={{ color: '#3f0887' }}
        style={({ pressed }) => pressed && styles.pressedItem}
      >
        {/* {console.log('rendering an item -- key')} */}
        <Text style={styles.goalText}>{props.text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  goalItem: {
    margin: 8,
    borderRadius: 6,
    backgroundColor: '#814cc7',
  },

  goalText: {
    padding: 8,
    color: 'white',
  },

  pressedItem: {
    opacity: 0.5,
    // backgroundColor: '#8f63c9',
  },
});

export default GoalItem;
