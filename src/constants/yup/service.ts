import * as Yup from 'yup';

export const EVENT_STATE = {
  title: '',
  slug: '',
  duration: 15,
  price: 0,
  serviceType: 'MEETING',
  currency: '$',
  charity: '',
  percentDonated: '',
  paymentType: 'escrow',
  description: '',
  b15mins: false,
  b24hours: false,
  recurringInterval: 'weekly',
  conferenceType: [],
  media: {
    type: '',
    link: '',
  },
  serviceWorkingHours: {
    isCustomEnabled: false,
    monday: {
      isActive: false,
      start: null,
      end: null,
    },
    tuesday: {
      isActive: false,
      start: null,
      end: null,
    },
    wednesday: {
      isActive: false,
      start: null,
      end: null,
    },
    thursday: {
      isActive: false,
      start: null,
      end: null,
    },
    friday: {
      isActive: false,
      start: null,
      end: null,
    },
    saturday: {
      isActive: false,
      start: null,
      end: null,
    },
    sunday: {
      isActive: false,
      start: null,
      end: null,
    },
  },
  isPrivate: false,
  isPaid: false,
  hasReminder: false,
  isRecurring: false,
};

export const EVENT_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'No Special Characters Allowed'),
  duration: Yup.number().min(5).max(300).required('Required'),
  conferenceType: Yup.array().min(1, 'At least one element is required').required('Required'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  percentDonated: Yup.string().when('charity', {
    is: value => value && value.length > 0 && value !== '',
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
  paymentType: Yup.string().when('isPaid', {
    is: value => value === true,
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
});
