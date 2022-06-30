import {getSession, useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/Organizations/queries';
import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {ChevronRightIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import useOrganizations from 'components/PostLogin/Organizations/useOrganizations';
import userQuery from 'constants/GraphQL/User/queries';
import {useEffect, useState} from 'react';
import {SUMMARY_TABS, TABS} from 'constants/context/tabs';
import PendingJoinRequests from 'components/PostLogin/Organizations/Tabs/PendingJoinRequests';
import Tabs from 'components/PostLogin/Tabs/Tab';
import OrgMemberSearch from 'components/PostLogin/Organizations/Tabs/OrgMemberSearch';
import OrgServiceSearch from 'components/PostLogin/Organizations/Tabs/OrgServiceSearch';
import PendingInvites from 'components/PostLogin/Organizations/Tabs/PendingInvites';
import Link from 'next/link';
import {useRouter} from 'next/router';
import Information from 'components/PostLogin/Organizations/Tabs/Information';
import Head from 'next/head';

const OrganizationManagement = ({user, organization, userRole}) => {
  const {status} = useSession();
  const {t} = useTranslation();

  const [currentTab, setTab] = useState(TABS.information);
  const router = useRouter();
  const {tab} = router.query;

  useEffect(() => {
    if (tab) {
      setTab(tab as string);
    }
  }, [tab]);

  const organizationDetails = organization;
  const userData = user?.data?.getUserById?.userData;

  const {orgMethods, orgModals} = useOrganizations(
    organizationDetails,
    userData?.accountDetails?.activeExtensions
  );

  const tabsContent = {
    information: (
      <Information
        organizationDetails={organizationDetails}
        orgMethods={orgMethods}
        orgModals={orgModals}
      />
    ),
    members: (
      <OrgMemberSearch
        organizationDetails={organizationDetails}
        isManagement={true}
        userRole={userRole}
      />
    ),
    services: <OrgServiceSearch organizationDetails={organizationDetails} />,
    [TABS.pendingJoinRequests]: <PendingJoinRequests organization={organizationDetails} />,
    [TABS.pendingInvites]: <PendingInvites organization={organizationDetails} />,
  };

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{organizationDetails?.title}</title>
      </Head>
      <ProtectedRoute status={status}>
        <Layout>
          <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
            <div className='flex-1 min-w-0'>
              <nav className='flex' aria-label='Breadcrumb'>
                <ol role='list' className='flex items-center space-x-4'>
                  <li>
                    <div className='flex'>
                      <a
                        href={'/'}
                        className='text-sm font-medium text-gray-700 hover:text-gray-800'
                      >
                        {t('page:Home')}
                      </a>
                    </div>
                  </li>
                  <li>
                    <div className='flex items-center'>
                      <ChevronRightIcon
                        className='flex-shrink-0 h-5 w-5 text-gray-500'
                        aria-hidden='true'
                      />
                      <Link href='/user/organizations' passHref>
                        <a className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                          {t('profile:organization_page_button')}
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
                      <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                        {organizationDetails.title}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
                {organizationDetails.title}
              </h2>
            </div>
          </div>
          <div className='container mx-auto items-start lg:items-center justify-between gap-4 flex'>
            <Tabs
              openedTab={currentTab}
              className={'mr-6 mb-0 list-none flex-wrap gap-2 sm:gap-0'}
              tabsNames={SUMMARY_TABS.organizationManagement}
              onChange={(tabName: string) => setTab(tabName)}
            />
          </div>
          {tabsContent[currentTab]}
        </Layout>
      </ProtectedRoute>
    </>
  );
};
export default OrganizationManagement;
OrganizationManagement.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await getSession(context);
    const router = context.resolvedUrl;

    if (!session) {
      return {
        redirect: {
          destination: `/auth/login?url=${router}`,
          permanent: false,
        },
      };
    }
    const {data: user} = await graphqlRequestHandler(
      userQuery.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const {data: userOrgMembershipResponse} = await graphqlRequestHandler(
      queries.getOrganizationMembership,
      {
        token: session?.accessToken,
        organizationId: context.query.id,
      },
      session?.accessToken
    );

    const {membership} = userOrgMembershipResponse.data.getOrganizationMembership;
    const organizationData = membership.organizationId;

    if (!['owner', 'admin'].includes(membership?.role)) {
      return {
        notFound: true,
      };
    }

    return {
      props: {user, organization: organizationData, userRole: membership?.role},
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
