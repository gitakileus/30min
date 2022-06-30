import {State} from 'types/state';
import {TABS_TYPES} from './tabs';

const DEFAULT_STATE: State = {
  status: {
    loading: false,
    stateLoaded: false,
  },
  sidebar: {
    isCollapse: false,
    collapseClick: false,
    collapseHover: false,
    onToggleCollapse: () => {},
    onHoverEnter: () => {},
    onHoverLeave: () => {},
  },
  modal: {
    showModal: () => {},
    hideModal: () => {},
    store: {},
  },
  tabs: {
    tabsType: TABS_TYPES.service as 'service',
  },
  notification: {
    show: false,
    notificationType: 'info',
    delayed: true,
    message: '',
  },
  user: {
    avatar: '',
    profileBG: '',
    name: '',
    usernameURL: '',
    username: '',
    fullname: '',
    phone: '',
    email: '',
    website: '',
    headline: '',
    description: '',
    location: '',
    zipCode: '',
    latitudeValue: 0,
    longitudeValue: 0,
    country: '',
    visible: true,
    individual: true,
    timezone: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    youtube: '',
    profileMediaLink: '',
    profileMediaType: '',
    language: '',
    publicUrl: '',
    hashtags: [''],
  },
};
export default DEFAULT_STATE;
