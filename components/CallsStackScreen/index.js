import { Stack } from '../../navigation/Navigators';
import { useTheme } from 'react-native-paper';

export default function CallsStackScreen({ navigation }) {
  //
  const theme = useTheme();

  return (
    // <>
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Calls',
        headerTitleAlign: 'center',
        // headerBackVisible: true,
        headerStyle: { backgroundColor: theme.colors.primaryContainer },
      }}
    >
      <Stack.Screen
        name="Calls List"
        component={CallsScreen}
        options={{ headerTitle: 'Calls', headerShown: true }}
      />

      {/* <Stack.Screen name="New Call" component={NewCallScreen} /> */}
      <Stack.Screen name="New Call" component={NewCallScreenPaper} />

      <Stack.Screen
        name="Call Details"
        component={CallDetailsScreen}
        // options={({ route, navigation }) => {
        //   const { title } = route.params;
        //   return { headerTitle: title };
        // }}
      />
    </Stack.Navigator>
    // </>
  );
}
