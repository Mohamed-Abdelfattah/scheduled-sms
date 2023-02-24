import { useState } from 'react';

const statusTypes = {
  LOADING: 'SET_STATUS_TO_LOADING_WHILE_FETCHING',
  SUCCESS: 'SET_STATUS_TO_SUCCESS_IF_NO_ERRORS',
  FAILURE: 'SET_STATUS_TO_FAILURE_BECAUSE_ERROR',
};

const useStatus = () => {
  //
  const [status, setStatus] = useState('');

  const success = () => {
    console.log('@useStatus changing status to success');
    setStatus(statusTypes.SUCCESS);
  };
  const loading = () => {
    console.log('@useStatus changing status to loading');
    setStatus(statusTypes.LOADING);
  };
  const error = () => {
    console.log('@useStatus changing status to failure');
    setStatus(statusTypes.FAILURE);
  };

  return { status, changeStatus: { success, loading, error }, statusTypes };
};

export default useStatus;
