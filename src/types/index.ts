import {MODAL_TYPES} from 'constants/context/modals';

export type Action<P> = {
  type: string;
  payload: P;
};

export type Response<T> = {
  ok: boolean;
  data: T;
};

export type AnyAction = Action<Record<string, any>>;
export type Modals = keyof typeof MODAL_TYPES | '';
