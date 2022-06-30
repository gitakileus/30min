import {ChevronRightIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const IndexHeaderBar = () => {
  const {t} = useTranslation();

  return (
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
                  {t('page:Extensions')}
                </div>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className='mt-2 text-2xl font-bold h-10 text-mainBlue sm:text-3xl sm:truncate'>
          {t('page:Extensions')}
        </h2>
      </div>
      <a href='/user/extensions/haveAnIdea'>
        <div className='flex py-1 sm:py-0'>
          <img src='/assets/ideaBulb.jpg' width='50px' height='50px' alt='idea' />
          <span className='items-center flex'>{t('page:Have_an_idea_submit_it')}</span>
        </div>
      </a>
    </div>
  );
};

export default IndexHeaderBar;
