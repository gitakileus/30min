/* eslint-disable react-hooks/rules-of-hooks */
import {createContext, PropsWithChildren, useReducer} from 'react';

import DEFAULT_STATE from 'constants/context/initialState';
import useActions from './User.actions';
import userReducer from './User.reducers';

export const UserContext = createContext({
  state: DEFAULT_STATE.user,
  actions: useActions((value: any) => console.log(`Called action: ${JSON.stringify(value)}`)),
});

export const UserContextProvider = ({children}: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(userReducer, DEFAULT_STATE.user);
  const actions = useActions(dispatch);

  return <UserContext.Provider value={{state, actions}}>{children}</UserContext.Provider>;
};
