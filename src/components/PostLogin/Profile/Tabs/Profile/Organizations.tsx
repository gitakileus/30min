import orgQuery from 'constants/GraphQL/Organizations/queries';
import {useMutation, useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useRouter} from 'next/router';
import {PencilIcon, PlusIcon} from '@heroicons/react/solid';

const Organizations = ({User}) => {
  const {data: session} = useSession();
  const router = useRouter();
  const {t} = useTranslation();
  const {data: organizations} = useQuery(orgQuery.getOrganizationsByUserId, {
    variables: {token: session?.accessToken},
  });

  const {data: invitedUsers} = useQuery(orgQuery.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;

  const orgs = organizations?.getOrganizationsByUserId?.membershipData;

  const handleEditOrg = ItemID => {
    router.push(`/user/organizations/edit/${ItemID}`);
  };

  const [acceptMutation] = useMutation(mutations.acceptPendingInvite);
  const [rejectMutation] = useMutation(mutations.declinePendingInvite);

  const acceptInvite = async itemID => {
    try {
      await acceptMutation({
        variables: {
          token: session?.accessToken,
          organizationId: itemID?.organizationId?._id,
          pendingInviteId: itemID?._id,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectInvite = async itemID => {
    try {
      await rejectMutation({
        variables: {
          token: session?.accessToken,
          organizationId: itemID?.organizationId?._id,
          pendingInviteId: itemID?._id,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
        <div className='flex justify-between'>
          <h2 className='text-md font-medium text-gray-500'>{t('page:Organizations')}</h2>
          <div className='flex flex-row items-center'>
            <a href='/user/organizations'>
              <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
            </a>
            <a href='/user/organizations'>
              <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
            </a>
          </div>
        </div>
        <div className='mt-2 flow-root'>
          {orgs !== null ? (
            <div className='sm:col-span-2'>
              <dd className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                {t('profile:you_are_member_of_organization')}
                {orgs?.map((org, index) => (
                  <li key={index}>
                    <a
                      href={`/org/${org?.organizationId?.slug}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-mainBlue'
                    >
                      <span className='text-sm text-mainBlue'>{org?.organizationId?.title}</span>{' '}
                    </a>
                    {org?.userId === User?._id && (org?.role === 'owner' || org?.role === 'admin') && (
                      <button type='button' onClick={() => handleEditOrg(org?.organizationId?._id)}>
                        <span className='text-mainBlue'>- Edit</span>
                      </button>
                    )}
                  </li>
                ))}
              </dd>
            </div>
          ) : (
            <>
              <span className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                {t('profile:you_are_not_member_of_any_organization')}
              </span>
              <p>
                <a href='/user/organizations' target='_blank' rel='noreferrer'>
                  <button
                    type='button'
                    className='mt-2 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('profile:create_org_now')}
                  </button>
                </a>
              </p>
            </>
          )}
        </div>
      </div>
      {invitedOrgs && invitedOrgs?.length > 0 && (
        <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
          <h2 className='text-md font-bold text-red-600'>{t('common:pending_invitations')}</h2>
          <div className='mt-2 flow-root'>
            {invitedOrgs?.map((org, index) => (
              <li key={index}>
                <span className='text-sm text-gray-900'>{org?.organizationId?.title} - </span>
                <button onClick={() => acceptInvite(org)}>
                  <span className="className='mt-1 text-sm text-mainBlue overflow-hidden break-words px-2">
                    Accept
                  </span>
                </button>
                <button onClick={() => rejectInvite(org)}>
                  <span className="className='mt-1 text-sm text-gray-900 overflow-hidden break-words">
                    Ignore
                  </span>
                </button>
              </li>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default Organizations;
