import { createContext, useContext, useReducer } from 'react';
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
} from './database';

const AppStateContext = createContext(initialState);
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
      // should pass the upcoming sending date to the addEvent function
      const eventId = await addEvent(messageId, messageData.sendingDate);
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

  /**function to update the event state in the db and then sync the global state with the db - will expect the event id to be updated and the new state of the event*/
  async function updateEventHandler(eventId, newState) {
    dispatch({ type: types.LOADING });
    try {
      const res = await updateEvent(eventId, newState);
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
