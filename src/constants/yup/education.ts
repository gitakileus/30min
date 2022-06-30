import * as Yup from 'yup';

export const EDUCATION_HISTORY_STATE = {
  school: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  extracurricular: '',
  current: false,
  graduated: false,
};

export const EDUCATION_HISTORY_YUP = Yup.object().shape({
  school: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
  degree: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
  fieldOfStudy: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
  startDate: Yup.date().required('Required'),
  extracurricular: Yup.string().max(750, 'Must be 750 characters or less'),
  current: Yup.bool().required('Required'),
  graduated: Yup.bool().required('Required'),
});
