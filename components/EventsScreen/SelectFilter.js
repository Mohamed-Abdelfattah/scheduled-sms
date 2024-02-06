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

export default function SelectFilters({ appliedFilter, callbackFn }) {
  //
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const choices = [
    { label: 'All', value: 'all' },
    { label: 'Successful', value: 'success' },
    { label: 'Failed', value: 'failure' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Scheduled', value: 'scheduled' },
  ];

  console.log('rendering SelectFilters -- appliedFilter =', appliedFilter);

  return (
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
              icon="filter"
              compact
              onPress={() => {
                setVisible(true);
              }}
            >
              {appliedFilter.label}
            </Chip>
          </View>
        }
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
      >
        {choices.map((choice, index) => (
          <View key={choice.value}>
            <Menu.Item
              key={choice.value + index}
              title={choice.label}
              dense
              onPress={() => {
                callbackFn(choice);
                setVisible(false);
              }}
            />
            {index !== choices.length - 1 && (
              <Divider key={choice.value + (index + 100)} />
            )}
          </View>
        ))}
      </Menu>
    </View>
  );
}
