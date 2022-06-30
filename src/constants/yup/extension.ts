import * as Yup from 'yup';

export const ExtenionGiftState = {
  extensionTitle: 'Organization',
  userEmail: '',
};

export const EXTENION_GIFT_YUP = Yup.object().shape({
  userEmail: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
});
