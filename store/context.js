import { createContext, useContext, useReducer } from 'react';
import * as Notifications from 'expo-notifications';
import {
  getAppData,
  init,
  addMessage,
  editMessage,
  addEvent,
  editEvent,
  updateEvent,
  getMessages,
  getEvents,
  deleteMessage,
  deleteEvent,
} from './database';
import { Alert } from 'react-native';
import { getNextDate } from '../utils/helpers';

const AppStateContext = createContext({
  state: initialState,
  initializeApp: async () => ({}),
  /**function to create a message and store it into the db -- the new message data will be saved upon change/choice into messageFormData state (to have easy access in components) - this state will be reset after saving creating teh new message */
  createNewMessage: async () => {},
  /**function to handle message editing and will expect messageData object that should contain the id for the message to be edited and the new fields to be updated only -- any data on the message can be updated and for the sendingDate the date picker will assure that date must be later to the day of editing the message */
  editMessageHandler: async (messageData) => {},
  /**function to update the event state in the db and then sync the global state with the db - will accept an object containing a key of the newState to be updated into and value of an array of eventIds to be updated*/
  updateEventHandler: async (updates) => {},
  /**function to handle inputs for new message and save them to the global state
   *
   *  the payload must be an object that contains named property of the new data to be saved, example: for changing title => payload = {title:'new'}, content => {content:'new'}
   *
   *  will update the messageFormData state with the new data to be saved should expect object that contains the part of draft to be updated incase of recipients {contacts:[1,2,3]} as state can be accessed on any level, handler in the component can get a copy of the recipients list and push the new number to it and then dispatch draft passing the list as named argument
   */
  saveChanges: (newMessageData) => {},
  /**function to handle message deletion wether it was a specific message or all messages - will expect an object with deleteAllMessages flag which will be defaulted to false and an id incase of single message */
  deleteMessageHandler: async ({ deleteAll, id }) => {},
  /**function to handle event deletion wether it was a specific event or all events - will expect an object with deleteAllEvents flag which will be defaulted to false and an id incase of single event */
  deleteEventHandler: async ({ deleteAll, id }) => {},
  /**function to delete all the messages and events from the database and cancel/clear all notifications if any */
  deleteAllDataHandler: async () => {},
  /**function to handle the response for the user click on a notification - 
  
  * 1) cancel remaining upcoming notifications if any.
  * 2) clear all visible notifications for this event in notification center if any.
  * 3) generate a new event and notifications with the new date if the message to repeated.
  * 4) change this event's state to successful.
  * 5) send the sms using expo-sms (navigate to sms app) */
  handleNotificationClick: async ({
    messageId,
    clickedNotificationIdentifier,
  }) => {},
});
// const DispatchActionsContext = createContext();

export const useAppStateContext = () => {
  return useContext(AppStateContext);
};
// export const useDispatchActionsContext = () => {
//   return useContext(DispatchActionsContext);
// };

