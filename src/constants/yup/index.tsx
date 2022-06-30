import * as Yup from 'yup';

export const SOCIAL_YUP = Yup.object().shape({
  facebook: Yup.string()
    .matches(/^(http(s)?:\/\/)?([\w]+\.)?facebook\.com\//i, 'https://facebook.com/')
    .nullable(),
  instagram: Yup.string()
    .matches(/^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\//i, 'https://instagram.com/')
    .nullable(),
  twitter: Yup.string()
    .matches(/^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\//i, 'https://twitter.com/')
    .nullable(),
  linkedin: Yup.string()
    .matches(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\//i, 'https://linkedin.com/')
    .nullable(),
  youtube: Yup.string()
    .matches(/^(http(s)?:\/\/)?([\w]+\.)?youtube\.com\//i, 'https://youtube.com/')
    .nullable(),
});

export const HOME_SEARCH_PAGE = {
  keywords: '',
  location: '',
  isIndividual: true,
  isBussiness: false,
};

export const MEETING_MODAL_STATE = {
  text: '',
};

export const MEETING_MODAL_YUP = Yup.object().shape({
  text: Yup.string().max(2500).required('Required'),
});
