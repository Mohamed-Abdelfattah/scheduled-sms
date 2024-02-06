export default function MessagesStackScreen({ navigation }) {
  //
  const theme = useTheme();

  return (
    // <>
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Messages',
        headerTitleAlign: 'center',
        // headerBackVisible: true,
        headerStyle: { backgroundColor: theme.colors.primaryContainer },
      }}
    >
      <Stack.Screen
        name="Messages List"
        component={MessagesScreen}
        options={{ headerTitle: 'Messages', headerShown: true }}
      />

      {/* <Stack.Screen name="New Message" component={NewMessageScreen} /> */}
      <Stack.Screen name="New Message" component={NewMessageScreenPaper} />

      <Stack.Screen
        name="Message Details"
        component={MessageDetailsScreen}
        // options={({ route, navigation }) => {
        //   const { title } = route.params;
        //   return { headerTitle: title };
        // }}
      />
    </Stack.Navigator>
    // </>
  );
}
