import { Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ButtonPrimaryOutline = ({ label, icon }) => {
  return (
    <Pressable
      style={{
        padding: 8,
        borderColor: '#0d6efd',
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 10,
        marginEnd: 10,
      }}
    >
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color="#0d6efd"
        backgroundColor="#fff"
      />
      <Text style={{ fontSize: 20, color: '#0d6efd', marginStart: 5 }}>
        {label}
      </Text>
    </Pressable>
  );
};

export default ButtonPrimaryOutline;
