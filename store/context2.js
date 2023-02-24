import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useContext,
} from 'react';
import {
  getAppData,
  init,
  addMessage,
  editMessage,
  addEvent,
  updateEvent,
  getMessages,
  getEvents,
} from './database';

const AppStateContext = createContext();
const DispatchActionsContext = createContext();

export const useAppStateContext = () => {
  return useContext(AppStateContext);
};
export const useDispatchActionsContext = () => {
  return useContext(DispatchActionsContext);
};

export default function GlobalContextProvider({ children }) {
  //
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [state, setState] = useState(initialState);

  const dispatch =
    // useMemo(() => (
    {
      //
      async initializeApp() {
        setState((prev) => ({ ...prev, status: 'loading' }));
        try {
          // create tables if not existing
          await init();
          console.log(
            '@context @initializeApp --- succeeded to init the database'
          );
          // fetch data from db and populate state
          const data = await getAppData();
          console.log(
            '@context @initializeApp --- succeeded to fetch data from the database',
            data
          );
          setState((prev) => ({ ...prev, messages: data, status: 'success' }));
        } catch (err) {
          for (const error of err.errors) {
            console.log(
              '@context @initializeApp --- failed to init the database ---',
              error
            );
          }
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: `error while initializing --- ${err}`,
          }));
        }
      },

      async populateAppData({ initialize = false }) {
        console.log('@context @populateAppDate --- initialize =', initialize);
        setState((prev) => ({ ...prev, status: 'loading' }));
        try {
          // only at the app initial start
          if (initialize) {
            // create tables if not existing
            await init();
            console.log(
              '@context @populateAppDate --- succeeded to initialize the database'
            );
          }
          // fetch data from db and populate state
          const data = await getAppData();
          console.log(
            '@context @populateAppDate --- succeeded to fetch data from the database',
            data
          );
          setState((prev) => ({ ...prev, ...data, status: 'success' }));
        } catch (err) {
          let errorString = '';
          for (const error of err.errors) {
            console.log(
              '@context @populateAppDate --- failed to initialize the database or populate the app data ---',
              error
            );
            errorString += `\n ${error}`;
          }
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: `error while initializing --- ${errorString}`,
          }));
        }
      },

      /**function fo fetch messages and update the messages state with the fetched messages */
      async populateMessages() {
        setState((prev) => ({ ...prev, status: 'loading' }));
        try {
          const messages = await getMessages();
          console.log(
            '@context @dispatch @populateMessages --- success while fetching messages and updating the app state',
            messages
          );
          setState((prev) => ({ ...prev, status: 'success', messages }));
        } catch (error) {
          console.log(
            '@context @dispatch @populateMessages --- error while fetching messages and updating the app state',
            error
          );
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: `error while getting messages from database --- ${error}`,
          }));
        }
      },

      async populateEvents() {
        setState((prev) => ({ ...prev, status: 'loading' }));
        try {
          const events = await getEvents();
          console.log(
            '@context @dispatch @populateEvents --- success while fetching events and updating the app state',
            events
          );
          setState((prev) => ({ ...prev, status: 'success', events }));
        } catch (error) {
          console.log(
            '@context @dispatch @populateEvents --- error while fetching events and updating the app state',
            error
          );
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: `error while getting events from database --- ${error}`,
          }));
        }
      },

      async newMessage(messageData) {
        setState((prev) => ({ ...prev, status: 'loading' }));
        try {
          const messageId = await addMessage(messageData);
          console.log(
            '@context @dispatch @populateMessages --- success while adding message and updating the app state',
            messageId
          );
          // should pass the upcoming sending date to the addEvent function
          const eventId = await addEvent(messageId, messageData);
          console.log(
            '@context @dispatch @populateMessages --- success while adding event and updating the app state',
            eventId
          );
          setState((prev) => ({
            ...prev,
            status: 'success',
            messageFormData: {
              title: '',
              content: '',
              recipients: [],
              rules: {},
            },
          }));
        } catch (error) {
          console.log(
            '@context @dispatch @populateMessages --- error while fetching messages and updating the app state',
            error
          );
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: `error while adding messages to database --- ${error}`,
          }));
        }
      },

      async updateMessage(messageId, messageData) {
        setState((prev) => ({ ...prev, status: 'loading' }));
        try {
          const res = await editMessage(messageId, messageData);
        } catch (error) {}
      },

      editMessageFormData(newData) {
        console.log(
          '@context @editMessageFormData --- will update state with new form data:',
          newData
        );
        setState((prev) => ({ ...prev, ...newData }));
      },
      //
    };
  // ), []);

  return (
    <>
      <AppStateContext.Provider value={state}>
        <DispatchActionsContext.Provider value={dispatch}>
          {children}
        </DispatchActionsContext.Provider>
      </AppStateContext.Provider>
    </>
  );
}

const types = {
  NEW: 'CREATE_NEW_MESSAGE_AND_ADD_SENDING_EVENT',
  UPDATE_STATE: 'UPDATE_STATE_WITH_PROVIDED_PAYLOAD',
  EDIT: 'EDIT_EXISTING_MESSAGE_AND_CLEAR_OLD_SENDING_EVENTS_AND_ADD_NEW_ONES',
  RESEND: 'ADD_SENDING_EVENT',
  DELETE: 'DELETE_MESSAGE',
  SEND: 'SEND_MESSAGE',
  LOADING: 'SET_STATUS_TO_LOADING_WHILE_FETCHING',
  SUCCESS: 'SET_STATUS_TO_SUCCESS_IF_NO_ERRORS',
  ERROR: 'SET_STATUS_TO_ERROR',
  FAILURE: 'SET_STATUS_TO_FAILURE_BECAUSE_ERROR',
};

export const actionCreators = {
  loading: () => ({ type: types.LOADING }),
  success: () => ({ type: types.SUCCESS }),
  error: (payload) => ({
    type: types.ERROR,
  }),
  createNewMessage: (payload) => ({
    type: types.NEW,
    payload,
  }),
};

const initialState = {
  status: '',
  messages: [],
  events: [],
  messageFormData: {
    title: '',
    content: '',
    recipients: [],
    sendingDate: '',
    repeat: false,
    repeatEvery: '',
  },
};

export async function initializeApp() {
  // will return the result of initializing the app as success and error
  const res = { success: [], error: [] };

  try {
    // create tables if not existing
    await init();
    console.log('@context @initializeApp --- succeeded to init the database');
    res.success.push(
      "succeeded to connect to the local database and tables or initialize them if they don't exist"
    );
    // fetch data from db and populate state
    const data = await getAppData();
    // call populateState action to save data into context store
  } catch (err) {
    for (const error of err.errors) {
      res.error.push(
        `failed to connect to the local database and tables or initialize them if they don't exist ----- error ---- ${error}`
      );
      console.log(
        '@context @initializeApp --- failed to init the database ---',
        error
      );
    }
  }

  return res;
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
      return { ...state, status: 'success' };
    // return newState;

    case types.ERROR:
      console.log('--------------------------- setting status to error');
      return { ...state, status: 'error' };

    case types.NEW:
      addMessage(action.payload).then((res) => {
        console.log(res);
        // res should be an insertedId
        const newStateMessages = [
          ...state.messages,
          { ...action.payload, res },
        ];
        return { ...state, messages: newStateMessages };
      });

    case types.UPDATE_STATE:
      console.log(
        '--------------------------- updating state with a payload =',
        action.payload
      );
      return { ...state, ...action.payload };

    default:
      console.log('default ');
      return state;
  }
}
