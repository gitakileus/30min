import {NOTIFICATION_TYPES} from 'constants/context/notification';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useContext, useEffect, useState} from 'react';
import {NotificationContext} from 'store/Notification/Notification.context';
import {UserContext} from 'store/UserContext/User.context';
import {PencilIcon, PlusIcon} from '@heroicons/react/solid';

const MainCard = ({User, hasIntegrations, userServices}) => {
  const {t} = useTranslation();
  const [publicUrl, setPublicUrl] = useState('');

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const handleCopyLink = () => {
    showNotification(NOTIFICATION_TYPES.info, 'Link successfully copied', false);
  };

  useEffect(() => {
    setPublicUrl(`${window.origin}/${User?.accountDetails?.username}`);
  }, []);

  const {
    state: {visible, headline, description},
    actions: {setVisible, setheadline, setDescription},
  } = useContext(UserContext);

  useEffect(() => {
    setVisible(User?.accountDetails?.privateAccount);
    setheadline(User?.personalDetails?.headline);
    setDescription(User?.personalDetails?.description);
  }, [
    User?.accountDetails?.privateAccount,
    User?.personalDetails?.headline,
    User?.personalDetails?.description,
  ]);

  return (
    <section aria-labelledby='user-info'>
      <div className='bg-white shadow sm:rounded-lg py-4 px-4 mb-4'>
        <div>
          <div className='flex justify-end'>
            <div className='flex flex-row items-center'>
              <a href='/user/edit'>
                <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
              </a>
            </div>
          </div>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>{t('profile:Username')}</dt>
              <dd className='mt-1 text-sm text-gray-900'>{User?.accountDetails?.username}</dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                {t('profile:Account_visibility')}
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {visible ? t('profile:Search_Hidden') : t('profile:Search_Visible')}
              </dd>
            </div>

            <div className='sm:col-span-3'>
              <dt className='text-sm font-medium text-gray-500'>{t('profile:Headline')}</dt>
              {headline && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: headline,
                  }}
                ></dd>
              )}
              {!headline && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: '--',
                  }}
                ></dd>
              )}
            </div>

            <div className='sm:col-span-3'>
              <dt className='text-sm font-medium text-gray-500'>{t('profile:Description')}</dt>
              {description && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                ></dd>
              )}
              {!description && (
                <dd
                  className='mt-1 text-sm text-gray-900 custom'
                  dangerouslySetInnerHTML={{
                    __html: '--',
                  }}
                ></dd>
              )}
            </div>
          </dl>
        </div>
      </div>
      <div className='bg-white shadow sm:rounded-lg py-4 px-4 mb-4'>
        <div className='text-sm font-medium text-gray-500 w-full break-words truncate'>
          {t('common:txt_Profile')} :{' '}
          <Link href={`${publicUrl}`} passHref>
            <a className='cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
              {publicUrl}
            </a>
          </Link>
          <button
            className=''
            onClick={() => {
              navigator.clipboard.writeText(`${publicUrl}`);
              handleCopyLink();
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-black'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
          </button>
        </div>
        {hasIntegrations && (
          <div className='text-sm font-medium text-gray-500 w-full break-words truncate'>
            {t('profile:availability_link')} :{' '}
            <Link href={`${publicUrl}/availability`} passHref>
              <a className='cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
                {publicUrl}/availability
              </a>
            </Link>
            <button
              className=''
              onClick={() => {
                navigator.clipboard.writeText(`${publicUrl}/availability`);
                handleCopyLink();
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-black'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {userServices && userServices?.length > 0 && (
        <div className='bg-white shadow sm:rounded-lg py-4 px-4 '>
          <div className='sm:col-span-1'>
            <div className='flex justify-between'>
              <h2 className='text-md font-medium text-gray-500'>{t('common:Services')}</h2>
              <div className='flex flex-row items-center'>
                <a href='/user/services'>
                  <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
                </a>
                <a href='/user/services'>
                  <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
                </a>
              </div>
            </div>
          </div>
          {userServices?.map((item, index) => (
            <div
              className='text-sm font-medium text-gray-500 py-1 w-full break-words truncate'
              key={index}
            >
              {item?.duration} min {item?.price > 0 ? `${item?.currency}${item?.price}` : 'Free'}{' '}
              Meeting: {item?.title}{' '}
              <Link href={`${publicUrl}/${item?.slug}`} passHref>
                <a className='z-30 cursor-pointer text-mainBlue w-full mr-4' target={'_blank'}>
                  {publicUrl}/{item?.slug}
                </a>
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${publicUrl}/${item?.title}`);
                  handleCopyLink();
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-black'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default MainCard;
