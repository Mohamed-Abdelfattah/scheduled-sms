import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';

export default function App() {
  //
  const [inputText, setInputText] = useState('');
  const [goalsList, setGoalsList] = useState([]);

  const inputChangeHandler = (enteredText) => {
    // console.log(enteredText);
    setInputText(enteredText);
  };

  const addGoalHandler = () => {
    // setGoalsList((currentGoalsList) => [...currentGoalsList, inputText]);

    // better have the item as an object that contains a key property if FlatList component will be used as it searches for an key property to be assigned as a key
    // setGoalsList((currentGoalsList) => [
    //   ...currentGoalsList,
    //   { text: inputText, key: Math.random().toString() },
    // ]);

    // typically most data fetched from api will contain an id and thus we will need to convert this id to a key when using FlatList Component
    setGoalsList((currentGoalsList) => [
      ...currentGoalsList,
      { text: inputText, id: Math.random().toString() },
    ]);
    setInputText('');
  };

  const deleteGoalHandler = (id) => {
    // console.log('delete item, id =');
    // id ? console.log(id) : console.log('no id was passed');
    setGoalsList((currentGoalsList) => {
      return currentGoalsList.filter((goal) => goal.id !== id);
    });
  };

  return (
    <View style={styles.appContainer}>
      <StatusBar style="auto" />

      <GoalInput
        inputChangeHandler={inputChangeHandler}
        addGoalHandler={addGoalHandler}
        textValue={inputText}
      />

      <View style={styles.goalsContainer}>
        {/*useful incase of small lists or article cause all the content will be rendered even if it's not visible which may cause performance issues in case of long lists or dynamic lists */}
        {/* <ScrollView>
          {goalsList.map((goal) => (
            <View style={styles.goalItem} key={goal}>
              <Text style={styles.goalText}>
                {goal}
              </Text>
            </View>
          ))}
        </ScrollView> */}
        <FlatList
          data={goalsList}
          renderItem={(itemData) => (
            // itemDate will be an object constructed by RN that will have several properties in it like index and the item itself
            // also the rendered output shouldn't have a key value as the FlatList will provide the key
            <GoalItem
              id={itemData.item.id}
              text={itemData.item.text}
              onDelete={deleteGoalHandler}
            />
          )}
          // FlatList component will assign a value for the key attribute by searching for a property named key in the items of the data which was passed to be rendered and hence items in the data should be represented in object form
          // but if the item object in the data have no key property then we will need to extract a value to be a key for each item to be rendered and so we will use the below fn
          keyExtractor={(item, index) => {
            // console.log('extracting key', item.id, '--', index);
            return item.id;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1 /**for the upper most container setting to 1 will extend the view to the whole screen */,
    paddingTop: 50,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },

  goalsContainer: {
    flex: 5,
  },
});
