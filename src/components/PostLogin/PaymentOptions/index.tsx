import {useSession} from 'next-auth/react';
import {Formik, Form, Field} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import Loader from 'components/shared/Loader/Loader';
import {ChevronRightIcon} from '@heroicons/react/outline';
import {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {DIRECT_PAYMENT_OPTIONS, ESCROW_PAYMENT_OPTIONS, PAYMENT_ACCOUNTS} from 'constants/enums';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';

const PaymentOptions = ({user, userStripeAccount}) => {
  const {data: session, status} = useSession();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [updateUser] = useMutation(mutations.updateUser);
  const [paymentAccounts] = useState(user?.accountDetails?.paymentAccounts);
  const router = useRouter();
  const activeStripeAccount = userStripeAccount && userStripeAccount?.charges_enabled;

  const DIRECT_PAYMENT_OPTIONS_LIST = [DIRECT_PAYMENT_OPTIONS.STRIPE];
  const ESCROW_PAYMENT_OPTIONS_LIST = [ESCROW_PAYMENT_OPTIONS.STRIPE];

  const {t} = useTranslation();

  if (status === 'loading') {
    return <Loader />;
  }

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    if (
      (values.directAccounts.includes(PAYMENT_ACCOUNTS.STRIPE) ||
        values.escrowAccounts.includes(PAYMENT_ACCOUNTS.STRIPE)) &&
      !activeStripeAccount
    ) {
      setSubmitting(false);
      showNotification(NOTIFICATION_TYPES.error, t('setting:stripe_required'), false);
      return;
    }
    await updateUser({
      variables: {
        userData: {
          accountDetails: {
            paymentAccounts: {
              direct: values.directAccounts.length === 0 ? [''] : values.directAccounts,
              escrow: values.escrowAccounts.length === 0 ? [''] : values.escrowAccounts,
            },
          },
        },
        token: session?.accessToken,
      },
    });
    router.reload();
    setSubmitting(false);
  };

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
                    </a>
                  </Link>
                </div>
              </li>
              <li>
                <div className='flex items-center'>
                  <ChevronRightIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('setting:payment_methods')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold h-10 text-mainBlue sm:text-3xl sm:truncate'>
            {t('setting:payment_methods')}
          </h2>
        </div>
      </div>
      <div className='mt-4'>
        <div className='bg-white shadow-md rounded-md p-4'>
          <Formik
            initialValues={{
              directAccounts: paymentAccounts?.direct || [],
              escrowAccounts: paymentAccounts?.escrow || [],
            }}
            onSubmit={(values, {setSubmitting}) => {
              submitHandler(values, setSubmitting);
            }}
            enableReinitialize
          >
            {({isSubmitting, values}) => (
              <Form className='grid grid-cols-2 gap-4'>
                <span className='font-medium col-span-2'>{t('setting:payment_option_header')}</span>

                {activeStripeAccount &&
                  !values.directAccounts.includes(PAYMENT_ACCOUNTS.STRIPE) &&
                  !values.escrowAccounts.includes(PAYMENT_ACCOUNTS.STRIPE) && (
                    <div className='col-span-2 font-sm text-red-500'>
                      {t('setting:stripe_not_in_use')}
                    </div>
                  )}

                <div className='col-span-2 sm:col-span-1'>
                  <div className='flex flex-col col-span-12 h-min'>
                    <div className='form-check'>
                      <label className='form-check-label inline-block text-gray-800'>
                        {t('setting:direct_payment')}
                      </label>
                    </div>

                    <div className='flex flex-col gap-2 py-2 items-start pl-2'>
                      {DIRECT_PAYMENT_OPTIONS_LIST.map((option, index) => (
                        <div className='flex gap-2' key={index}>
                          <Field
                            type='checkbox'
                            className='checked:bg-mainBlue disabled:opacity-20'
                            name='directAccounts'
                            value={option.toLowerCase()}
                          />
                          <label
                            htmlFor='directAccounts'
                            className='block text-sm font-medium text-gray-700 '
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                      <span className='text-sm text-red-400 max-w-sm'>
                        {t('setting:direct_payment_warning')}
                      </span>
                    </div>
                  </div>
                  <div className='col-span-12'>
                    <div className='flex mb-6 '>
                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                      >
                        {t('common:btn_save')}
                      </button>
                    </div>
                  </div>
                </div>
                <div className='col-span-2 sm:col-span-1'>
                  <div className='flex flex-col col-span-12 h-min'>
                    <div className='form-check'>
                      <label className='form-check-label inline-block text-gray-800'>
                        {t('setting:escrow')}
                      </label>
                    </div>

                    <div className='flex flex-col gap-2 py-2 items-start pl-2'>
                      {ESCROW_PAYMENT_OPTIONS_LIST.map((option, index) => (
                        <div className='flex gap-2' key={index}>
                          <Field
                            type='checkbox'
                            className='checked:bg-mainBlue disabled:opacity-20'
                            name='escrowAccounts'
                            value={option.toLowerCase()}
                          />
                          <label
                            htmlFor='escrowAccounts'
                            className='block text-sm font-medium text-gray-700 '
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='col-span-12'>
                    <div className='flex mb-6 '>
                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                      >
                        {t('common:btn_save')}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default PaymentOptions;
