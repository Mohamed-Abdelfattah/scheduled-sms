import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Checkbox,
  Text,
  Menu,
  Chip,
  useTheme,
  Divider,
} from 'react-native-paper';

export default function SelectRules({ repeat, every, callbackFn }) {
  //
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const choices = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: '2 Months', value: '2-months' },
    { label: '3 Months', value: '3-months' },
    { label: '6 Months', value: '6-months' },
    { label: 'Year', value: 'year' },
  ];

  console.log('rendering SelectRules -- repeat =', repeat, 'every =', every);

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ padding: 10 }}>
        Choose whether the message should be sent repeatedly or only once:
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Checkbox.Item
          // mode="ios"
          label="Repeat"
          position="leading"
          status={repeat ? 'checked' : 'indeterminate'}
          color={repeat ? theme.colors.primary : theme.colors.error}
          uncheckedColor="red"
          onPress={() => {
            callbackFn({ repeat: true, repeatEvery: every });
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingEnd: 20,
            justifyContent: 'center',
          }}
        >
          <View style={{ flex: 0.5 }}>
            <Text>every: </Text>
          </View>

          <View style={{}}>
            <Menu
              contentStyle={{
                backgroundColor: theme.colors.secondaryContainer,
              }}
              // anchor={{ x: 100, y: 100 }}
              anchorPosition="top"
              anchor={
                <View>
                  <Chip
                    disabled={!repeat}
                    icon="gesture-tap"
                    compact
                    onPress={() => {
                      setVisible(true);
                    }}
                  >
                    {every || 'week'}
                  </Chip>
                </View>
              }
              visible={visible}
              onDismiss={() => {
                setVisible(false);
              }}
            >
              {choices.map((choice, index) => (
                <>
                  <Menu.Item
                    key={choice.value + index}
                    title={choice.label}
                    //   dense
                    onPress={() => {
                      callbackFn({ repeatEvery: choice.value });
                      setVisible(false);
                    }}
                  />
                  {index !== choices.length - 1 && (
                    <Divider key={choice.value} />
                  )}
                </>
              ))}
            </Menu>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <Checkbox.Item
          //   mode="android"
          label="Once"
          position="leading"
          status={!repeat ? 'checked' : 'indeterminate'}
          color={!repeat ? theme.colors.primary : theme.colors.error}
          onPress={() => {
            callbackFn({ repeat: false, repeatEvery: every });
          }}
          //   style={{ borderWidth: 1 }}
        />
      </View>
    </View>
  );
}
