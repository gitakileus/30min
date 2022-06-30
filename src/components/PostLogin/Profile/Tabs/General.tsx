import {useMutation} from '@apollo/client';
import {useSession, signOut} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {UserContext} from 'store/UserContext/User.context';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import Countries from 'constants/forms/country.json';
import Languages from 'constants/forms/Languages.json';
import Timezones from 'constants/forms/timezones.json';
import mutations from 'constants/GraphQL/User/mutations';
import {TrashIcon} from '@heroicons/react/outline';
import dynamic from 'next/dynamic';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import axios from 'axios';
import {useRouter} from 'next/router';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const GeneralEdit = ({userData}) => {
  const {
    state: {
      avatar,
      visible,
      fullname,
      username,
      headline,
      country,
      phone,
      timezone,
      profileMediaLink,
      profileMediaType,
      hashtags,
      description,
      zipCode,
      language,
    },
    actions: {
      setAvatar,
      setCountry,
      setProfileMediaLink,
      setMediaType,
      setUsername,
      setheadline,
      setTimezone,
      setZipCode,
      setVisible,
      setFullname,
      setPhone,
      setHashtags,
      setDescription,
      setLanguage,
    },
  } = useContext(UserContext);
  const {t} = useTranslation();
  const router = useRouter();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [HashtagError, setHashtagErrorMessage] = useState('');
  const [imageError, setImageError] = useState('');
  const {data: session} = useSession();
  const {showModal} = ModalContextProvider();
  const User = userData?.data?.getUserById?.userData;
  const [updateUser] = useMutation(mutations.updateUser);
  const [deleteUser] = useMutation(mutations.deleteUser);

  const handleuserDelete = async () => {
    try {
      await axios.post('/api/stripe/deleteCustomer');

      await deleteUser({
        variables: {
          token: session?.accessToken,
        },
      });
      signOut();
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const deleteUserMutation = () => {
    showModal(MODAL_TYPES.DELETE, {
      isDeleteAccount: true,
      name: User?.personalDetails?.name,
      handleDelete: handleuserDelete,
    });
  };

  const handleSaveButton = () => {
    showNotification(NOTIFICATION_TYPES.success, 'Profile Saved', false);
    router.reload();
  };

  useEffect(() => {
    setUsername(User?.accountDetails?.username);
    setPhone(User?.personalDetails?.phone);
    setAvatar(User?.accountDetails?.avatar);
    setVisible(!User?.accountDetails?.privateAccount);
    setheadline(User?.personalDetails?.headline);
    setCountry(User?.locationDetails?.country);
    setTimezone(User?.locationDetails?.timezone);
    setFullname(User?.personalDetails?.name);
    setDescription(User?.personalDetails?.description);
    setZipCode(User?.locationDetails?.zipCode);
    setProfileMediaLink(User?.personalDetails?.profileMediaLink);
    setMediaType(User?.personalDetails?.profileMediaType);
    setLanguage(User?.personalDetails?.language);
    setHashtags(User?.personalDetails?.searchTags);
  }, [
    User?.accountDetails?.avatar,
    User?.accountDetails?.privateAccount,
    User?.accountDetails?.username,
    User?.locationDetails?.country,
    User?.locationDetails?.timezone,
    User?.locationDetails?.zipCode,
    User?.personalDetails?.description,
    User?.personalDetails?.headline,
    User?.personalDetails?.name,
    User?.personalDetails?.phone,
    User?.personalDetails?.profileMediaLink,
    User?.personalDetails?.profileMediaType,
    User?.personalDetails?.searchTags,
    User?.personalDetails?.language,
    User?.accountDetails?.isIndividual,
  ]);

  const [mutateFunction] = useMutation(singleUpload);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];

    try {
      if (valid) {
        const response = await mutateFunction({
          variables: {
            uploadType: 'USER_AVATAR',
            documentId: User._id,
            file: image,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          setImageError('Maximum size allowed is 2MB');
          return;
        }
        setImageError('');
        setAvatar(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        setImageError('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };
  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const TimezonesPicker = Timezones.map(timezoneEl => (
    <option key={timezoneEl.value}>{timezoneEl.value}</option>
  ));
  const LanguagesPicker = Languages.map(langEl => (
    <option key={langEl.value}>{langEl.value}</option>
  ));
  const SelectMediaType = [
    {key: t('None'), value: 'None'},
    {key: t('common:txt_media_type_google'), value: 'Google Slides'},
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ];

  const MediaType = SelectMediaType.map(option => (
    <option key={option.value}>{option.value}</option>
  ));

  const [fullnameError, setFullnameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneErorr, serPhoneerror] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const handleFullName = async ({target: {value}}) => {
    const val = value;

    const regex = /^[a-z\sA-Z0-9\s)(-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      setFullnameError(t('profile:no_special_characters_allowed'));
      return;
    }
    setFullname(val);

    if (val === '' || val === ' ') {
      setFullnameError(t('profile:err_required'));
    } else {
      setFullnameError('');
      try {
        await updateUser({
          variables: {
            userData: {personalDetails: {name: val}},
            token: session?.accessToken,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleUsername = async ({target: {value}}) => {
    const val = value;

    const regex = /^[a-zA-Z0-9\-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      setUsernameError(t('profile:no_special_characters_allowed'));
      return;
    }
    setUsername(val);

    if (val === '') {
      setUsernameError(t('profile:err_required'));
    } else {
      setUsernameError('');
      const response = await updateUser({
        variables: {
          userData: {accountDetails: {username: val}},
          token: session?.accessToken,
        },
      });
      if (response.data.updateUser.status === 409) {
        setUsernameError(response.data.updateUser.message);
      } else setUsernameError('');
    }
  };

  const handlePhone = async ({target: {value}}) => {
    const val = value;
    setPhone(val);

    const regex = /^[0-9\s)(-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      serPhoneerror(t('profile:no_special_characters_allowed'));
      return;
    }
    serPhoneerror('');
    await updateUser({
      variables: {
        userData: {personalDetails: {phone: val}},
        token: session?.accessToken,
      },
    });
  };
  const handleHeadline = async ({target: {value}}) => {
    const val = value;
    setheadline(val);

    await updateUser({
      variables: {
        userData: {personalDetails: {headline: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleCountry = async ({target: {value}}) => {
    const val = value.trim();
    setCountry(val);

    await updateUser({
      variables: {
        userData: {locationDetails: {country: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleTimezone = async ({target: {value}}) => {
    const val = value.trim();
    setTimezone(val);

    await updateUser({
      variables: {
        userData: {locationDetails: {timezone: val}},
        token: session?.accessToken,
      },
    });
  };
  const handleLanguage = async ({target: {value}}) => {
    const val = value.trim();
    setLanguage(val);
    await updateUser({
      variables: {
        userData: {personalDetails: {language: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleZipCode = async ({target: {value}}) => {
    const val = value.trim();
    setZipCode(val);

    const regex = /^[0-9\s\-._]*$/;
    const inValid = regex.exec(val);

    if (!inValid) {
      setZipCodeError(t('profile:no_special_characters_allowed'));
      return;
    }
    setZipCodeError('');
    await updateUser({
      variables: {
        userData: {locationDetails: {zipCode: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleMediaType = async ({target: {value}}) => {
    const val = value.trim();
    setMediaType(val);

    await updateUser({
      variables: {
        userData: {personalDetails: {profileMediaType: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleMediaLink = async ({target: {value}}) => {
    const val = value.trim();
    setProfileMediaLink(val);

    await updateUser({
      variables: {
        userData: {personalDetails: {profileMediaLink: val}},
        token: session?.accessToken,
      },
    });
  };

  const handleDescription = async descData => {
    setDescription(descData);
    const newdesc = (descData || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, ' ');

    const value = newdesc.length === 0 ? '' : newdesc;

    const isInValid = value.length > 750;
    if (isInValid) {
      setDescriptionError(t('profile:max_750_characters'));
      return;
    }
    setDescriptionError('');

    await updateUser({
      variables: {
        userData: {personalDetails: {description: descData}},
        token: session?.accessToken,
      },
    });
  };

  const handleChangeVisible = async () => {
    const updatedVisibility = !visible;
    setVisible(updatedVisibility);

    await updateUser({
      variables: {
        userData: {accountDetails: {privateAccount: visible}},
        token: session?.accessToken,
      },
    });
  };

  const submitUserHashag = async e => {
    e.preventDefault();
    const value = `#${e.target.hashtags.value.toLowerCase()}`;

    const regex = /^.{1}[a-zA-Z0-9\s\\-]{0,20}$/;
    const inValid = regex.exec(value);

    if (value === '# ' || value === '#') {
      setHashtagErrorMessage(t('profile:no_empty_hashtags'));
      return;
    }
    if (!inValid) {
      setHashtagErrorMessage(t('profile:no_special_characters_allowed'));
      return;
    }
    setHashtagErrorMessage('');

    if (hashtags.length >= 20) {
      setHashtagErrorMessage(t('profile:no_more_hashtags'));
      return;
    }

    if (hashtags.indexOf(value) !== -1) {
      setHashtagErrorMessage(t('profile:hashtag_already_exists'));
      return;
    }
    setHashtags([...hashtags, value]);

    if (hashtags.length <= 10 && !hashtags.includes(value)) {
      await updateUser({
        variables: {
          userData: {personalDetails: {searchTags: [...hashtags, value]}},
          token: session?.accessToken,
        },
      });
    }
    e.target.reset();
  };

  const removeUserHashtag = async toRemove => {
    const currentTags = hashtags;
    const newTags = currentTags.filter(value => value !== toRemove);

    setHashtags(newTags);

    await updateUser({
      variables: {
        userData: {personalDetails: {searchTags: newTags}},
        token: session?.accessToken,
      },
    });
  };
  return (
    <>
      <div className='max-w-6xl grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 gap-4 '>
        <div className='shadow-xl rounded-xl flex justify-center items-center py-10 px-10'>
          <div className='flex flex-col items-center'>
            <div className='relative rounded-full overflow-hidden lg:block'>
              <img
                className='relative rounded-full w-24 h-24 object-cover object-center'
                src={avatar || '/assets/default-profile.jpg'}
                alt=''
              />
              <label className='absolute rounded-full inset-0 w-24 h-24 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
                <span className='text-xs'>Update photo</span>
                <input
                  id='user-photo'
                  name='user-photo'
                  accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png,'
                  type='file'
                  onChange={event => {
                    handleFileChange(event);
                  }}
                  className='absolute inset-0 w-24 h-24 opacity-0 cursor-pointer rounded-md'
                />
              </label>
            </div>
            {imageError && imageError ? (
              <div className='text-red-500 mt-2 text-xs font-normal'>{imageError}</div>
            ) : null}
            <span className='text-xs mt-2 text-gray-500 font-light'>
              Allowed *.jpeg, *.jpg, *.png, *.gif
            </span>
            <span className='text-xs text-gray-500 font-light'>2 MB</span>

            <div className='flex flex-col items-center mt-8'>
              <button
                onClick={() => handleChangeVisible()}
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600'
              >
                {visible ? t('profile:Make_Private') : t('profile:Make_Public')}
              </button>
            </div>
            <button
              onClick={deleteUserMutation}
              className='mt-8 bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
            >
              {t('profile:txt_del_acc')}
            </button>
          </div>
        </div>
        <div className='col-span-2 shadow-xl rounded-xl px-4 py-4 justify-center items-center'>
          <div className='overflow-hidden sm:rounded-md'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                  {t('profile:Full_Name')}
                </label>
                <input
                  onChange={handleFullName}
                  value={fullname}
                  type='text'
                  name='fullname'
                  id='fullname'
                  maxLength={100}
                  className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                />
                {fullnameError && (
                  <div className={'focus:border-blue-500 text-red-600 ml-1 mt-1'}>
                    {fullnameError}
                  </div>
                )}
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                  {t('profile:txt_user_name_label')}
                </label>
                <input
                  type='text'
                  onChange={handleUsername}
                  value={username}
                  maxLength={32}
                  name='username'
                  id='username'
                  className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
                {usernameError && (
                  <div className={'focus:border-blue-500 text-red-600 ml-1 mt-1'}>
                    {usernameError}
                  </div>
                )}
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='timezone' className='block text-sm font-medium text-gray-700'>
                  {t('profile:Timezone')}
                </label>
                <select
                  onChange={handleTimezone}
                  value={timezone}
                  id='timezone'
                  name='timezone'
                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                >
                  {TimezonesPicker}
                </select>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='language' className='block text-sm font-medium text-gray-700'>
                  {t('common:txt_language_label')}
                </label>
                <select
                  onChange={handleLanguage}
                  value={language}
                  id='language'
                  name='language'
                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                >
                  {LanguagesPicker}
                </select>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                  {t('profile:txt_phone')}
                </label>
                <input
                  onChange={handlePhone}
                  type='text'
                  value={phone}
                  name='phone'
                  maxLength={15}
                  id='phone'
                  className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
                {phoneErorr && (
                  <div className={'focus:border-blue-500 text-red-600 ml-1 mt-1'}>{phoneErorr}</div>
                )}
              </div>
              <div className='col-span-6 sm:col-span-3'></div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700'>
                  {t('profile:zip_code')}
                </label>
                <input
                  type='text'
                  onChange={handleZipCode}
                  value={zipCode}
                  maxLength={15}
                  name='zipCode'
                  id='zipCode'
                  className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
                {zipCodeError && (
                  <div className={'focus:border-blue-500 text-red-600 ml-1 mt-1'}>
                    {zipCodeError}
                  </div>
                )}
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                  {t('profile:country')}
                </label>
                <select
                  onChange={handleCountry}
                  value={country}
                  id='country'
                  name='country'
                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                >
                  {CountriesPicker}
                </select>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='txt_media_link_label'
                  className='block text-sm font-medium text-gray-700'
                >
                  {t('common:txt_media_link_label')}
                </label>
                <input
                  onChange={handleMediaLink}
                  disabled={profileMediaType === 'None'}
                  type='text'
                  value={profileMediaLink}
                  name='profileMediaLink'
                  id='profileMediaLink'
                  className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700'>
                  {t('common:txt_media_type_label')}
                </label>
                <select
                  onChange={handleMediaType}
                  value={profileMediaType}
                  id='profileMediaType'
                  disabled={
                    !profileMediaLink || profileMediaLink === '' || profileMediaLink === ' '
                  }
                  name='profileMediaType'
                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                >
                  {MediaType}
                </select>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='txt_media_link_label'
                  className='block text-sm font-medium text-gray-700'
                >
                  {t('profile:txt_user_hashtags')}
                </label>
                <form onSubmit={submitUserHashag}>
                  <div className='row ml-1'></div>
                  <div className='row mx-0 mb-3'>
                    <div className={'mt-1 rounded-md shadow-sm px-0 col-sm-9 flex'}>
                      <input
                        type='text'
                        name='hashtags'
                        maxLength={20}
                        id='hashtags'
                        className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                      <button
                        className='min-w-max text-black hover:text-mainBlue duration-200 rounded-md px-2'
                        onClick={() => submitUserHashag}
                      >
                        {t('profile:add_tag')}
                      </button>
                    </div>
                  </div>
                  {HashtagError && (
                    <div className={'focus:border-blue-500 text-red-600 ml-1 mb-1'}>
                      {HashtagError}
                    </div>
                  )}
                </form>
                {hashtags?.map((tag, i) => (
                  <span
                    key={i}
                    className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 justify-between mr-1 mt-1'
                  >
                    {tag}
                    <button
                      className='ml-1 hover:text-red-500 duration-200 justify-end'
                      type='button'
                      onClick={() => {
                        removeUserHashtag(tag);
                      }}
                    >
                      <TrashIcon className='w-5 h-5' />
                    </button>
                  </span>
                ))}
              </div>
              <div className='col-span-6 sm:col-span-6'>
                <label htmlFor='headline' className='block text-sm font-medium text-gray-700'>
                  {t('profile:Headline')}
                </label>
                <input
                  onChange={handleHeadline}
                  type='text'
                  value={headline}
                  name='headline'
                  maxLength={160}
                  id='headline'
                  className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                />
              </div>
              <div className='col-span-6 sm:col-span-6'>
                <div className=' col-span-6'>
                  <label htmlFor='Description' className='block text-sm font-medium text-gray-700'>
                    {t('common:Description')}
                  </label>
                  <CKEditor
                    name={t('common:Description')}
                    value={description}
                    onChange={handleDescription}
                  />
                  {
                    (description || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, ' ')
                      .length
                  }
                  /750
                  {descriptionError && (
                    <div className={'focus:border-blue-500 text-red-600 ml-1 mb-1'}>
                      {descriptionError}
                    </div>
                  )}
                </div>
              </div>
              <div className='col-span-6 sm:col-span-6 justify-end text-right'>
                <button
                  type='button'
                  onClick={handleSaveButton}
                  className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_save')}
                </button>
              </div>{' '}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralEdit;
