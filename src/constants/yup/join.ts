import * as Yup from 'yup';

export const JOIN_STATE = {
  email: '',
  name: '',
};

export const JOIN_NO_ACCOUNT_YUP = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export const JOIN_HAS_ACCOUNT_YUP = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});
