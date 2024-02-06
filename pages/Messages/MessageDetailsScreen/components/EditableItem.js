import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Chip, Text, IconButton, useTheme } from 'react-native-paper';

export default function EditableItem({
  singleRow = false,
  label,
  isEditing,
  startEditing,
  cancelEditing,
  children,
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
          paddingBottom: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
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

        <IconButton
          animated
          icon={isEditing ? 'window-close' : 'square-edit-outline'}
          iconColor={theme.colors.primary}
          onPress={isEditing ? cancelEditing : startEditing}
        />

        {/* {isEditing ? (
          <IconButton
            animated
            icon="window-close"
            iconColor={theme.colors.primary}
            onPress={cancelEditing}
          />
        ) : (
          <IconButton
            animated
            icon="square-edit-outline"
            iconColor={theme.colors.primary}
            onPress={startEditing}
          />
        )} */}
      </Surface>
    );

  return (
    <Surface
      style={{
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Chip disabled style={{ paddingVertical: 4 }}>
            <Text variant="titleSmall" style={{ fontStyle: 'italic' }}>
              {label}:
            </Text>
          </Chip>
        </View>

        <IconButton
          animated
          icon={isEditing ? 'window-close' : 'square-edit-outline'}
          iconColor={theme.colors.primary}
          onPress={isEditing ? cancelEditing : startEditing}
        />

        {/* {isEditing ? (
          <IconButton
            animated
            icon="window-close"
            iconColor={theme.colors.primary}
            onPress={cancelEditing}
          />
        ) : (
          <IconButton
            animated
            icon="square-edit-outline"
            iconColor={theme.colors.primary}
            onPress={startEditing}
          />
        )} */}
      </View>

      <View style={{ flex: 1 }}>{children}</View>
    </Surface>
  );
}

const styles = StyleSheet.create({});
