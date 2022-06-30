import {Dispatch} from 'react';
import ACTIONS from 'constants/context/actions';

import {AnyAction} from 'types';

const useActions = (dispatch: Dispatch<AnyAction>) => ({
  setLoading: (loading: boolean) => dispatch({type: ACTIONS.setLoading, payload: {loading}}),
});

export default useActions;
