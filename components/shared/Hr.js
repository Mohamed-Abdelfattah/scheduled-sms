import { StyleSheet, View } from 'react-native';

function Hr({ color = '#333', marginV = 5, marginH = 0 }) {
  return (
    <View
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: +marginV,
        marginHorizontal: +marginH,
        borderColor: color,
      }}
    />
  );
}

export default Hr;
