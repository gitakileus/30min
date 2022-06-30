import * as Yup from 'yup';

export const ContactState = {
  fullname: '',
  email: '',
  subject: '',
  message: '',
};

export const CONTACT_YUP = Yup.object().shape({
  fullname: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
  subject: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
  message: Yup.string().required('Required').max(500, 'Must be 500 characters or less'),
});
