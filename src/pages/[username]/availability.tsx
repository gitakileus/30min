import React, {useState, useEffect} from 'react';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {ShareIcon, ChatAlt2Icon} from '@heroicons/react/outline';
import Calendar from 'components/PreLogin/Booking/Calendar';
import HeadSeo from 'components/shared/HeadSeo/Seo';

const AvailabilityPage = ({user}) => {
  const [publicUrl, setPublicUrl] = useState('');
  const [userPublicUrl, setUserPublicUrl] = useState('');
  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();

  const router = useRouter();
  useEffect(() => {
    setPublicUrl(window.origin + router.asPath);
    setUserPublicUrl(window.location.href.split('/availability')[0]);
  }, [user]);

  const shareProfile = () => {
    showModal(MODAL_TYPES.SHAREPROFILE, {
      name: user?.personalDetails?.name,
      userLink: publicUrl,
      sharePage: true,
    });
  };

  const UserSocials = user?.personalDetails?.socials;
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

  const sendMessageExtenmsion = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: user?.personalDetails?.name,
      providerEmail: user?.accountDetails?.email,
    });
  };

  return (
    <>
      <HeadSeo
        title={user?.personalDetails?.name}
        description={user?.personalDetails?.headline}
        canonicalUrl={`https://30mins.com/${user?.accountDetails?.username}/availability`}
        ogTwitterImage={
          user?.accountDetails?.avatar
            ? user?.accountDetails?.avatar
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />
      <div className='absolute w-full h-full'>
        <div className='my-6 lg:my-12 container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4'>
          <div className='container mx-auto px-6'>
            <div className='w-full h-64 rounded '>
              <div className='bg-white  shadow rounded xl:flex lg:flex w-full'>
                <div className='xl:w-2/5 lg:w-2/5 bg-gray-100  py-8 border-gray-300 xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0  justify-center items-center'>
                  <div className='flex flex-col items-center w-full'>
                    <div className='h-24 w-24 rounded-full mb-3'>
                      <Image
                        className='h-full w-full object-cover rounded-full shadow'
                        src={user?.accountDetails?.avatar || '/assets/default-profile.jpg'}
                        alt='avatar'
                        width={200}
                        height={200}
                      />
                    </div>
                    <p className='mb-2 text-lg font-bold text-mainBlue'>
                      <a href={`/${user.accountDetails.username}/`}>
                        {' '}
                        {user?.personalDetails?.name}
                      </a>
                    </p>
                    <div className='items-center justify-center'>
                      {hasSocials && (
                        <div className='item w-full h-12 flex-row'>
                          <>
                            <div className='flex pt-2 text-sm text-gray-500'>
                              <div className='flex-1 inline-flex items-center'>
                                <a href={userPublicUrl} target='_blank' rel='noreferrer'>
                                  <img src='/assets/logo.svg' alt='logo' className='w-7 h-7 mr-1' />
                                </a>
                                {twitterLink && (
                                  <>
                                    <a href={twitterLink}>
                                      <svg
                                        fill='currentColor'
                                        viewBox='0 0 24 24'
                                        className='w-7 h-7 mr-1'
                                      >
                                        <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                                      </svg>
                                    </a>
                                  </>
                                )}
                                {facebookLink && (
                                  <>
                                    <a href={facebookLink}>
                                      <svg
                                        fill='currentColor'
                                        viewBox='0 0 24 24'
                                        className='w-7 h-7 mr-1'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                    </a>
                                  </>
                                )}
                                {linkedinLink && (
                                  <>
                                    <a href={linkedinLink}>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='25'
                                        className='w-7 h-7 mr-1'
                                        height='25'
                                        viewBox='0 0 50 50'
                                        fill='currentColor'
                                      >
                                        <path d='M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z'>
                                          {' '}
                                        </path>
                                      </svg>
                                    </a>
                                  </>
                                )}
                                {instagramLink && (
                                  <>
                                    <a href={instagramLink}>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        aria-hidden='true'
                                        role='img'
                                        width='1em'
                                        className='w-7 h-7 mr-1'
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
                                    </a>
                                  </>
                                )}
                                {youtubeLink && (
                                  <>
                                    <a href={youtubeLink}>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        aria-hidden='true'
                                        role='img'
                                        width='1em'
                                        className='w-7 h-7 mr-1'
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
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        </div>
                      )}
                    </div>

                    <div className='py-1'>
                      <button
                        type='submit'
                        onClick={shareProfile}
                        className='w-40 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                      >
                        <ShareIcon className='w-4 h-4 mr-2 ' /> {t('profile:share_page')}
                      </button>

                      <div className='py-2'>
                        <button
                          type='button'
                          onClick={sendMessageExtenmsion}
                          className='w-40 py-2 bg-mainBlue border border-transparent rounded-md shadow-sm px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                        >
                          <ChatAlt2Icon className='w-4 h-4 mr-2 ' />{' '}
                          {t('page:send_message_extension')}
                        </button>
                      </div>
                    </div>
                    <div className='px-3 py-2 text-sm w-full'>
                      {user?.personalDetails?.headline && (
                        <p className='mb-2 text-sm text-gray-700 font-bold overflow-hidden break-words'>
                          {user?.personalDetails?.headline}
                        </p>
                      )}
                      <div className='flex text-left pt-5'>
                        <p className='overflow-y-auto h-full break-words text-xs mb-4'>
                          {user?.personalDetails?.description && (
                            <div className='sm:col-span-2 text-sm'>
                              <dd
                                className='custom'
                                dangerouslySetInnerHTML={{
                                  __html: user?.personalDetails?.description,
                                }}
                              ></dd>
                            </div>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='xl:w-3/5 lg:w-3/5 px-6 py-8'>
                  <Calendar user={user} serviceData={null} isAvailability={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AvailabilityPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const {data: userData} = await graphqlRequestHandler(
    queries.getPublicUserData,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: userId} = await graphqlRequestHandler(
    queries.getUserByUsername,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  if (!userData?.data?.getPublicUserData?.userData || !userId?.data?.getUserByUsername?.userData) {
    return {
      notFound: true,
    };
  }

  const id = userId?.data?.getUserByUsername?.userData?._id;

  const {data: credentials} = await graphqlRequestHandler(
    integrationQueries.getCredentialsByUserId,
    {
      userId: id,
    },
    process.env.BACKEND_API_KEY
  );

  const credentialResponse = credentials?.data?.getCredentialsByUserId?.response;
  if (credentialResponse?.status === 404) {
    return {
      notFound: true,
    };
  }
  const {status} = userData.data.getPublicUserData.response;

  if (status === 404) {
    return {
      notFound: true,
    };
  }
  const user = userData?.data?.getPublicUserData?.userData;

  return {
    props: {
      user,
    },
  };
};
