import { View, Text } from 'react-native';
import { useState } from 'react';
import ChooseDate from './ChooseDate';
import Checkbox from 'expo-checkbox';
import { useAppStateContext } from '../../store/context';

export default function Rules() {
  const [every, setEvery] = useState('');

  const { state, saveChanges } = useAppStateContext();
  const { repeat, repeatEvery } = state.messageFormData.rules;

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18 }}>Rules</Text>

      <View>
        <Text>choose date</Text>
        <ChooseDate
          dateProp={state.messageFormData.sendingDate}
          applyChoiceCallback={saveChanges}
        />
      </View>

      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '35%',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 16, margin: 5 }}>send once</Text>
          <Checkbox
            value={!repeat}
            onValueChange={(value) =>
              saveChanges({
                rules: { repeat: !value, repeatEvery },
              })
            }
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '35%',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 16, margin: 5 }}>repeat every</Text>
          <Checkbox
            value={repeat}
            onValueChange={(value) =>
              saveChanges({
                rules: { repeat: value, repeatEvery: repeatEvery || 'week' },
              })
            }
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            margin: 5,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text>week</Text>
            <Checkbox
              disabled={!repeat}
              value={repeatEvery === 'week'}
              onValueChange={(value) =>
                saveChanges({
                  rules: { repeat: true, repeatEvery: 'week' },
                })
              }
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>month</Text>
            <Checkbox
              disabled={!repeat}
              value={repeatEvery === 'month'}
              onValueChange={(value) =>
                saveChanges({
                  rules: { repeat: true, repeatEvery: 'month' },
                })
              }
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>3 months</Text>
            <Checkbox
              disabled={!repeat}
              value={repeatEvery === '3-months'}
              onValueChange={(value) =>
                saveChanges({
                  rules: { repeat: true, repeatEvery: '3-months' },
                })
              }
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>6 months</Text>
            <Checkbox
              disabled={!repeat}
              value={repeatEvery === '6-months'}
              onValueChange={(value) =>
                saveChanges({
                  rules: { repeat: true, repeatEvery: '6-months' },
                })
              }
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text>year</Text>
            <Checkbox
              disabled={!repeat}
              value={repeatEvery === 'year'}
              onValueChange={(value) =>
                saveChanges({
                  rules: { repeat: true, repeatEvery: 'year' },
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}
