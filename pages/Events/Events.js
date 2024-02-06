import { View, FlatList, ScrollView } from 'react-native';
import { Card, Text, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStateContext } from '../../store/context';
import ListEmptyComponent from '../components/MessagesScreen/ListEmptyComponent';
import NotificationCard from '../../components/NotificationCard';
import Hr from '../../components/shared/Hr';
import { useState } from 'react';
import SelectFilters from '../../components/EventsScreen/SelectFilter';

export default function Events() {
  //
  // possible event.state values: 'scheduled', 'warning', 'warning2Hours', 'warning1Day', 'failure', 'success';
  const insets = useSafeAreaInsets();
  const { state } = useAppStateContext();
  const [eventsFilter, setEventsFilter] = useState({
    label: 'All',
    value: 'all',
  });

  const filteredEvents = state.events.filter((event) => {
    // get all the events if the filter is 'all'
    if (eventsFilter.value === 'all') return true;
    // for the 'upcoming' filter we will get any events that have a state of 'warning' or 'warning1Day' or 'warning2Hours' which is have a warning card theme
    if (eventsFilter.value === 'upcoming')
      return (
        event.state === 'warning' ||
        event.state === 'warning1Day' ||
        event.state === 'warning2Hours'
      );
    // the remaining filters are 'scheduled', 'failure' and 'success' which matches the event.state
    return event.state === eventsFilter.value;
  });

  console.log('events:', state.events);

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingRight: insets.right + 10,
        paddingLeft: insets.left + 10,
        paddingBottom: insets.bottom + 50,
      }}
    >
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 3,
          paddingEnd: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text variant="headlineSmall">Messages</Text>

        <SelectFilters
          appliedFilter={eventsFilter}
          callbackFn={setEventsFilter}
        />
        {/* <FAB icon="filter-menu" customSize={38} label="All" /> */}
      </View>

      <FlatList
        // data={upcoming}
        data={filteredEvents}
        renderItem={(itemData) => {
          return <NotificationCard data={itemData.item} />;
        }}
        // not needed as in the docs "The default extractor checks item.key, then item.id, and then falls back to using the index, like React does."
        // checked on devTools ... id is used by default
        // keyExtractor={(item, index) => item.messageTitle}
        horizontal
        ListEmptyComponent={
          <ListEmptyComponent
            titleText="No Events were added yet!"
            bodyText="Cards for all the events of the scheduled messages will appear in this section once you schedule some"
          />
        }
        centerContent
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      {/* the plan is to add 2other sections for whatsapp and for calls, by adding sections that are separated by a Hr */}
      {/* another idea is to use a top-tab-navigation instead of the current stack-navigation which will have messages, calls and whatsApp tabs */}
      {/* <Hr marginV={10} color="#333" marginH={5} /> */}
    </ScrollView>
  );
}
