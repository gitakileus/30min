import ACTIONS from 'constants/context/actions';
import {AnyAction} from 'types';
import {NotificationState} from 'types/state';

const showNotification = (
  state: NotificationState,
  payload: Record<string, any>
): NotificationState => ({
  ...state,
  show: true,
  ...payload,
});

const hideNotification = (state: NotificationState): NotificationState => ({
  ...state,
  show: false,
  message: '',
});

const notificationReducer = (state: NotificationState, {type, payload}: AnyAction) => {
  switch (type) {
    case ACTIONS.showNotification:
      return showNotification(state, payload);

    case ACTIONS.hideNotification:
      return hideNotification(state);

    default:
      return state;
  }
};

export default notificationReducer;
