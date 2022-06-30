/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ACTIONS from 'constants/context/actions';
import {AnyAction} from 'types';
import {StatusState} from 'types/state';

const setLoading = (state: StatusState, payload: Record<string, any>): StatusState => {
  const {loading} = payload;

  return {...state, loading};
};

const statusReducer = (state: StatusState, {type, payload}: AnyAction) => {
  switch (type) {
    case ACTIONS.setLoading:
      return setLoading(state, payload);

    default:
      return state;
  }
};

export default statusReducer;
