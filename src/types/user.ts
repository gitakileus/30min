export type User = {
  avatar: string;
  name: string;
  usernameURL: string;
  username: string;

  fullname: string;
  phone: string;
  email: string;
  website: string;
  headline: string;

  profileBG: string;
  description: string;
  location: string;
  zipCode: string;
  latitudeValue: number;
  longitudeValue: number;
  country: string;
  visible: boolean;
  individual: boolean;
  timezone: string;

  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  youtube: string;

  publicUrl: string;
  profileMediaLink: string;
  profileMediaType: string;
  hashtags: Array<string>;
  language: string;
};
