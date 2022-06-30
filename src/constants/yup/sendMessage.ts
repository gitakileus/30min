import * as Yup from 'yup';

export const SEND_MESSAGE_STATE = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  description: '',
};

export const SEND_MESSAGE_YUP = Yup.object().shape({
  name: Yup.string().required('Required'),
  subject: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
  phone: Yup.string()
    .max(50, 'should not exceeds 50 digits')
    .matches(/^[0-9\s)(-._]*$/, 'Please enter valid phone number'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
});
