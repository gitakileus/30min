import ACTIONS from 'constants/context/actions';
import {AnyAction} from 'types';
import {State} from 'types/state';

const updateState = (state: State, {type}: AnyAction): State => {
  switch (type) {
    case ACTIONS.setState:
      return {...state};

    default:
      return state;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const reducers = (state: State, action: AnyAction): State => {
  const newState = updateState(state, action);
  return newState;
};
