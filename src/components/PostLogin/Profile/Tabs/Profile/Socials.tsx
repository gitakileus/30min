import {
  ClockIcon,
  LocationMarkerIcon,
  MailIcon,
  TranslateIcon,
  PhoneIcon,
} from '@heroicons/react/outline';
import {PencilIcon, PlusIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useEffect} from 'react';
import {UserContext} from 'store/UserContext/User.context';

const Socials = ({User}) => {
  const {t} = useTranslation();
  const {
    state: {
      country,
      zipCode,
      email,
      language,
      instagram,
      timezone,
      facebook,
      twitter,
      linkedin,
      youtube,
      phone,
    },
    actions: {
      setTimezone,
      setCountry,
      setZipCode,
      setEmail,
      setLanguage,
      setFacebook,
      setInstagram,
      setTwitter,
      setLinkedin,
      setYoutube,
    },
  } = useContext(UserContext);

  useEffect(() => {
    setCountry(User?.locationDetails?.country);
    setZipCode(User?.locationDetails?.zipCode);
    setTimezone(User?.locationDetails?.timezone);
    setEmail(User?.accountDetails?.email);
    setLanguage(User?.personalDetails?.language);
    setFacebook(User?.personalDetails?.socials?.facebook);
    setTwitter(User?.personalDetails?.socials?.twitter);
    setLinkedin(User?.personalDetails?.socials?.linkedin);
    setInstagram(User?.personalDetails?.socials?.instagram);
    setYoutube(User?.personalDetails?.socials?.youtube);
  }, [
    User?.locationDetails?.country,
    User?.locationDetails?.timezone,
    User?.locationDetails?.zipCode,
    User?.personalDetails?.language,
    User?.personalDetails?.socials?.facebook,
    User?.personalDetails?.socials?.instagram,
    User?.personalDetails?.socials?.linkedin,
    User?.personalDetails?.socials?.twitter,
  ]);

  const UserSocials = User?.personalDetails?.socials;
  const facebookLink = UserSocials?.facebook;
  const twitterLink = UserSocials?.twitter;
  const instagramLink = UserSocials?.instagram;
  const linkedinLink = UserSocials?.linkedin;
  const youtubeLink = UserSocials?.youtube;

  const hasSocials =
    (UserSocials !== undefined &&
      facebookLink !== '' &&
      facebookLink !== ' ' &&
      facebookLink !== null) ||
    (twitterLink !== '' && twitterLink !== ' ' && twitterLink !== null) ||
    (instagramLink !== '' && instagramLink !== ' ' && instagramLink !== null) ||
    (linkedinLink !== '' && linkedinLink !== ' ' && linkedinLink !== null) ||
    (youtubeLink !== '' && youtubeLink !== ' ' && youtubeLink !== null);

  return (
    <>
      <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
        <div className='flex justify-between'>
          <h2 className='text-md font-medium text-gray-500'>{t('profile:About')}</h2>
          <div className='items-center flex'>
            <a href='/user/edit'>
              <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
            </a>
          </div>
        </div>
        <div className='mb-4'>
          <ul role='list' className='-mb-8 '>
            <div className='flex flex-row py-2'>
              <LocationMarkerIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <p className='text-sm text-gray-900'>
                {country}, {zipCode ? `${zipCode}` : ''}
              </p>
            </div>

            <div className='flex flex-row py-2'>
              <MailIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <div className='truncate text-sm text-gray-900'>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </div>

            <div className='flex flex-row py-2'>
              <PhoneIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <div className='truncate text-sm text-gray-900'>{phone || '--'}</div>
            </div>

            <div className='flex flex-row py-2 '>
              <ClockIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <p className='text-sm text-gray-900'>{timezone}</p>
            </div>

            <div className='flex flex-row py-2 '>
              <TranslateIcon width={20} height={20} className='mr-2 text-sm text-gray-900' />
              <p className='text-sm text-gray-900'>{language}</p>
            </div>
          </ul>
        </div>
      </div>

      {hasSocials && (
        <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
          <div className='flex justify-between'>
            <h2 className='text-md font-medium text-gray-500'>{t('common:Social Links')}</h2>
            <div className='flex flex-row items-center'>
              <a href='/user/edit?tab=social+links'>
                <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
              </a>
              <a href='/user/edit?tab=social+links'>
                <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
              </a>
            </div>
          </div>
          <div className='mb-4'>
            <ul role='list' className='-mb-8'>
              {facebook && (
                <a
                  target='_blank'
                  href={facebookLink.startsWith('http') ? facebookLink : `https://${facebookLink}`}
                  rel='noopener noreferrer'
                >
                  <div className='flex flex-row py-1 cursor-pointer'>
                    <svg
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      className='text-mainBlue w-7 h-7 mr-2'
                    >
                      <path
                        fillRule='evenodd'
                        d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className=' w-full truncate text-sm text-gray-900'>{facebook}</span>
                  </div>
                </a>
              )}
              {twitter && (
                <a
                  target='_blank'
                  href={twitterLink.startsWith('http') ? twitterLink : `https://${twitterLink}`}
                  rel='noopener noreferrer'
                >
                  <div className='flex flex-row py-1 cursor-pointer'>
                    <svg
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      className='text-blue-400 w-7 h-7 mr-2'
                    >
                      <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                    </svg>
                    <span className=' w-full truncate text-sm text-gray-900'>{twitter}</span>
                  </div>
                </a>
              )}

              {linkedin && (
                <a
                  target='_blank'
                  href={linkedinLink.startsWith('http') ? linkedinLink : `https://${linkedinLink}`}
                  rel='noopener noreferrer'
                >
                  <div className='flex flex-row py-1 cursor-pointer'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='25'
                      height='25'
                      className='text-blue-500 w-7 h-7 mr-2'
                      viewBox='0 0 50 50'
                      fill='currentColor'
                    >
                      <path d='M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z'>
                        {' '}
                      </path>
                    </svg>
                    <span className=' w-full truncate text-sm text-gray-900'>{linkedin}</span>
                  </div>
                </a>
              )}
              {instagram && (
                <a
                  target='_blank'
                  href={
                    instagramLink.startsWith('http') ? instagramLink : `https://${instagramLink}`
                  }
                  rel='noopener noreferrer'
                >
                  <div className='flex flex-row py-1 cursor-pointer'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      aria-hidden='true'
                      role='img'
                      className='w-7 h-7 mr-2 text-orange-300'
                      width='1em'
                      height='1em'
                      preserveAspectRatio='xMidYMid meet'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        fillRule='evenodd'
                        d='M7.465 1.066C8.638 1.012 9.012 1 12 1c2.988 0 3.362.013 4.534.066c1.172.053 1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12c0 2.988-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.396 5.396 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066c-2.988 0-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.397 5.397 0 0 1-1.949-1.268a5.392 5.392 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12c0-2.988.013-3.362.066-4.534c.053-1.172.24-1.972.511-2.672a5.396 5.396 0 0 1 1.27-1.948a5.392 5.392 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511Zm8.98 1.98c-1.16-.053-1.508-.064-4.445-.064c-2.937 0-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.412 3.412 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445c0 2.937.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064c2.938 0 3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445c0-2.937-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.413 3.413 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379Zm-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986ZM8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996Zm10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89Z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className=' w-full truncate text-sm text-gray-900'>{instagram}</span>
                  </div>
                </a>
              )}
              {youtube && (
                <a
                  target='_blank'
                  href={youtubeLink.startsWith('http') ? youtubeLink : `https://${youtubeLink}`}
                  rel='noopener noreferrer'
                >
                  <div className='flex flex-row py-1 cursor-pointer'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      aria-hidden='true'
                      role='img'
                      className='w-7 h-7 mr-2 text-orange-300'
                      width='1em'
                      height='1em'
                      preserveAspectRatio='xMidYMid meet'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        fillRule='evenodd'
                        d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className=' w-full truncate text-sm text-gray-900'>{youtube}</span>
                  </div>
                </a>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Socials;
