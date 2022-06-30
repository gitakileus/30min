import useTranslation from 'next-translate/useTranslation';
import Layout from 'components/Layout/PostLogin';
import Head from 'next/head';
import {ChevronRightIcon} from '@heroicons/react/solid';

const WriteAnExtension = () => {
  const {t} = useTranslation();
  return (
    <>
      <Head>
        <title>{t('page:write_an_extension')}</title>
      </Head>
      <Layout>
        <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
          <div>
            <nav className='flex' aria-label='Breadcrumb'>
              <ol role='list' className='flex items-center space-x-4'>
                <li>
                  <div className='flex'>
                    <a href={'/'} className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                      {t('page:Home')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <div className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800 cursor-default'>
                      {t('page:write_an_extension')}
                    </div>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className='mt-2 text-2xl font-bold h-10 text-mainBlue sm:text-3xl sm:truncate'>
              {t('page:write_an_extension')}
            </h2>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 mx-8'>
          <div className='flex items-center justify-center self-start'>
            <img src='/assets/write-extension.svg' alt='write extension' />
          </div>

          <div className='sm:overflow-hidden'>
            <div className='bg-white py-6 px-4 sm:p-6'>
              <div>
                <h2 className='text-2xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-3xl'>
                  {t('page:write_an_extension_text')}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default WriteAnExtension;
