import * as Yup from 'yup';

export const CHARITY_STATE = {
  name: '',
  taxID: '',
  description: '',
  website: '',
};
export const CHARITY_YUP = Yup.object().shape({
  name: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
  taxID: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  website: Yup.string().required('Required'),
});
