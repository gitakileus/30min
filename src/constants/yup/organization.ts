import * as Yup from 'yup';

export const ORGANIZATION_STATE = {
  title: '',
  headline: '',
  slug: '',
  description: '',
  image: '',
  website: '',
  supportEmail: '',
  supportPhone: '',
  restrictionLevel: 'RESTRICTED',
  location: '',
  socials: {
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
  },
  media: {
    type: '',
    link: '',
  },
  isPrivate: false,
  searchTags: [],
};

export const ORGANIZATION_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, 'No Special Characters Allowed'),
  headline: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  image: Yup.string(),
  website: Yup.string().max(254),
  restrictionLevel: Yup.string(),
  supportEmail: Yup.string().max(254),
  supportPhone: Yup.string().max(15),
  location: Yup.string().required('Required').max(150, 'Must be 150 characters or less'),
  twitter: Yup.string().max(254),
  facebook: Yup.string().max(254),
  linkedin: Yup.string().max(254),
  instagram: Yup.string().max(254),
  youtube: Yup.string().max(254),
});

export const ORG_SERVICE_CATEGORY_STATE = {
  title: '',
};

export const ORG_INVITE_MEMBERS = {
  email: '',
};

export const ORG_INVITE_MEMBERS_YUP = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required')
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please enter valid email'
    ),
});

export const ORG_SERVICE_CATEGORY_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(254, 'Must be 254 characters or less'),
});

export const JOIN_ORGANIZATION_YUP = Yup.object().shape({
  title: Yup.string().required('Required'),
});

export const JOIN_ORGANIZATION_STATE = {
  title: '',
};

export const ORG_SERVICE_STATE = {
  title: '',
  slug: '',
  duration: 15,
  price: 0,
  currency: '$',
  charity: '',
  percentDonated: '0',
  paymentType: 'escrow',
  description: '',
  serviceType: 'MEETING',
  b15mins: false,
  b24hours: false,
  recurringInterval: 'weekly',
  conferenceType: [],
  media: {
    type: '',
    link: '',
  },
  isPrivate: false,
  isPaid: false,
  hasReminder: false,
  isRecurring: false,
  organizationId: '',
  isOrgService: true,
  organizationName: '',
  orgServiceCategory: '',
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
};

export const ORG_SERVICE_YUP = Yup.object().shape({
  title: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'No Special Characters Allowed'),
  duration: Yup.number().min(5).max(300).required('Required'),
  conferenceType: Yup.array().min(1, 'At least one element is required').required('Required'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  organizationName: Yup.string().required('Required'),
  orgServiceCategory: Yup.string().required('Required'),
  percentDonated: Yup.string().when('charity', {
    is: charity => charity,
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
});

export const ORG_MEMBER_SEARCH_STATE = {
  keywords: '',
};

export const ORG_SERVICE_SEARCH_STATE = {
  keywords: '',
  serviceCategory: '',
  isPaid: '',
  isFree: '',
};

export const ORG_KICK_MEMBER_STATE = {
  reason: '',
};
