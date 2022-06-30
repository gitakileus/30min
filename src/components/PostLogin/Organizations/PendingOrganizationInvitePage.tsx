import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ChevronRightIcon} from '@heroicons/react/solid';
import Link from 'next/link';
import InvitedOrganizationDisplayItem from './InvitedOrganizationDisplayItem';

const PendingOrganizationInvitePage = ({pendingInvites}) => {
  const {data: session} = useSession();

  const invitedOrgs = pendingInvites?.data?.getPendingInvitesByUserId?.pendingInvites;

  const {t} = useTranslation();
  if (session) {
    return (
      <>
        <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
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
                    <a
                      href='/user/organizations'
                      className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                    >
                      {t('profile:organization_page_button')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                      {t('common:pending_invites')}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className='mt-2 text-2xl h-10 font-bold  text-mainBlue sm:text-3xl sm:truncate'>
              {t('common:pending_invites')}
            </h2>
          </div>
        </div>
        <div className={'flex flex-col items-center py-4  w-full h-full gap-4'}>
          {invitedOrgs && invitedOrgs?.length > 0 ? (
            <div className='bg-white w-full shadow-md rounded-md flex flex-col gap-2'>
              {invitedOrgs.map(invites => (
                <InvitedOrganizationDisplayItem key={invites} pendingInvites={invites} />
              ))}
            </div>
          ) : (
            <div className='rounded-lg shadow-lg px-5 py-4 mb-6 justify-center'>
              <p className='text-2xl font-normal text-center'>{t('common:no_pending_invites')}</p>
              <p className='text-lg font-normal'>{t('common:expired_pending_invite')}</p>
            </div>
          )}
        </div>
      </>
    );
  }
  return null;
};
export default PendingOrganizationInvitePage;
