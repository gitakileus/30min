import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import mutations from 'constants/GraphQL/Organizations/mutations';
import userMutations from 'constants/GraphQL/User/mutations';
import PendingInvitesSVG from './Svg/PendingInvites';

const CheckForPendingInvites = ({handleClick, invitedOrgs, prev}) => {
  const {data: session} = useSession();
  const {t} = useTranslation();

  const router = useRouter();
  const {step} = router.query;
  const newStep = Number(step);
  const [acceptMutation] = useMutation(mutations.acceptPendingInvite);
  const [rejectMutation] = useMutation(mutations.declinePendingInvite);

  const [updateUser] = useMutation(userMutations.updateUser);
  const acceptInvite = async orgID => {
    try {
      await acceptMutation({
        variables: {
          token: session?.accessToken,
          organizationId: orgID?.organizationId?._id,
          pendingInviteId: orgID?._id,
        },
      });

      await updateUser({
        variables: {
          userData: {
            accountDetails: {
              isIndividual: false,
            },
          },
          token: session?.accessToken,
        },
      });

      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectInvite = async orgID => {
    try {
      await rejectMutation({
        variables: {
          token: session?.accessToken,
          organizationId: orgID?.organizationId?._id,
          pendingInviteId: orgID?._id,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleNext = () => {
    router.push({
      pathname: '/user/welcome',
      query: {step: newStep + 1},
    });
    handleClick();
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 mx-8'>
      <div className='flex items-center justify-center self-start'>
        <PendingInvitesSVG
          className='w-60 h-60 sm:w-96 sm:h-96'
          skeleton='animate-animated animate-fadeInUp animate-fast animate-repeat-1'
        />
      </div>
      <div className='sm:overflow-hidden'>
        <div className='bg-white py-6 px-4 sm:p-6'>
          <div>
            <h2
              id='payment-details-heading'
              className='text-lg leading-6 font-medium text-gray-900'
            >
              {invitedOrgs?.length > 0
                ? t('event:txt_you_were_invited')
                : 'You have no pending invitations'}
            </h2>
          </div>

          {invitedOrgs?.length > 0 &&
            invitedOrgs.map((org, orgIdx) => (
              <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2' key={orgIdx}>
                <div className='col-span-1'>
                  <label htmlFor='first-name' className='block text-md font-medium text-gray-700'>
                    {org?.organizationId?.title}
                  </label>
                </div>
                <div className='col-span-1'>
                  <button
                    type='button'
                    onClick={() => acceptInvite(org)}
                    className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    Accept
                  </button>
                  <button
                    type='button'
                    onClick={() => rejectInvite(org)}
                    className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

          <div className='pt-10 text-right sm:px-6'>
            <button
              type='button'
              onClick={prev}
              className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            >
              {t('common:btn_previous')}
            </button>
            <button
              type='button'
              onClick={handleNext}
              className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            >
              {t('common:btn_continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckForPendingInvites;
