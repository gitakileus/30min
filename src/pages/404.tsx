import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';

const NotFound = () => {
  const {t} = useTranslation();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Not Found</title>
        <link rel='icon' href='/assets/favicon.ico' />
      </Head>
      <div className='min-h-full pt-16 pb-12 flex flex-col bg-white'>
        <main className='flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex-shrink-0 flex justify-center'>
            <Link href='/' passHref>
              <span className='inline-flex'>
                <span className='sr-only'>30mins</span>
                <Image
                  className='h-12 w-auto'
                  src='/assets/logo.svg'
                  height={50}
                  width={50}
                  alt='logo'
                />
              </span>
            </Link>
          </div>
          <div className='py-16'>
            <div className='text-center'>
              <p className='text-sm font-semibold text-mainBlue uppercase tracking-wide'>
                404 error
              </p>
              <h1 className='mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl'>
                {t('page:404_does_not_exist')}
              </h1>
              <p className='mt-2 text-base text-gray-500'>{t('page:404_not_found')}</p>
              <div className='mt-6'>
                <Link href='/' passHref>
                  <span className='text-base font-medium text-mainBlue hover:text-blue-700 cursor-pointer'>
                    {t('page:404_go_home')}
                    <span aria-hidden='true'> &rarr;</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <footer className='flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <nav className='flex justify-center space-x-4'>
            <a
              href={`/${router.locale}/`}
              className='text-sm font-medium text-gray-500 hover:text-gray-600'
            >
              {t('page:Home')}
            </a>
            <span className='inline-block border-l border-gray-300' aria-hidden='true' />
            <a
              href={`/${router.locale}/pricing`}
              className='text-sm font-medium text-gray-500 hover:text-gray-600'
            >
              {t('page:Privacy')}
            </a>
            <span className='inline-block border-l border-gray-300' aria-hidden='true' />
            <a
              href={`/${router.locale}/privacy`}
              className='text-sm font-medium text-gray-500 hover:text-gray-600'
            >
              {t('page:Pricing')}
            </a>
          </nav>
        </footer>
      </div>
    </>
  );
};
export default NotFound;
