import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useState} from 'react';
import PaymentMethodError from './PaymentMethodError';

const PaymentMethodForm = ({setShowMethodForm, customerId}) => {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();
  const {t} = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await stripe?.confirmSetup({
        elements: elements!,
        redirect: 'if_required',
      });

      if (data?.error?.message) {
        setLoading(false);
        setErrorMessage(data.error.message!);
        return;
      }

      await axios.post('/api/stripe/setDefaultPaymentMethod', {
        customerId,
        paymentMethodId: data?.setupIntent?.payment_method,
      });

      router.reload();
    } catch (error) {
      console.log('Unknown Error');
      setErrorMessage('Unknown Error');
    }
  };

  if (!stripe || !elements) {
    return null;
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      {errorMessage ? (
        <PaymentMethodError
          closeError={() => {
            setErrorMessage('');
          }}
          errorMessage={errorMessage}
        />
      ) : null}
      <div className='flex gap-12 justify-center w-full'>
        <form className='flex flex-col gap-3 w-full p-5' onSubmit={handleSubmit}>
          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={loading}
              className='bg-mainBlue disabled:opacity-25 mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
            >
              {loading ? t('common:txt_submitting') : t('common:btn_submit')}
            </button>
            <button
              onClick={() => {
                setShowMethodForm(false);
              }}
              disabled={loading}
              className='bg-red-600 disabled:opacity-25 mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-red-700'
            >
              {t('common:btn_cancel')}
            </button>
          </div>
          <PaymentElement />
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
