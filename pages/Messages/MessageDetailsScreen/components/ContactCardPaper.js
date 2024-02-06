import { View, Pressable, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function ContactCardPaper({
  data,
  closeModal,
  addRecipientCallback,
}) {
  // console.log(data);

  const selectHandler = (number) => {
    // save to receipts to enable removing upon clicking
    const contact = { id: Math.random().toString(), name: data.name, number };
    addRecipientCallback(contact);

    closeModal();
  };

  return (
    <View
      style={{
        margin: 5,
        padding: 5,
        borderRadius: 5,
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#f9f9f9',
        shadowColor: '#c8c8c8',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 3,
        // elevation: 8,
        shadowOpacity: 1,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', padding: 5 }}>
        {data.name}
      </Text>
      {data.number.map((i) => (
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            // paddingBottom: 0,
            marginTop: 5,
            // padding: 5,
          }}
          key={Math.random().toString()}
        >
          <Pressable
            style={({ pressed }) => [
              {
                flex: 1,
                padding: 10,
                paddingBottom: 10,
              },
              pressed
                ? { backgroundColor: '#ebebeb' }
                : { backgroundColor: '#f9f9f9' },
            ]}
            onPress={() => {
              selectHandler(i);
            }}
          >
            <Text style={{ fontSize: 18 }}>{i}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
