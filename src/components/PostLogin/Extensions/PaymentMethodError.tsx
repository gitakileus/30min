import useTranslation from 'next-translate/useTranslation';
import {XCircleIcon} from '@heroicons/react/solid';

const PaymentMethodError = ({closeError, errorMessage}) => {
  const {t} = useTranslation();

  return (
    <div className='flex flex-col gap-2 justify-between shadow-md rounded-md py-4 px-3 h-max-min items-center font-bold w-full'>
      <div className='flex items-center gap-2 w-full'>
        <button onClick={closeError} className='self-start'>
          <XCircleIcon className='w-6 h-6 border border-transparent rounded-md text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500' />
        </button>
        <span>
          {t('common:Error')}: {errorMessage}
        </span>
      </div>
      <span>{t('common:add_payment_method_error')}</span>
    </div>
  );
};

export default PaymentMethodError;
