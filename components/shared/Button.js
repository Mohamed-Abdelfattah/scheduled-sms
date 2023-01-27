import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';

const ButtonPrimaryOutline = ({ label, icon, onPress }) => {
  //
  const [pressed, setPressed] = useState(false);

  const handlePressState = () => {
    setPressed((current) => {
      // console.log('changing button state -- curr', current);
      return !current;
    });
  };
  // const handlePressState = useMemo(() => {
  //   setPressed((current) => {
  //     console.log('changing button state -- curr', current);
  //     return !current;
  //   });
  // }, []);

  return (
    <View style={styles.outerContainer}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressState}
        onPressOut={handlePressState}
        style={[
          styles.innerContainer,
          pressed ? styles.pressed : styles.notPressed,
        ]}
      >
        <MaterialCommunityIcons
          // name={pressed ? icon + '-outline' : icon}
          name={icon}
          size={20}
          style={pressed ? styles.pressed : styles.notPressed}
        />
        <Text
          style={[styles.text, pressed ? styles.pressed : styles.notPressed]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 20,
    margin: 4,
    marginEnd: 10,
    overflow: 'hidden',
    backgroundColor: '#cc8',
  },
  innerContainer: {
    // flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#0d6efd',
    borderWidth: 1,
    flexDirection: 'row',
  },
  text: { fontSize: 14, marginStart: 5 },
  // text: { fontSize: 18, color: '#fff', marginStart: 5 },
  notPressed: {
    color: '#0d6efd',
    backgroundColor: '#fff',
  },
  pressed: {
    color: '#fff',
    backgroundColor: '#0d6efd',
  },
});

export default ButtonPrimaryOutline;
