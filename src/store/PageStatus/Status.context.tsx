import {createContext, PropsWithChildren, useReducer} from 'react';

import DEFAULT_STATE from 'constants/context/initialState';
import useActions from './Status.actions';
import statusReducer from './Status.reducers';

export const StatusContext = createContext({
  state: DEFAULT_STATE.status,
  // eslint-disable-next-line no-console
  // eslint-disable-next-line react-hooks/rules-of-hooks
  actions: useActions((value: any) => console.log(`Called action: ${JSON.stringify(value)}`)),
});

export const StatusContextProvider = ({children}: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(statusReducer, DEFAULT_STATE.status);

  const actions = useActions(dispatch);

  return <StatusContext.Provider value={{state, actions}}>{children}</StatusContext.Provider>;
};
