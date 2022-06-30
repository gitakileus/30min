import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React from 'react';

const ExtensionRequiredModal = ({hideModal}) => {
  const {t} = useTranslation();

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col'>
        <span>{t('common:org_extension_warning')}</span>
        <span>{t('common:org_extension_notice')}</span>
      </div>
      <div>
        <button
          type='button'
          onClick={hideModal}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:btn_cancel')}
        </button>
        <Link passHref href='/user/extensions'>
          <a
            onClick={hideModal}
            className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
          >
            {t('common:view_extensions_page')}
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ExtensionRequiredModal;