export default function GlobalContextProvider({ children }) {
  //
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [state, setState] = useState(initialState);

  const initializeApp = async () => {
    console.log('@context @initializeApp ');
    dispatch({ type: types.LOADING });
    try {
      // create tables if not existing
      await init();
      console.log(
        '@context @GlobalContextProvider @initializeApp --- succeeded to initialize the database'
      );
      // fetch data from db and populate state {messages:[],events:[]}
      const data = await getAppData();
      console.log(
        '@context @GlobalContextProvider @initializeApp --- succeeded to fetch data from the database',
        data
      );
      dispatch({ type: types.SUCCESS, payload: data });
      return data;
    } catch (err) {
      let errorString = '';
      for (const error of err.errors) {
        console.log(
          '@context @GlobalContextProvider @initializeApp --- failed to initialize the database or populate the app data ---',
          error
        );
        errorString += `\n ${error}`;
      }
      dispatch({
        type: types.ERROR,
        payload: `error while initializing --- ${errorString}`,
      });
    }
  };

  /**function to create a message and store it into the db -- the new message data will be saved upon change/choice into messageFormData state (to have easy access in components) - this state will be reset after saving creating teh new message */
  // async function createNewMessage(messageData) {
  async function createNewMessage() {
    dispatch({ type: types.LOADING });
    const { messageFormData: messageData } = state;
    try {
      const messageId = await addMessage(messageData);
      console.log(
        '@context @GlobalContextProvider @createNewMessage --- success adding message to the database',
        messageId
      );
      // create a notification for sending the message with the upcoming sendingDate
      // 1 notification will be created for each message which will be fired on the sendingDate and if the message to be repeated then a new notification for the next sending date will be created - in case of editing the sending date or the message title this notification should be cancelled and a new one shall be created with the updated info - upon removing all the messages and corresponding events cancelAllNotifications shall be called
      // might need 2 more notifications and all of the notifications ids should be saved into event as an object {inTimeNotification,after2HoursNotification,after1DayNotification} - if user interacted to the inTimeNotification the others will be cancelled and if not then user will be notified again in 2 hours later and so on - also when user interacts to a notification if the message was to repeat then a new notifications shall be created and a new event as well
      const notificationsIdentifiers = await createNotifications({
        date: new Date(messageData.sendingDate),
        title: messageData.title,
        messageId,
      });
      console.log(
        '@context @GlobalContextProvider @createNewMessage --- success creating notification which will be added to event - notificationId =',
        notificationsIdentifiers
      );
      // should pass the upcoming sending date to the addEvent function
      const eventId = await addEvent(
        messageId,
        messageData.sendingDate,
        notificationsIdentifiers
      );
      console.log(
        '@context @GlobalContextProvider @createNewMessage --- success adding event to the database',
        eventId
      );
      // keep state synced with db, fetch data from db and populate state {messages:[],events:[]}
      const data = await getAppData();
      console.log(
        '@context @GlobalContextProvider @createNewMessage --- succeeded to fetch data from the database',
        data
      );
      //  update state and reset the messageFormData
      dispatch({
        type: types.SUCCESS,
        payload: {
          ...data,
          messageFormData: {
            title: '',
            content: '',
            recipients: [],
            sendingDate: '',
            rules: { repeat: false, repeatEvery: '' },
          },
        },
      });
    } catch (error) {
      console.log(
        '@context @GlobalContextProvider @createNewMessage --- error while fetching messages and updating the app state',
        error
      );
      dispatch({
        type: types.ERROR,
        payload: `error while adding messages to database --- ${error}`,
      });
    }
  }

  // in the message details page there will be an edit icon that switches the field to an input populated with the current value to be edited and for the date an date  picker modal will appear to choose date and all the changes should be saved in preserved in the local state in the details page
  /**function to handle message editing and will expect messageData object that should contain the id for the message to be edited and the new fields to be updated only -- any data on the message can be updated and for the sendingDate the date picker will assure that date must be later to the day of editing the message */
  async function editMessageHandler(messageData) {
    dispatch({ type: types.LOADING });
    try {
      const res = await editMessage(messageData.id, messageData);
      console.log(
        '@context @GlobalContextProvider @editMessageHandler --- success editing message in the database',
        res
      );
      // cancel the existing notification and create a new one with the new data - the possible scenarios are:
      // 1- there is an upcoming notification and the message data that will appear in the notification (currently the messageTitle) have changed and for that the notification should have the new info an so a new notification should be created
      // 2- there is no upcoming notifications so the notificationId is for a notification that was already done - we will also call cancelNotification function as it will not fail if there is no notification connected to id (from documentation: Returns A Promise resolves once the scheduled notification is successfully canceled or if there is no scheduled notification for a given identifier.)
      // for case 2 if the sending date haven't changed and the message was already sent/notification was already done so the change only needs to update the title then we need to create new notification that have the same date - for that might want to get the whole message data when editing a message

      // edit the upcoming event if the sendingDate was changed
      if (messageData?.sendingDate) {
        // get the eventId by searching the state.events and select the one with scheduled states or get null incase of no upcoming events
        const eventId =
          state.events.find(
            (event) =>
              event.messageId === messageData.id && event.state === 'scheduled'
          ).id ?? null;
        // if there is an upcoming event then the sending date should be changed on this event and if no event then a new one should be added
        if (eventId === null) {
          await addEvent(messageData.id, messageData.sendingDate);
        } else {
          await editEvent(eventId, messageData.sendingDate);
        }
        console.log(
          '@context @GlobalContextProvider @editMessageHandler --- success editing event in the database',
          eventId
        );
      }
      // keep state synced with db, fetch data from db and populate state {messages:[],events:[]}
      const data = await getAppData();
      console.log(
        '@context @GlobalContextProvider @editMessageHandler --- succeeded to fetch data from the database',
        data
      );
      // update state
      dispatch({ type: types.SUCCESS, payload: data });
    } catch (error) {
      console.log(
        '@context @GlobalContextProvider @editMessageHandler --- error while editing message ',
        error
      );
      dispatch({
        type: types.ERROR,
        payload: `error while editing message in database --- ${error}`,
      });
    }
  }

  /**function to update the event state in the db and then sync the global state with the db - will accept an object containing a key of the newState to be updated into and value of an array of eventIds to be updated*/
  async function updateEventHandler(updates) {
    dispatch({ type: types.LOADING });
    try {
      const res = await updateEvent(updates);
      console.log(
        '@context @GlobalContextProvider @updateEventHandler --- success updating event state in the database',
        res
      );
      // keep the global state synced with the db by getting repopulating the events
      const data = await getEvents();
      // update state
      dispatch({ type: types.SUCCESS, payload: data });
    } catch (error) {
      console.log(
        '@context @GlobalContextProvider @updateEventHandler --- error while updating event state',
        error
      );
      dispatch({
        type: types.ERROR,
        payload: `error while editing event in database --- ${error}`,
      });
    }
  }

  /**function to handle message deletion wether it was a specific message or all messages - will expect an object with deleteAllMessages flag which will be defaulted to false and an id incase of single message */
  async function deleteMessageHandler({ deleteAll = false, id }) {
    dispatch({ type: types.LOADING });
    try {
      const res = await deleteMessage({ deleteAll, messageId: id });
      console.log(
        '@context @GlobalContextProvider @deleteMessageHandler --- success deleting message from database',
        res
      );

      // get the event by searching the state.events and select the one that is not settled yet (scheduled or warning) or get null incase of no upcoming events
      const event =
        state.events.find(
          (event) =>
            event.messageId === id &&
            !['success', 'failure'].includes(event.state)
        ) ?? null;
      // if there is an upcoming event then any upcoming notifications should be cancelled and any displayed ones in the tray should be dismissed
      // and this event should be deleted as well - will only delete the upcoming events and keep the old/done/fulfilled ones as logs and whenever trying to access a deleted message a screen telling user that message was deleted
      if (event) {
        for (let notification of event.notificationId) {
          Notifications.cancelScheduledNotificationAsync(notification);
          Notifications.dismissNotificationAsync(notification);
        }
      }
      // if all messages to be deleted then we need to cancel all notifications and dismiss all notifications in tray if any
      if (deleteAll) {
        Notifications.cancelAllScheduledNotificationsAsync();
        Notifications.dismissAllNotificationsAsync();
      }
      //if all messages to be deleted then we need to delete any event that is not fulfilled
      await deleteEvent({
        deleteAllUpcoming: deleteAll,
        eventId: event?.id,
      });
      console.log(
        '@context @GlobalContextProvider @deleteMessage --- success deleing event from database and cancel notifications',
        event
      );

      // keep state synced with db, fetch data from db and populate state {messages:[],events:[]}
      const data = await getAppData();
      console.log(
        '@context @GlobalContextProvider @deleteMessage --- succeeded to fetch data from the database',
        data
      );
      // update state
      dispatch({ type: types.SUCCESS, payload: data });
    } catch (error) {
      console.log(
        '@context @GlobalContextProvider @deleteMessageHandler --- error while deleting message state',
        error
      );
      dispatch({
        type: types.ERROR,
        payload: `error while deleing message in database --- ${error}`,
      });
    }
  }

  /**function to handle event deletion wether it was a specific event or all events - will expect an object with deleteAllEvents flag which will be defaulted to false and an id incase of single event */
  async function deleteEventHandler({ deleteAll = false, id }) {
    dispatch({ type: types.LOADING });
    try {
      const event = state.events.find((event) => event.id === id) ?? null;
      // clear any upcoming notifications and dismiss any notifications in the tray
      if (event && !['success', 'failure'].includes(event.state)) {
        for (let notification of event.notificationId) {
          Notifications.cancelScheduledNotificationAsync(notification);
          Notifications.dismissNotificationAsync(notification);
        }
      }
      // in case of deleting all events of the app then we will cancel all upcoming notifications and clear the tray
      if (deleteAll) {
        Notifications.cancelAllScheduledNotificationsAsync();
        Notifications.dismissAllNotificationsAsync();
      }
      // delete the event from database
      const res = await deleteEvent({ deleteAll, eventId: id });
      console.log(
        '@context @GlobalContextProvider @deleteEventHandler --- success deleting event from database',
        res
      );

      // keep state synced with db, fetch data from db and populate state {events:[],events:[]}
      const data = await getEvents();
      console.log(
        '@context @GlobalContextProvider @deleteEventHandler --- succeeded to fetch data from database',
        data
      );
      // update state
      dispatch({ type: types.SUCCESS, payload: data });
    } catch (error) {
      console.log(
        '@context @GlobalContextProvider @deleteEventHandler --- error while deleting event state',
        error
      );
      dispatch({
        type: types.ERROR,
        payload: `error while deleing event in database --- ${error}`,
      });
    }
  }

  /**function to delete all the messages and events from the database and cancel/clear all notifications if any */
  async function deleteAllDataHandler() {
    dispatch({ type: types.LOADING });

    try {
      // delete All events which will also clear and cancel all notifications if any
      const res = await deleteEvent({ deleteAll: true });
      console.log(
        '@context @GlobalContextProvider @deleteAllDataHandler --- success deleting all events from database',
        res
      );
      // delete all messages
      const result = await deleteMessage({ deleteAll: true });
      console.log(
        '@context @GlobalContextProvider @deleteAllDataHandler --- success deleting all messages from database',
        result
      );
      // sync the state with the database
      const data = await getAppData();
      console.log(
        '@context @GlobalContextProvider @deleteAllDataHandler --- succeeded to fetch data from the database',
        data
      );
      // update state
      dispatch({ type: types.SUCCESS, payload: data });
    } catch (error) {
      console.log(
        '@context @GlobalContextProvider @deleteAllDataHandler --- error while deleting all data',
        error
      );
      dispatch({
        type: types.ERROR,
        payload: `error while deleing all data in database --- ${error}`,
      });
    }
  }

  /**function to handle the response for the user click on a notification - 
  
  * 1) cancel remaining upcoming notifications if any.
  * 2) clear all visible notifications for this event in notification center if any.
  * 3) generate a new event and notifications with the new date if the message to repeated.
  * 4) change this event's state to successful.
  * 5) send the sms using expo-sms (navigate to sms app) */
  async function handleNotificationClick({
    messageId,
    clickedNotificationIdentifier,
  }) {
    // for some reason the app state isn't loaded as if clicking on the notification reopens the app from the start so the app never gets initialized, this case should be covered by useEffect as in production app will be opened and initialized, now I'll call populate app data from the responses handler
    // apparently the reason for that was closure and for that handleNotificationClick should have been added to the dependency array in the useEffect so that the function in useEffect gets the latest update of the state
    dispatch({ type: types.LOADING });

    try {
      // clear the remaining notifications by getting the event id and dismiss any displayed notifications for this message/event
      const event =
        state.events.find(
          (event) =>
            event.messageId === messageId &&
            Object.values(event.notificationId).includes(
              clickedNotificationIdentifier
            )
        ) ?? null;

      for (let identifier of Object.values(event.notificationId)) {
        // 1) ->
        await Notifications.cancelScheduledNotificationAsync(identifier);
        // 2) ->
        await Notifications.dismissNotificationAsync(identifier);
      }

      // check if the message to be repeated and generate new event with notifications
      const message = state.messages.find((el) => el.id === messageId);
      if (message.rules.repeat) {
        // get current sending date
        const originalDate = new Date(event.sentOn.getTime());
        // get the original day of the sending date (to check if 31 last day of the month)
        originalDate.setDate(message.sendingDate.getDate());
        // get the new sending date
        const newSendingDate = getNextDate({
          originalDate,
          interval: message.rules.repeatEvery,
        });
        // create notifications and new event
        const notificationsIdentifiers = await createNotifications({
          date: new Date(newSendingDate),
          title: message.title,
          messageId,
        });
        const eventId = await addEvent(
          messageId,
          new Date(newSendingDate),
          notificationsIdentifiers
        );
      }

      // 4) ->
      // update the event state in db and fetch the events again to get the latest updates
      await updateEvent({ success: [event.id] });
      const newEvents = await getEvents();
      dispatch({ type: types.SUCCESS, payload: newEvents });

      // return message data to be used in sending sms
      return {
        addresses: message.recipients.map((person) => person.number),
        message: message.content,
      };
    } catch (err) {
      console.log('----- error while handling clicked notification ----', err);
      throw new Error(
        '----- error while handling clicked notification ----' + err
      );
    }
  }

  /**function to handle inputs for new message and save them to the global state
   *
   *  the payload must be an object that contains named property of the new data to be saved, example: for changing title => payload = {title:'new'}, content => {content:'new'}
   *
   *  will update the messageFormData state with the new data to be saved should expect object that contains the part of draft to be updated incase of recipients {contacts:[1,2,3]} as state can be accessed on any level, handler in the component can get a copy of the recipients list and push the new number to it and then dispatch draft passing the list as named argument
   */
  function saveChanges(newMessageData) {
    dispatch({ type: types.DRAFT, payload: newMessageData });
  }

  return (
    <>
      <AppStateContext.Provider
        value={{
          state,
          initializeApp,
          createNewMessage,
          editMessageHandler,
          updateEventHandler,
          saveChanges,
          deleteMessageHandler,
          deleteEventHandler,
          deleteAllDataHandler,
          handleNotificationClick,
        }}
      >
        {/* <DispatchActionsContext.Provider value={dispatch}> */}
        {children}
        {/* </DispatchActionsContext.Provider> */}
      </AppStateContext.Provider>
    </>
  );
}

