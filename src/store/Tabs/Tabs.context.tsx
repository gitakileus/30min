import {createContext, PropsWithChildren, useReducer} from 'react';

import DEFAULT_STATE from 'constants/context/initialState';
import useActions from './Tabs.actions';
import tabsReducer from './Tabs.reducer';

export const TabsContext = createContext({
  state: DEFAULT_STATE.tabs,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  actions: useActions((value: any) => console.log(`Called action: ${JSON.stringify(value)}`)),
});

export const TabsContextProvider = ({children}: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(tabsReducer, DEFAULT_STATE.tabs);
  const actions = useActions(dispatch);

  return <TabsContext.Provider value={{state, actions}}>{children}</TabsContext.Provider>;
};
