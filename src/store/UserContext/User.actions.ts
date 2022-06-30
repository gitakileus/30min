import {Dispatch} from 'react';
import ACTIONS from 'constants/context/userActions';
import {AnyAction} from 'types';

const useActions = (dispatch: Dispatch<AnyAction>) => ({
  setAvatar: (avatar: string) => dispatch({type: ACTIONS.setAvatar, payload: {avatar}}),
  setUsername: (username: string) => dispatch({type: ACTIONS.setUsername, payload: {username}}),
  setCountry: (country: string) => dispatch({type: ACTIONS.setCountry, payload: {country}}),
  setDescription: (description: string) =>
    dispatch({type: ACTIONS.setDescription, payload: {description}}),
  setEmail: (email: string) => dispatch({type: ACTIONS.setEmail, payload: {email}}),
  setFacebook: (facebook: string) => dispatch({type: ACTIONS.setFacebook, payload: {facebook}}),
  setYoutube: (youtube: string) => dispatch({type: ACTIONS.setYoutube, payload: {youtube}}),
  setFullname: (fullname: string) => dispatch({type: ACTIONS.setFullname, payload: {fullname}}),
  setHashtags: (hashtags: Array<string>) =>
    dispatch({type: ACTIONS.setHashtags, payload: {hashtags}}),
  setIndividual: (individual: boolean) =>
    dispatch({type: ACTIONS.setIndividual, payload: {individual}}),
  setInstagram: (instagram: string) => dispatch({type: ACTIONS.setInstagram, payload: {instagram}}),
  setLinkedin: (linkedin: string) => dispatch({type: ACTIONS.setLinkedin, payload: {linkedin}}),
  setLocation: (location: string) => dispatch({type: ACTIONS.setLocation, payload: {location}}),
  setMediaType: (profileMediaType: string) =>
    dispatch({type: ACTIONS.setMediaType, payload: {profileMediaType}}),
  setName: (name: string) => dispatch({type: ACTIONS.setName, payload: {name}}),
  setPhone: (phone: string) => dispatch({type: ACTIONS.setPhone, payload: {phone}}),
  setProfileMediaLink: (profileMediaLink: string) =>
    dispatch({type: ACTIONS.setProfileMediaLink, payload: {profileMediaLink}}),
  setTimezone: (timezone: string) => dispatch({type: ACTIONS.setTimezone, payload: {timezone}}),
  setLanguage: (language: string) => dispatch({type: ACTIONS.setLanguage, payload: {language}}),
  setTwitter: (twitter: string) => dispatch({type: ACTIONS.setTwitter, payload: {twitter}}),
  setUsernameURL: (usernameURL: string) =>
    dispatch({type: ACTIONS.setUsernameURL, payload: {usernameURL}}),
  setVisible: (visible: boolean) => dispatch({type: ACTIONS.setVisible, payload: {visible}}),
  setWebsite: (website: string) => dispatch({type: ACTIONS.setWebsite, payload: {website}}),
  setheadline: (headline: string) => dispatch({type: ACTIONS.setheadline, payload: {headline}}),
  setPublicUrl: (publicUrl: string) => dispatch({type: ACTIONS.setPublicUrl, payload: {publicUrl}}),
  setLatitude: (latitudeValue: number) =>
    dispatch({type: ACTIONS.setLatitude, payload: {latitudeValue}}),
  setLongitude: (longitudeValue: number) =>
    dispatch({type: ACTIONS.setLongitude, payload: {longitudeValue}}),
  setZipCode: (zipCode: string) => dispatch({type: ACTIONS.setZipCode, payload: {zipCode}}),
  setProfileBG: (profileBG: string) => dispatch({type: ACTIONS.setProfileBG, payload: {profileBG}}),
});

export default useActions;