const types = {
  LOADING: 'SET_STATUS_TO_LOADING_WHILE_FETCHING',
  SUCCESS: 'SET_STATUS_TO_SUCCESS_IF_NO_ERRORS',
  ERROR: 'SET_STATUS_TO_ERROR',
  RESEND: 'ADD_SENDING_EVENT',
  SEND: 'SEND_MESSAGE',
  FAILURE: 'SET_STATUS_TO_FAILURE_BECAUSE_ERROR',
  DRAFT: 'SAVE_MESSAGE_FORM_DATA_INTO_STATE',
};

const initialState = {
  status: '',
  messages: [],
  events: [],
  error: null,
  messageFormData: {
    title: '',
    content: '',
    recipients: [],
    sendingDate: '',
    rules: { repeat: false, repeatEvery: '' },
  },
};

async function configureNotifications() {
  const settings = await Notifications.getPermissionsAsync();
  const { status: existingStatus } = settings;
  // console.log('@configureNotifications -- settings =', settings);
  // console.log('@configureNotifications -- getPermissions =', existingStatus);
  let finalStatus = existingStatus;
  // console.log('@configureNotifications -- finalStatus =', finalStatus);
  if (!settings.granted || existingStatus !== 'granted') {
    console.log(
      '@configureNotifications -- existingStatus not granted -- will request permissions'
    );
    const res = await Notifications.requestPermissionsAsync({
      android: {},
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
        //  additional
        allowDisplayInCarPlay: true,
        allowCriticalAlerts: true,
        provideAppNotificationSettings: true,
        // allowProvisional: true,
      },
    });
    const { status } = res;
    // console.log(
    //   '@configureNotifications -- existingStatus not granted -- after request permissions -- res =',
    //   res
    // );
    // console.log(
    //   '@configureNotifications -- existingStatus not granted -- after request permissions -- status =',
    //   status
    // );
    finalStatus = status;
  }
  // console.log(
  //   '@configureNotifications -- after the 1st if block -- finalStatus =',
  //   finalStatus
  // );
  if (finalStatus !== 'granted') {
    // console.log(
    //   '@configureNotifications -- finalStatus not granted and will alert and then return false'
    // );
    Alert.alert(
      'Permissions Required!',
      'Please grant the App all the permissions for the notifications!'
      // [
      //   {
      //     text: 'Grant Permissions',
      //     onPress: async () => {
      //       console.log('Grant Permissions Pressed');
      //       const { status } = await Notifications.requestPermissionsAsync();
      //       finalStatus = status;
      //       return;
      //     },
      //   },
      //   {
      //     text: 'Cancel',
      //     onPress: () => {
      //       console.log('Cancel Pressed');
      //       return;
      //     },
      //     style: 'cancel',
      //   },
      // ]
    );
    return false;
  }
  console.log(
    '@configureNotifications -- everything seems right and will return true'
  );
  return true;
}

