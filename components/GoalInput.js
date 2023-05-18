import { View, TextInput, Button, StyleSheet } from 'react-native';

function GoalInput(props) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="place your goal"
        value={props.textValuee}
        onChangeText={props.inputChangeHandler}
      />
      <Button title="Add Goal" onPress={props.addGoalHandler} />
    </View>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    // borderColor: 'black',
    // borderWidth: 2,
  },

  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    // width: '80%',
    marginRight: 8,
    padding: 8,
  },
});

export default GoalInput;
