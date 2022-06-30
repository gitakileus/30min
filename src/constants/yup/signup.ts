import * as Yup from 'yup';

export const SIGNUP_STATE = {
  email: '',
  name: '',
  username: '',
};

export const SINGUP_YUP = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});
