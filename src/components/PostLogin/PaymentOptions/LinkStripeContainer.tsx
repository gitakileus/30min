import {useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import stripeMutations from 'constants/GraphQL/StripeAccount/mutations';
import {useState} from 'react';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const LinkStripeContainer = ({userStripeAccount, accountDocumentId}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const {t} = useTranslation();

  const chargesEnabled = userStripeAccount?.charges_enabled;
  const pendingVerification =
    userStripeAccount?.requirements?.disabled_reason === 'requirements.pending_verification';

  const removeStripeAccount = async () => {
    try {
      setLoading(true);
      await graphqlRequestHandler(
        stripeMutations.deleteStripeAccount,
        {token: session?.accessToken, documentId: accountDocumentId},
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      setLoading(false);
      setApiError(t('common:general_api_error'));
    }
  };

  return (
    <div className='bg-white shadow-md rounded-md p-4 grid grid-cols-4 gap-2 mt-4'>
      <div className='col-span-4 flex flex-col'>
        <h2 className='text-2xl font-bold text-mainBlue'>{t('common:stripe_account')}</h2>
        {!userStripeAccount || !chargesEnabled ? (
          <p className='text-sm text-gray-600'>{t('common:stripe_needed_error')}</p>
        ) : null}
      </div>
      {userStripeAccount && chargesEnabled && (
        <div className='flex flex-col gap-2 col-span-4 text-lg'>
          <span>
            {t('common:active_account')}: {userStripeAccount.email}
          </span>
          <div className='flex gap-4 flex-wrap'>
            <a
              href='/api/stripe/createAccount'
              className={`${
                loading ? 'pointer-events-none cursor-default opacity-30' : ''
              } bg-mainBlue border border-transparent max-w-max rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
            >
              {!loading ? t('common:update_account') : t('common:txt_loading1')}
            </a>
            <button
              onClick={async () => {
                await removeStripeAccount();
              }}
              className={`${
                loading ? 'pointer-events-none cursor-default opacity-30' : ''
              } bg-red-500 border border-transparent max-w-max rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600`}
            >
              {!loading ? t('common:remove_account') : t('common:txt_loading1')}
            </button>
          </div>
          {apiError && <span className='text-base text-red-400'>{apiError}</span>}
        </div>
      )}

      {userStripeAccount && !chargesEnabled && (
        <>
          <div className='col-span-4 sm:col-span-2 flex flex-col gap-2'>
            <p className='text-sm text-red-400'>
              {pendingVerification ? t('common:stripe_pending') : t('common:stripe_info_needed')}
            </p>
            <div className='flex flex-wrap gap-4'>
              <a
                href='/api/stripe/createAccount'
                className={`${
                  loading ? 'pointer-events-none cursor-default opacity-30' : ''
                } bg-mainBlue border border-transparent max-w-max rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
              >
                {!loading ? t('common:update_account') : t('common:txt_loading1')}
              </a>
              <button
                onClick={async () => {
                  await removeStripeAccount();
                }}
                className={`${
                  loading ? 'pointer-events-none cursor-default opacity-30' : ''
                } bg-red-500 border border-transparent max-w-max rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600`}
              >
                {!loading ? t('common:remove_account') : t('common:txt_loading1')}
              </button>
            </div>
          </div>
        </>
      )}

      {!userStripeAccount && (
        <div className='col-span-2'>
          <a
            href='/api/stripe/createAccount'
            className={`${
              loading ? 'pointer-events-none cursor-default opacity-30' : ''
            } bg-mainBlue border border-transparent max-w-max rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
          >
            {!loading ? t('common:link_account') : t('common:txt_loading1')}
          </a>
        </div>
      )}
    </div>
  );
};

export default LinkStripeContainer;
