import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/Organizations/queries';
import Link from 'next/link';
import OrganizationNavbar from './OrganizationNavbar';
import useOrganizations from './useOrganizations';
import OrganizationDisplayItem from './OrganizationDisplayItem';

const Organizations = ({organizations, user}) => {
  const {data: session} = useSession();

  const userOrgs = organizations?.data?.getOrganizationManagementDetails?.membershipData;

  const {data: invitedUsers} = useQuery(queries.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;
  const User = user?.data?.getUserById?.userData;

  const {orgModals} = useOrganizations(
    userOrgs,
    User?.accountDetails?.activeExtensions,
    invitedOrgs
  );

  const {t} = useTranslation();
  if (session) {
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
                    <a
                      href='#'
                      className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                    >
                      {t('profile:organization_page_button')}
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className='text-2xl font-bold text-mainBlue sm:text-3xl sm:truncate py-1'>
              Your {t('profile:organization_page_button')}
            </h2>
          </div>

          <OrganizationNavbar orgs={userOrgs} modals={orgModals} invitedOrgs={invitedOrgs} />
        </div>

        <div className={'flex flex-col items-center py-4  w-full h-full gap-4'}>
          {organizations ? (
            <div className='bg-white w-full shadow-md rounded-md flex flex-col gap-2'>
              {userOrgs !== null &&
                userOrgs.map(orgs => (
                  <OrganizationDisplayItem key={orgs.id} userId={User._id} organization={orgs} />
                ))}
            </div>
          ) : null}
        </div>
      </>
    );
  }
  return null;
};
export default Organizations;
