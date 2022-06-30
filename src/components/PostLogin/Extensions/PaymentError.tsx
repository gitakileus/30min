import {XCircleIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const PaymentError = ({closeError, errorMessage}) => {
  const {t} = useTranslation();

  return (
    <div className='flex flex-col md:flex-row gap-4 md:gap-0 justify-between shadow-md rounded-md py-4 px-3 h-max-min items-center font-bold'>
      <div className='flex items-center gap-2'>
        <button onClick={closeError} className='self-start'>
          <XCircleIcon className='h-6 w-6 border border-transparent rounded-md text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' />
        </button>
        <span>
          {t('common:Error')}: {errorMessage} {t('common:payment_method_error')}
        </span>
      </div>
      <Link href='/user/extensions/billing' passHref>
        <div className='cursor-pointer px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
          {t('page:Extensions_Billing_Page')}
        </div>
      </Link>
    </div>
  );
};

export default PaymentError;
