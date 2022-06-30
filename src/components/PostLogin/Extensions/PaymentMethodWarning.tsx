import useTranslation from 'next-translate/useTranslation';
import {XCircleIcon} from '@heroicons/react/solid';
import Link from 'next/link';

const PaymentMethodWarning = ({closeWarning}) => {
  const {t} = useTranslation();

  return (
    <div className='flex flex-col md:flex-row gap-4 md:gap-0 justify-between shadow-md rounded-md py-4 px-3 h-max-min items-center font-bold'>
      <div className='flex items-center gap-2'>
        <button onClick={closeWarning} className='self-start'>
          <XCircleIcon className='h-6 w-6 border border-transparent rounded-md text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' />
        </button>
        <span>{t('common:checkout_payment_method_warning')}</span>
      </div>
      <Link href='/user/extensions/billing' passHref>
        <a className='bg-mainBlue py-1 px-2 text-white rounded-md hover:bg-blue-700'>
          {t('common:manage_payment_methods')}
        </a>
      </Link>
    </div>
  );
};

export default PaymentMethodWarning;
