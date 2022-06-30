import ACTIONS from 'constants/context/userActions';
import {AnyAction} from 'types';
import {UserState} from 'types/state';

const setAvatar = (state: UserState, payload: Record<string, any>): UserState => {
  const {avatar} = payload;
  return {...state, avatar};
};

const setDescription = (state: UserState, payload: Record<string, any>): UserState => {
  const {description} = payload;
  return {...state, description};
};

const setCountry = (state: UserState, payload: Record<string, any>): UserState => {
  const {country} = payload;
  return {...state, country};
};
const setEmail = (state: UserState, payload: Record<string, any>): UserState => {
  const {email} = payload;
  return {...state, email};
};

const setFacebook = (state: UserState, payload: Record<string, any>): UserState => {
  const {facebook} = payload;
  return {...state, facebook};
};

const setYoutube = (state: UserState, payload: Record<string, any>): UserState => {
  const {youtube} = payload;
  return {...state, youtube};
};

const setFullname = (state: UserState, payload: Record<string, any>): UserState => {
  const {fullname} = payload;
  return {...state, fullname};
};

const setHashtags = (state: UserState, payload: Record<string, any>): UserState => {
  const {hashtags} = payload;
  return {...state, hashtags};
};

const setIndividual = (state: UserState, payload: Record<string, any>): UserState => {
  const {individual} = payload;
  return {...state, individual};
};

const setInstagram = (state: UserState, payload: Record<string, any>): UserState => {
  const {instagram} = payload;
  return {...state, instagram};
};

const setTwitter = (state: UserState, payload: Record<string, any>): UserState => {
  const {twitter} = payload;
  return {...state, twitter};
};

const setLinkedin = (state: UserState, payload: Record<string, any>): UserState => {
  const {linkedin} = payload;
  return {...state, linkedin};
};

const setMediaType = (state: UserState, payload: Record<string, any>): UserState => {
  const {profileMediaType} = payload;
  return {...state, profileMediaType};
};

const setProfileMediaLink = (state: UserState, payload: Record<string, any>): UserState => {
  const {profileMediaLink} = payload;
  return {...state, profileMediaLink};
};

const setPhone = (state: UserState, payload: Record<string, any>): UserState => {
  const {phone} = payload;
  return {...state, phone};
};

const setName = (state: UserState, payload: Record<string, any>): UserState => {
  const {name} = payload;
  return {...state, name};
};
const setLocation = (state: UserState, payload: Record<string, any>): UserState => {
  const {location} = payload;
  return {...state, location};
};

const setTimezone = (state: UserState, payload: Record<string, any>): UserState => {
  const {timezone} = payload;
  return {...state, timezone};
};
const setLanguage = (state: UserState, payload: Record<string, any>): UserState => {
  const {language} = payload;
  return {...state, language};
};
const setUsernameURL = (state: UserState, payload: Record<string, any>): UserState => {
  const {usernameURL} = payload;
  return {...state, usernameURL};
};
const setUsername = (state: UserState, payload: Record<string, any>): UserState => {
  const {username} = payload;
  return {...state, username};
};
const setVisible = (state: UserState, payload: Record<string, any>): UserState => {
  const {visible} = payload;
  return {...state, visible};
};

const setHeadline = (state: UserState, payload: Record<string, any>): UserState => {
  const {headline} = payload;
  return {...state, headline};
};

const setWebsite = (state: UserState, payload: Record<string, any>): UserState => {
  const {website} = payload;
  return {...state, website};
};

const setPublicUrl = (state: UserState, payload: Record<string, any>): UserState => {
  const {publicUrl} = payload;
  return {...state, publicUrl};
};

const setLongitude = (state: UserState, payload: Record<string, any>): UserState => {
  const {longitudeValue} = payload;
  return {...state, longitudeValue};
};

const setLatitude = (state: UserState, payload: Record<string, any>): UserState => {
  const {latitudeValue} = payload;
  return {...state, latitudeValue};
};

const setZipCode = (state: UserState, payload: Record<string, any>): UserState => {
  const {zipCode} = payload;
  return {...state, zipCode};
};

const setProfileBG = (state: UserState, payload: Record<string, any>): UserState => {
  const {profileBG} = payload;
  return {...state, profileBG};
};
const userReducer = (state: UserState, {type, payload}: AnyAction) => {
  switch (type) {
    case ACTIONS.setAvatar:
      return setAvatar(state, payload);
    case ACTIONS.setCountry:
      return setCountry(state, payload);
    case ACTIONS.setDescription:
      return setDescription(state, payload);
    case ACTIONS.setEmail:
      return setEmail(state, payload);

    case ACTIONS.setFacebook:
      return setFacebook(state, payload);

    case ACTIONS.setYoutube:
      return setYoutube(state, payload);

    case ACTIONS.setFullname:
      return setFullname(state, payload);

    case ACTIONS.setHashtags:
      return setHashtags(state, payload);

    case ACTIONS.setIndividual:
      return setIndividual(state, payload);

    case ACTIONS.setInstagram:
      return setInstagram(state, payload);

    case ACTIONS.setTwitter:
      return setTwitter(state, payload);

    case ACTIONS.setLinkedin:
      return setLinkedin(state, payload);

    case ACTIONS.setLocation:
      return setLocation(state, payload);

    case ACTIONS.setMediaType:
      return setMediaType(state, payload);

    case ACTIONS.setName:
      return setName(state, payload);

    case ACTIONS.setPhone:
      return setPhone(state, payload);

    case ACTIONS.setProfileMediaLink:
      return setProfileMediaLink(state, payload);

    case ACTIONS.setTimezone:
      return setTimezone(state, payload);

    case ACTIONS.setLanguage:
      return setLanguage(state, payload);

    case ACTIONS.setUsernameURL:
      return setUsernameURL(state, payload);

    case ACTIONS.setUsername:
      return setUsername(state, payload);

    case ACTIONS.setVisible:
      return setVisible(state, payload);

    case ACTIONS.setWebsite:
      return setWebsite(state, payload);

    case ACTIONS.setheadline:
      return setHeadline(state, payload);

    case ACTIONS.setPublicUrl:
      return setPublicUrl(state, payload);

    case ACTIONS.setLatitude:
      return setLatitude(state, payload);

    case ACTIONS.setLongitude:
      return setLongitude(state, payload);

    case ACTIONS.setZipCode:
      return setZipCode(state, payload);

    case ACTIONS.setProfileBG:
      return setProfileBG(state, payload);

    default:
      return state;
  }
};

export default userReducer;
