import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const WELCOME_STEP_ONE = Yup.object().shape({
  fullname: Yup.string()
    .required('Required')
    .max(50, 'Must be 50 characters or less')
    .matches(/^[a-z\sA-Z0-9\s)(-._]*$/, 'No special characters allowed'),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9\-._]*$/, 'No Special Characters Allowed')
    .max(50, 'Must be 50 characters or less')
    .required('Required'),
  country: Yup.string().required('Required').default('United States'),
  zipCode: Yup.string()
    .required('Required')
    .max(15, 'Must be 15 characters or less')
    .matches(/^[0-9a-zA-Z ]+$/, 'Numbers and letters only'),
  timezone: Yup.string().required('Required').default('America/Los_Angeles'),
});
