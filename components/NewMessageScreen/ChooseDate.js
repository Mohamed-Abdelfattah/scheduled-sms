import { View, Text, Platform } from 'react-native';
import { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ButtonPrimaryOutline from '../shared/Button';
import { useAppStateContext } from '../../store/context';

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

export default function ChooseDate({}) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  // const [selected, setSelected] = useState(new Date());
  const { state, saveChanges } = useAppStateContext();
  const selectedDate = state.messageFormData.sendingDate
    ? new Date(state.messageFormData.sendingDate)
    : new Date();

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

    // const newDate = state.messageFormData.sendingDate
    //   ? new Date(state.messageFormData.sendingDate)
    //   : new Date();
    // newDate.setUTCDate(date.getUTCDate());
    // newDate.setUTCMonth(date.getUTCMonth());
    // newDate.setUTCFullYear(date.getUTCFullYear());
    selectedDate.setUTCDate(date.getUTCDate());
    selectedDate.setUTCMonth(date.getUTCMonth());
    selectedDate.setUTCFullYear(date.getUTCFullYear());

    saveChanges({ sendingDate: selectedDate });

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

    // const newTime = state.messageFormData.sendingDate
    //   ? new Date(state.messageFormData.sendingDate)
    //   : new Date();
    // // newTime.setUTCSeconds(time.getUTCSeconds());
    // newTime.setUTCMinutes(time.getUTCMinutes());
    // newTime.setUTCHours(time.getUTCHours());
    selectedDate.setUTCMinutes(time.getUTCMinutes());
    selectedDate.setUTCHours(time.getUTCHours());

    saveChanges({ sendingDate: selectedDate });

    hideTimePicker();
  };

  return (
    <View>
      <Text>choose date</Text>
      <Text>
        {state.messageFormData.sendingDate
          ? state.messageFormData.sendingDate.toString()
          : 'No Date was selected'}
      </Text>
      <View style={{ flexDirection: 'row' }}>
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
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode={'time'}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
        minimumDate={new Date()}
        date={selectedDate}
      />
    </View>
  );
}
