import * as Yup from 'yup';

export const CHANGE_EMAIL_STATE = {
  email: '',
};

export const CHANGE_EMAIL_YUP = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
});
