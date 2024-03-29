import { View, Platform } from 'react-native';
import { Text, useTheme, MD3Colors } from 'react-native-paper';
import { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ButtonPrimaryOutline from '../shared/Button';

const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function ChooseDate({ dateProp, applyChoiceCallback }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // const [selected, setSelected] = useState(new Date());
  const selectedDate = dateProp ? new Date(dateProp) : new Date();
  selectedDate.setUTCSeconds(0);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    // console.log(
    //   `${WEEK_DAYS[date.getDay()]}(${date.getDay()}), ${date.getDate()} - ${
    //     MONTHS_SHORT[date.getMonth()]
    //   }(${date.getMonth()}) - ${date.getFullYear()}`
    // );
    // console.log(date.getHours(), date.getMinutes());
    // console.log(
    //   date.toDateString(),
    //   '--',
    //   date.toLocaleTimeString(),
    //   '--',
    //   date.toTimeString()
    // );

    // const newDate = dateProp
    //   ? new Date(dateProp)
    //   : new Date();
    // newDate.setUTCDate(date.getUTCDate());
    // newDate.setUTCMonth(date.getUTCMonth());
    // newDate.setUTCFullYear(date.getUTCFullYear());
    selectedDate.setUTCDate(date.getUTCDate());
    selectedDate.setUTCMonth(date.getUTCMonth());
    selectedDate.setUTCFullYear(date.getUTCFullYear());

    applyChoiceCallback({ sendingDate: selectedDate });

    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    // console.log(
    //   `${WEEK_DAYS[time.getDay()]}(${time.getDay()}), ${time.getDate()} - ${
    //     MONTHS_SHORT[time.getMonth()]
    //   }(${time.getMonth()}) - ${time.getFullYear()}`
    // );
    // console.log(time.getHours(), time.getMinutes());
    // console.log(
    //   time.toDateString(),
    //   '--',
    //   time.toLocaleTimeString(),
    //   '--',
    //   time.toTimeString()
    // );

    // const newTime = dateProp
    //   ? new Date(dateProp)
    //   : new Date();
    // // newTime.setUTCSeconds(time.getUTCSeconds());
    // newTime.setUTCMinutes(time.getUTCMinutes());
    // newTime.setUTCHours(time.getUTCHours());
    selectedDate.setUTCHours(time.getUTCHours());
    selectedDate.setUTCMinutes(time.getUTCMinutes());

    applyChoiceCallback({ sendingDate: selectedDate });

    hideTimePicker();
  };

  return (
    <>
      <Text
        variant="bodyLarge"
        style={[
          { paddingBottom: 5, textAlign: 'center' },
          !dateProp && { color: MD3Colors.error50 },
        ]}
      >
        {dateProp ? dateProp.toLocaleString() : 'No Date was selected'}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <ButtonPrimaryOutline label="Select Date" onPress={showDatePicker} />
        <ButtonPrimaryOutline label="Select Time" onPress={showTimePicker} />
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'date'}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
        date={selectedDate}
        themeVariant="light"
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode={'time'}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
        minimumDate={new Date()}
        date={selectedDate}
        // modalStyleIOS={}
        // isDarkModeEnabled
        themeVariant="light"
      />
    </>
  );
}
