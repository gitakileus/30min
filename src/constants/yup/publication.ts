import * as Yup from 'yup';

export const PUBLICATION_STATE = {
  headline: '',
  type: 'Book',
  description: '',
  image: '',
  url: '',
};

export const PUBLICATION_YUP = Yup.object().shape({
  headline: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  type: Yup.string().required('Required'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  url: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
});
