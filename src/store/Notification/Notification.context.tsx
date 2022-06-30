import {createContext, PropsWithChildren, useReducer} from 'react';
import DEFAULT_STATE from 'constants/context/initialState';
import useActions from './Notification.actions';
import notificationReducer from './Notification.reducers';

export const NotificationContext = createContext({
  state: DEFAULT_STATE.notification,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  actions: useActions((value: any) => console.log(`Called action: ${JSON.stringify(value)}`)),
});

export const NotificationContextProvider = ({children}: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(notificationReducer, DEFAULT_STATE.notification);

  const actions = useActions(dispatch);

  return (
    <NotificationContext.Provider value={{state, actions}}>{children}</NotificationContext.Provider>
  );
};
