import * as Yup from 'yup';

export const BOOKING_STATE = {
  name: '',
  email: '',
  ccRecipients: '',
  subject: '',
  phone: '',
  notes: '',
  meetingCount: 1,
  conferenceType: '',
};

export const BOOKING_YUP = Yup.object().shape({
  name: Yup.string().required('Required'),
  subject: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
  ccRecipients: Yup.string(),
  meetingCount: Yup.number(),
  conferenceType: Yup.string().required('Required'),
  phone: Yup.string()
    .max(50, 'should not exceeds 50 digits')
    .matches(/^[0-9\s)(-._]*$/, 'Please enter valid phone number')
    .required('Required'),
});
