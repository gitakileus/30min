import {Dispatch, ReactNode} from 'react';

import ACTIONS from 'constants/context/actions';
import {AnyAction} from 'types';

const useActions = (dispatch: Dispatch<AnyAction>) => ({
  showNotification: (notificationType: string, message: ReactNode, delayed = true) =>
    dispatch({type: ACTIONS.showNotification, payload: {notificationType, message, delayed}}),
  hideNotification: () => dispatch({type: ACTIONS.hideNotification, payload: {}}),
});

export default useActions;
