const types = {
  NEW: 'CREATE_NEW_MESSAGE_AND_ADD_SENDING_EVENT',
  EDIT: 'EDIT_EXISTING_MESSAGE_AND_CLEAR_OLD_SENDING_EVENTS_AND_ADD_NEW_ONES',
  RESEND: 'ADD_SENDING_EVENT',
  DELETE: 'DELETE_MESSAGE',
  SEND: 'SEND',
};

const actionCreators = {
  createNewMessage: () => ({ type: types.NEW }),
};