async function createNotifications({ title, messageId, date }) {
  console.log(
    '@createNotifications --- date type =',
    typeof date,
    'date =',
    date,
    'date =',
    date.getHours()
  );
  // setup notifications permissions
  const wasNotificationsConfigured = await configureNotifications();
  // console.log(
  //   '@createNotifications -- after checking the configuration -- wasNotificationsConfigured =',
  //   wasNotificationsConfigured
  // );
  // throw an error before creating the notifications in case of the permissions weren't granted to avoid any problem as it will be caught in the try-catch block and error should be handled
  if (!wasNotificationsConfigured)
    throw new Error(
      "Permissions to Notifications was denied and thus the App couldn't create the needed notifications!"
    );

  const inTimeNotificationIdentifier =
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: 'This message should to be sent now.\nPress on this notifications to be directed to SMS messenger screen and then send the message',
        data: { messageId, sendingDate: date },
        subtitle: 'A message needs to be sent',
      },
      trigger: { date: new Date(date) },
    });
  const after2HoursNotificationIdentifier =
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: 'This message should have been sent two hours ago.\nPress on this notifications to be directed to SMS messenger screen and then send the message',
        data: { messageId, sendingDate: date },
        subtitle: 'A message needs to be sent',
      },
      trigger: { date: new Date(date.setHours(date.getHours() + 2)) },
    });
  const after1DayNotificationIdentifier =
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: 'This message should have been sent yesterday.\nPress on this notifications to be directed to SMS messenger screen and then send the message',
        data: { messageId, sendingDate: date },
        subtitle: 'A message needs to be sent',
      },
      trigger: { date: new Date(date.setDate(date.getDate() + 1)) },
    });

  return {
    inTimeNotificationIdentifier,
    after2HoursNotificationIdentifier,
    after1DayNotificationIdentifier,
  };
}

function reducer(state, action) {
  //
  // const newState = structuredClone(state);
  console.log('@context @reducer -- type =', action.type);

  switch (action.type) {
    case types.LOADING:
      // newState.status = 'loading';
      console.log('--------------------------- setting status to loading');
      return { ...state, status: 'loading' };
    // return newState;

    case types.SUCCESS:
      // newState.status = 'success';
      console.log('--------------------------- setting status to success');
      return { ...state, status: 'success', ...action.payload };
    // return newState;

    case types.ERROR:
      console.log('--------------------------- setting status to error');
      return { ...state, status: 'error', error: action.payload };

    /**will update the messageFormData state with the new data to be saved should expect object that contains the part of draft to be updated incase of recipients {contacts:[1,2,3]} as state can be accessed on any level, handler in the component can get a copy of the recipients list and push the new number to it and then dispatch draft passing the list as named argument
     * the payload must be an object that contains named property of the new data to be saved, example: for changing title => payload = {title:'new'}, content => {content:'new'} */
    case types.DRAFT:
      console.log(
        '--------------------------- saving payload into messageFormData state',
        action.payload
      );
      return {
        ...state,
        messageFormData: { ...state.messageFormData, ...action.payload },
      };

    default:
      console.log('default ');
      return state;
  }
}
