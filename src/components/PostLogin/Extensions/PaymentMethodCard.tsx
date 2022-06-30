import {TrashIcon} from '@heroicons/react/solid';
import axios from 'axios';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import React from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';

const PaymentMethodCard = ({paymentMethodData}) => {
  const {showModal} = ModalContextProvider();
  const router = useRouter();
  const {t} = useTranslation();

  const {isDefault} = paymentMethodData;

  const handleDeletePaymentMethod = async () => {
    try {
      await axios.post('/api/stripe/deletePaymentMethod', {
        paymentMethodId: paymentMethodData.id,
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const deletePaymentMethod = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: `**** **** **** ${paymentMethodData.card.last4}`,
      id: itemID,
      handleDelete: handleDeletePaymentMethod,
    });
  };

  const handleSetDefaultPaymentMethod = async () => {
    try {
      await axios.post('/api/stripe/setDefaultPaymentMethod', {
        customerId: paymentMethodData.customer,
        paymentMethodId: paymentMethodData.id,
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  return (
    <div className='flex flex-col col-span-12 sm:col-span-6 lg:col-span-4 shadow-md divide-y divide-gray-200 rounded-md'>
      <div className='px-4 py-5 flex flex-col gap-2'>
        <div className='flex gap-4'>
          <span>{paymentMethodData.card.brand.toUpperCase()}</span>{' '}
          <span>{`**** **** **** ${paymentMethodData.card.last4}`}</span>
        </div>
        <span>
          {t('common:Expiration')}:{' '}
          {`${
            paymentMethodData.card.exp_month < 10
              ? `0${paymentMethodData.card.exp_month}`
              : `${paymentMethodData.card.exp_month}`
          }/${paymentMethodData.card.exp_year}`}
        </span>
      </div>
      <div className='px-4 py-5 flex justify-between items-center'>
        <button
          onClick={handleSetDefaultPaymentMethod}
          disabled={paymentMethodData.isDefault}
          className={`${
            isDefault ? `bg-green-500` : `bg-mainBlue`
          } py-1 px-2 text-white rounded-md text-sm`}
        >
          {paymentMethodData.isDefault ? t('common:Default') : t('common:Make_Default')}
        </button>
        <button onClick={deletePaymentMethod}>
          <TrashIcon className='w-5 h-5 text-red-600 opacity-50 hover:opacity-100 duration-200' />
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
