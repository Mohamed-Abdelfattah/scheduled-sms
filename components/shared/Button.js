import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';

const ButtonPrimaryOutline = ({ label, icon, onPress, disabled }) => {
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
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressState}
        onPressOut={handlePressState}
        style={[
          styles.innerContainer,
          disabled
            ? { borderColor: '#c0c0c0' }
            : pressed
            ? styles.pressed
            : styles.notPressed,
        ]}
      >
        <MaterialCommunityIcons
          // name={pressed ? icon + '-outline' : icon}
          name={icon}
          size={20}
          style={pressed ? styles.pressed : styles.notPressed}
        />
        <Text
          style={[
            styles.text,
            disabled
              ? { color: '#c0c0c0' }
              : pressed
              ? styles.pressed
              : styles.notPressed,
            icon ? { marginStart: 5 } : null,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 20,
    margin: 4,
    marginEnd: 10,
    overflow: 'hidden',
    backgroundColor: '#cc8',
  },
  innerContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#0d6efd',
    borderWidth: 1,
    flexDirection: 'row',
  },
  text: { fontSize: 14 },
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
