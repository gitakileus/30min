import useTranslation from 'next-translate/useTranslation';
import {PencilIcon, PlusIcon} from '@heroicons/react/solid';

const Extensions = ({extensionsArray}) => {
  const {t} = useTranslation();

  return (
    <>
      <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
        <div className='flex justify-between'>
          <h2 className='text-md font-medium text-gray-500'>{t('page:Extensions')}</h2>
          <div className='flex flex-row items-center'>
            <a href='/user/extensions'>
              <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
            </a>
            <a href='/user/extensions'>
              <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
            </a>
          </div>
        </div>
        <div className='mt-2 flow-root'>
          {extensionsArray && extensionsArray?.length > 0 ? (
            <a href='/user/extensions'>
              <div className='sm:col-span-2'>
                <dd className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                  {extensionsArray
                    .filter(status => status?.status === 'paid' || status?.status === 'gifted')
                    .map((extension, index) => (
                      <li key={index}>
                        <span className='text-sm text-gray-900'>{extension?.extensionTitle}</span>
                      </li>
                    ))}
                </dd>
              </div>
            </a>
          ) : (
            <>
              <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                {t('profile:you_have_no_active_extensions')}
              </span>
              <p>
                <a href='/user/extensions' target='_blank' rel='noreferrer'>
                  <button
                    type='button'
                    className='mt-2 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('profile:activate_now')}
                  </button>
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Extensions;
