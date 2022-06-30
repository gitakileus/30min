import {ExternalLinkIcon} from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const ScheduleWithUs = () => {
  const {t} = useTranslation();
  const [publicUrl, setPublicUrl] = useState('');
  const router = useRouter();
  useEffect(() => {
    setPublicUrl(`${window.origin + router.asPath}/sales/talktous`);
  }, []);

  return (
    <div className='pb-16 bg-gradient-to-r sm:pb-20 lg:z-10 lg:relative'>
      <div className='lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8'>
        <div className='mt-12 lg:m-0 lg:col-span-2 lg:pl-8'>
          <div className='mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none'>
            <div>
              <p className='mt-6 text-2xl font-medium text-mainText'>{t('page:have_ques')}?</p>
            </div>
            <p className='mt-2 text-mainText text-3xl font-extrabold tracking-tight sm:text-4xl'>
              {t('page:use_link_desc')}
            </p>
            <div className='mt-8'>
              <div className='inline-flex rounded-md shadow'>
                <a
                  href={publicUrl}
                  className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-mainBlue hover:text-white duration-150 ease-out hover:bg-blue-800'
                >
                  {t('page:Schedule_time_with_us')}
                  <ExternalLinkIcon className='-mr-1 ml-3 h-5 w-5 text-white' aria-hidden='true' />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='mb-20 relative lg:-my-8'>
          <div className='mx-auto max-w-md px-4 mt-12 sm:mt-0 sm:max-w-3xl sm:px-6 lg:p-0 lg:h-full'>
            <div className='aspect-w-10 aspect-h-6 rounded-xl overflow-hidden sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none lg:h-full shadow-2xl shadow-slate-400 mt-5'>
              <Image
                className='lg:h-full lg:w-full'
                src='/assets/schedule.svg'
                layout='fill'
                alt='schedule'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleWithUs;
