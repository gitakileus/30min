import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import DropDownComponent from 'components/shared/DropDownComponent';
import {PAYMENT_TYPE} from 'constants/enums';
import {Field} from 'formik';
import useTranslation from 'next-translate/useTranslation';

const ServiceFee = ({values, setFieldValue, handleChange, handleBlur, charities, errors}) => {
  const {t} = useTranslation();

  const SelectCurrencies = [
    {key: '$', value: '$'},
    {key: '£', value: '£'},
    {key: '€', value: '€'},
    {key: '₹', value: '₹'},
  ];
  const SelectDonation = [
    {key: t('Select'), value: ''},
    {key: '25%', value: '25'},
    {key: '50%', value: '50'},
    {key: '100%', value: '100'},
  ];

  const Currencies = SelectCurrencies.map(currency => (
    <option
      className='disabled:text-gray-300'
      key={currency.key}
      disabled={values.paymentType === 'escrow' && currency.key !== '$'}
    >
      {currency.value}
    </option>
  ));

  const setAmmountNull = () => {
    setFieldValue('isPaid', false);
    setFieldValue('price', 0);
    setFieldValue('percentDonated', '0');
    setFieldValue('charity', '');
  };
  return (
    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
      <div className='px-4 py-5 flex-auto'>
        <div className='tab-content tab-space'>
          <div className='block' id='link1'>
            <div className='row'>
              <span className='text-xs'>{t('event:paid_desc')}</span>
            </div>
            <div className='mb-4'>
              <div className='mt-1'>
                <Switch.Group as='div' className='flex items-center justify-between'>
                  <span className='flex-grow flex flex-col'>
                    <Switch.Label as='span' className='text-sm font-medium text-gray-900' passive>
                      {`${`${t('event:Service_Fee')} :`}`}{' '}
                      {values.isPaid ? t('event:Paid') : t('event:Free')}
                    </Switch.Label>
                  </span>
                  <Switch
                    checked={values.isPaid}
                    onChange={() =>
                      values.isPaid ? setAmmountNull() : setFieldValue('isPaid', true)
                    }
                    className={classNames(
                      values.isPaid ? 'bg-mainBlue' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={classNames(
                        values.isPaid ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </Switch.Group>
              </div>
            </div>
            {values.isPaid ? (
              <>
                <div className='col-sm-6 py-4 flex flex-col gap-2'>
                  <span> {t('setting:payment_option_header_event')}</span>
                  <div className='flex flex-col gap-2'>
                    <div>
                      <label className='h-min w-full col-span-2 font-bold flex gap-1 items-center'>
                        <Field
                          onChange={handleChange}
                          type='radio'
                          name='paymentType'
                          value='escrow'
                        />
                        {t('setting:escrow')} - {t('common:escrow_currency_warning')}
                      </label>
                    </div>
                    <div>
                      <label className='h-min w-full col-span-2 font-bold flex gap-1 items-center'>
                        <Field
                          onChange={handleChange}
                          type='radio'
                          name='paymentType'
                          value='direct'
                        />
                        {t('setting:direct_payment')}
                      </label>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='h-min w-full col-span-2 font-bold flex gap-1 items-center'>
                      <Field
                        onChange={handleChange}
                        type='radio'
                        name='paymentType'
                        value='manual'
                      />
                      {t('setting:manual_payment')}
                    </label>
                    {values.paymentType === 'manual' && (
                      <span className='text-sm text-red-500'>
                        {t('setting:manual_payment_warning')}
                      </span>
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <div className='col-span-6 sm:col-span-6 lg:col-span-4'>
                      <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
                        {t('profile:currency')}
                      </label>
                      <select
                        value={values.currency}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        id='currency'
                        name='currency'
                        className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                      >
                        {Currencies}
                      </select>
                    </div>

                    <div className='col-span-6 sm:col-span-3 lg:col-span-4'>
                      <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                        {t('event:txt_Amount')}
                      </label>
                      <input
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type='number'
                        min={1}
                        name='price'
                        id='price'
                        className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      />
                    </div>
                  </div>
                  {values.paymentType !== PAYMENT_TYPE.MANUAL && (
                    <div>
                      <div className='col-span-6 sm:col-span-3 lg:col-span-4'>
                        {charities?.length !== 0 && (
                          <>
                            <label className='block text-sm font-medium text-gray-700'>
                              {' '}
                              {t('event:txt_ae_desc')}
                            </label>
                            <select
                              value={values.charity}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name='charity'
                              className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                            >
                              <option value=''>{t('Select')}</option>
                              {charities &&
                                charities.map(({name}) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                            </select>
                          </>
                        )}
                      </div>
                      {values.charity !== '' && (
                        <div className='col-span-6 sm:col-span-3 lg:col-span-4'>
                          <label
                            htmlFor='postal-code'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('common:Donate')}
                          </label>
                          <DropDownComponent
                            name='percentDonated'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.percentDonated}
                            options={SelectDonation}
                          />
                          {errors.percentDonated ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.percentDonated}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceFee;
