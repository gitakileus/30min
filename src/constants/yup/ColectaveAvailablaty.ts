import dayjs from 'dayjs';
import * as Yup from 'yup';

export const COLLECTIVE_AVAILABILITY_STATE = {
  email: '',
  idSelectedGroup: '',
  emails: [],
  groups: [],
  selectedDate: dayjs().format('MM-DD-YY'),
};

export const COLLECTIVE_AVAILABILITY_YUP = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
});
