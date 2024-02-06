import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Chip, Text, useTheme } from 'react-native-paper';

export default function InputItem({
  singleRow = false,
  label,
  children,
  style,
}) {
  //
  const theme = useTheme();

  if (singleRow)
    return (
      <Surface
        style={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          ...style,
        }}
      >
        <View>
          <Chip disabled style={{ paddingVertical: 4 }}>
            <Text variant="titleSmall" style={{ fontStyle: 'italic' }}>
              {label}:
            </Text>
          </Chip>
        </View>

        {children}
      </Surface>
    );

  return (
    <Surface
      style={{
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        ...style,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ paddingBottom: 10 }}>
          <Chip disabled style={{ paddingVertical: 4 }}>
            <Text variant="titleSmall" style={{ fontStyle: 'italic' }}>
              {label}:
            </Text>
          </Chip>
        </View>
      </View>

      <View style={{ flex: 1 }}>{children}</View>
    </Surface>
  );
}

const styles = StyleSheet.create({});
