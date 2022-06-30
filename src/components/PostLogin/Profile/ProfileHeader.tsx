import {useEffect, useState, useContext, ChangeEvent} from 'react';
import {UserContext} from 'store/UserContext/User.context';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {SUMMARY_TABS, TABS, TABS_TYPES} from 'constants/context/tabs';
import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import useTranslation from 'next-translate/useTranslation';
import Tabs from 'components/PostLogin/Tabs/Tab';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Publications from './Tabs/publications';
import Profile from './Tabs/Profile';
import Education from './Tabs/education';
import JobHistory from './Tabs/jobHistory';

const ProfileHeader = ({user, services, credentials, extensionsArray}) => {
  const [currentTab, setTab] = useState(TABS.userProfile);
  const {t} = useTranslation();

  const {data: session} = useSession();
  const [imageError, setImageError] = useState('');
  const router = useRouter();
  const {tab} = router.query;

  useEffect(() => {
    if (tab) {
      setTab(tab as string);
    }
  }, [tab]);

  const User = user?.data?.getUserById?.userData;
  const userServices = services?.data?.getServicesByUserId?.serviceData;
  const userCredentials = credentials?.data?.getCredentialsByToken;
  const isWelcomeComplete = user?.data?.getUserById?.userData?.welcomeComplete;

  const tabsContent = {
    [tab === TABS_TYPES.profile ? TABS.userProfile : TABS.userProfile]: (
      <Profile
        user={user}
        userServices={userServices}
        credentials={userCredentials}
        extensionsArray={extensionsArray}
      />
    ),
    publications: <Publications />,
    education: <Education />,
    [tab === TABS_TYPES.profile ? TABS.jobHistory : TABS.jobHistory]: <JobHistory />,
  };

  const {
    state: {avatar, fullname, profileBG, timezone},
    actions: {setAvatar, setFullname, setProfileBG, setTimezone},
  } = useContext(UserContext);

  useEffect(() => {
    setAvatar(User?.accountDetails?.avatar);
    setTimezone(User?.locationDetails?.timezone);
    setFullname(User?.personalDetails?.name);
    setProfileBG(User?.accountDetails?.profileBackground);
  }, [
    User?.accountDetails?.avatar,
    User?.accountDetails?.profileBackground,
    User?.personalDetails?.name,
  ]);

  const profileBackgroundTimezone = (timezoneLoc: string) => {
    if (timezoneLoc === null || timezoneLoc === undefined) {
      setProfileBG('/assets/profileBg.jpg');
    } else if (timezoneLoc.startsWith('America') || timezoneLoc.startsWith('Atlantic')) {
      setProfileBG('/assets/profileBackgrounds/america-bg.jpg');
    } else if (timezoneLoc.startsWith('Africa') || timezoneLoc.startsWith('Australia')) {
      setProfileBG('/assets/profileBackgrounds/africa-bg.jpg');
    } else if (timezoneLoc.startsWith('Asia')) {
      setProfileBG('/assets/profileBackgrounds/asia-bg.jpg');
    } else if (timezoneLoc.startsWith('Europe')) {
      setProfileBG('/assets/profileBackgrounds/europe-bg.jpg');
    } else if (timezoneLoc.startsWith('Pacific')) {
      setProfileBG('/assets/profileBackgrounds/pacific-bg.png');
    } else if (timezoneLoc.startsWith('Indian')) {
      setProfileBG('/assets/profileBackgrounds/india-bg.png');
    }
  };

  useEffect(() => {
    if (!User?.accountDetails?.profileBackground) {
      profileBackgroundTimezone(timezone);
    }
  }, [timezone]);

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
        if ([400, 409, 413, 404].includes(response.data.singleUpload.status)) {
          setImageError('Maximum size allowed is 2MB');
          return;
        }
        setImageError('');
        router.reload();
        setAvatar(response.data.singleUpload.message);
      }
    } catch (e) {
      if ([400, 409, 413, 404].includes(e.response.status)) {
        setImageError('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const handleProfileBG = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];
    try {
      if (valid) {
        const response = await mutateFunction({
          variables: {
            uploadType: 'PROFILE_BACKGROUND',
            documentId: User._id,
            file: image,
            accessToken: session?.accessToken,
          },
        });

        if ([400, 409, 413, 404].includes(response.data.singleUpload.status)) {
          setImageError('Maximum size allowed is 2MB');
          return;
        }
        setImageError('');
        /*     router.reload(); */
        setProfileBG(response.data.singleUpload.message);
      }
    } catch (e) {
      if ([400, 409, 413, 404].includes(e.response.status)) {
        setImageError('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  if (!isWelcomeComplete) {
    router.push('/user/welcome');
  }

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
                    </a>
                  </Link>
                </div>
              </li>
              <li>
                <div className='flex items-center'>
                  <ChevronRightIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                  <a
                    href='#'
                    className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                  >
                    {t('common:txt_Profile')}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            Your {t('common:txt_Profile')}
          </h2>
        </div>
      </div>
      <div className='shadow-lg rounded-xl'>
        <div className='h-32 w-full object-cover lg:h-48 rounded-t-xl'>
          <div className='relative overflow-hidden lg:block'>
            <img
              className='h-32 w-full object-cover object-center lg:h-48 cursor-pointer'
              src={profileBG || '/assets/profileBg.jpg'}
              alt=''
            />
            <label className='absolute h-32 w-full object-cover lg:h-48 inset-0 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
              <input
                id='user-photo'
                name='user-photo'
                accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png,'
                type='file'
                onChange={handleProfileBG}
                className='cursor-pointer opacity-0'
              />
            </label>
          </div>
        </div>
        <div className='max-w-5xl mt-4 mx-auto px-4 sm:px-6 lg:px-8 '>
          <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
            <div className='mt-6 lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0'>
              <div className='relative rounded-full overflow-hidden lg:block'>
                <img
                  className='relative rounded-full w-24 h-24 object-cover object-center'
                  src={avatar || '/assets/default-profile.jpg'}
                  alt=''
                />
                <label className='absolute rounded-full inset-0 w-24 h-24 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
                  <span>Change</span>
                  <input
                    id='user-photo'
                    name='user-photo'
                    accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png,'
                    type='file'
                    onChange={handleFileChange}
                    className='absolute inset-0 w-24 h-24 opacity-0 cursor-pointer border-gray-300 rounded-md'
                  />
                </label>
              </div>
              {imageError && imageError ? (
                <div className='text-red-500 mt-2 text-xs font-normal'>{imageError}</div>
              ) : null}
            </div>
            <div className='mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 '>
              <div className='block mt-6 min-w-0 flex-1'>
                <h1 className='text-2xl font-bold text-gray-900 '>{fullname}</h1>
              </div>

              <div className='mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
                <Tabs
                  openedTab={currentTab}
                  className={'mr-6 mb-0 list-none flex-wrap  gap-2 sm:gap-0'}
                  tabsNames={SUMMARY_TABS.profileUsers}
                  onChange={(tabName: string) => setTab(tabName)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {tabsContent[currentTab]}
    </>
  );
};

export default ProfileHeader;
