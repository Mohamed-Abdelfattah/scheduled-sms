import { View, StyleSheet, Text } from 'react-native';

export default function Card({ variant = 'blank', children }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors[variant].background,
          borderColor: colors[variant].border,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 175,
    width: 275,
    padding: 5,
    margin: 10,
    borderWidth: 2,
    borderRadius: 6,
    elevation: 3,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export const colors = {
  primary: {
    fill: '#0a58ca',
    background: '#cfe2ff',
    border: '#9ec5fe',
  },
  danger: {
    fill: '#b02a37',
    background: '#f8d7da',
    border: '#f1aeb5',
  },
  warning: {
    fill: '#997404',
    background: '#fff3cd',
    border: '#ffe69c',
  },
  success: {
    fill: '#146c43',
    background: '#d1e7dd',
    border: '#a3cfbb',
  },
  blank: {
    fill: '#000',
    background: '#fff',
    border: '#000',
  },
};

// #198754 #2d884d  #146c43
// #20c997            #d1e7dd
//                      #a3cfbb
// #dc3545 #b34045  #b02a37
//                      #f8d7da
//                      #f1aeb5
// #fd7e14            #997404
// #ffc107 #fecf6d  #fff3cd
//                      #ffe69c
// #0d6efd #4091d7  #0a58ca
// #0dcaf0 #99e9eb  #cfe2ff
//                      #9ec5fe
