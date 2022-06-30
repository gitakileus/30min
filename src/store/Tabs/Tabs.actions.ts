import {Dispatch} from 'react';

import ACTIONS from 'constants/context/actions';
import {AnyAction} from 'types';

const useActions = (dispatch: Dispatch<AnyAction>) => ({
  setTab: (tabsType: string) => dispatch({type: ACTIONS.setTab, payload: {tabsType}}),
});

export default useActions;
