import * as Yup from 'yup';

export const HAVE_AN_IDEA_STATE = {
  headline: '',
  description: '',
};

export const HAVE_AN_IDEA_YUP = Yup.object().shape({
  headline: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  description: Yup.string().required('Required').max(500, 'Must be 500 characters or less'),
});
