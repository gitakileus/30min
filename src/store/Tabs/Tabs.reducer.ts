import ACTIONS from 'constants/context/actions';
import {AnyAction} from 'types';
import {TabsState} from 'types/state';

const setTab = (state: TabsState, payload: Record<string, any>): TabsState => {
  const {tabsType} = payload;
  return {...state, tabsType};
};

const TabsReducer = (state: TabsState, {type, payload}: AnyAction) => {
  switch (type) {
    case ACTIONS.setTab:
      return setTab(state, payload);

    default:
      return state;
  }
};

export default TabsReducer;
