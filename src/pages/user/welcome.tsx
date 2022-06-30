import Layout from 'components/Layout/PostLogin';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import {getSession, useSession} from 'next-auth/react';
import StepperTabs from 'components/PostLogin/WelcomePage/TabComponent';
import {useEffect, useState} from 'react';
import StepOne from 'components/PostLogin/WelcomePage/Steps/StepOne';
import StepTwo from 'components/PostLogin/WelcomePage/Steps/StepTwo';
import CheckforPendingInvites from 'components/PostLogin/WelcomePage/Steps/CheckForPendingInvites';
import AddOrgServices from 'components/PostLogin/WelcomePage/Steps/AddOrgServices';
import LastStep from 'components/PostLogin/WelcomePage/Steps/LastStep';
import {useRouter} from 'next/router';
import PreStep from 'components/PostLogin/WelcomePage/Steps/PreStepone';
import queries from 'constants/GraphQL/User/queries';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import orgQueries from 'constants/GraphQL/Organizations/queries';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import {useQuery} from '@apollo/client';

const Welcome = ({integrations, userDataResults}) => {
  const {data: session, status} = useSession();
  const router = useRouter();
  const {query} = router;
  const Step = {
    currentStep: 0,
  };
  const [state, setState] = useState(Step);
  const {t} = useTranslation();

  const User = userDataResults?.data?.getUserById?.userData;

  const hasGoogle = integrations?.data?.getCredentialsByToken?.googleCredentials;
  const hasOffice = integrations?.data?.getCredentialsByToken?.officeCredentials;
  const hasCalendars = hasGoogle !== null || hasOffice !== null;

  const {data: invitedUsers} = useQuery(orgQueries.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });
  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;

  const {data: userOrganizations} = useQuery(orgQueries.getOrganizationManagementDetails, {
    variables: {token: session?.accessToken},
  });

  const currentOrganizations = userOrganizations?.getOrganizationManagementDetails?.membershipData;

  const hasCategories = currentOrganizations?.filter(
    org => org.organizationId?.serviceCategories?.length > 0
  );

  const isWelcomeComplete = User?.welcomeComplete;

  const handleClick = (clickType: string) => {
    const {currentStep} = state;
    let newStep = currentStep;

    if (clickType === 'next') {
      newStep++;
    } else if (clickType === 'final') {
      router.reload();
    } else {
      newStep--;
    }

    setState({
      ...state,
      currentStep: newStep,
    });
  };

  useEffect(() => {
    if (query.step) {
      let {currentStep} = state;
      currentStep = parseInt(query.step.toString(), 10);

      setState({
        ...state,
        currentStep: currentStep,
      });
    }
  }, []);

  useEffect(() => {
    if (isWelcomeComplete) {
      setState({
        ...state,
        currentStep: 0,
      });
      router.push({
        pathname: '/user/welcome',
        query: {step: 0},
      });
    }
  }, []);

  const welcomeTab = [
    {
      title: 'Finish Welcome',
      content: <LastStep User={User} integrations={integrations} />,
    },
  ];

  const tabsNoInvites = [
    {
      title: 'Welcome',
      content: <PreStep handleClick={() => handleClick('next')} />,
    },
    {
      title: 'Personal Info',
      content: (
        <StepOne
          User={User}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Calendar',
      content: (
        <StepTwo
          User={User}
          integrations={integrations}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Finish Welcome',
      content: <LastStep User={User} integrations={integrations} />,
    },
  ];

  const tabsWithInvites = [
    {
      title: 'Welcome',
      content: <PreStep handleClick={() => handleClick('next')} />,
    },
    {
      title: 'Personal Info',
      content: (
        <StepOne
          User={User}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Pending Organization Invites',
      content: (
        <CheckforPendingInvites
          invitedOrgs={invitedOrgs}
          prev={() => handleClick('prev')}
          handleClick={() => handleClick('next')}
        />
      ),
    },
    {
      title: 'Calendar',
      content: (
        <StepTwo
          User={User}
          integrations={integrations}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Finish Welcome',
      content: <LastStep User={User} integrations={integrations} />,
    },
  ];

  const tabsWithAcceptedInvites = [
    {
      title: 'Welcome',
      content: <PreStep handleClick={() => handleClick('next')} />,
    },
    {
      title: 'Personal Info',
      content: (
        <StepOne
          User={User}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
    {
      title: 'Pending Organization Invites',
      content: (
        <CheckforPendingInvites
          invitedOrgs={invitedOrgs}
          prev={() => handleClick('prev')}
          handleClick={() => handleClick('next')}
        />
      ),
    },
    {
      title: 'Calendar',
      content: (
        <StepTwo
          User={User}
          integrations={integrations}
          handleClick={() => handleClick('next')}
          prev={() => handleClick('prev')}
        />
      ),
    },
  ];

  if (hasCategories) {
    hasCategories.forEach(org => {
      tabsWithAcceptedInvites.push({
        title: org.organizationId.title,
        content: <AddOrgServices org={org} User={User} handleClick={() => handleClick('next')} />,
      });
    });
    tabsWithAcceptedInvites.push({
      title: 'Finish Welcome',
      content: <LastStep User={User} integrations={integrations} />,
    });
  }

  return (
    <ProtectedRoute status={status}>
      <Layout>
        <Head>
          <title>{t('page:Welcome')}</title>
        </Head>
        <StepperTabs
          isWelcomeComplete={isWelcomeComplete}
          tabs={
            isWelcomeComplete
              ? welcomeTab
              : invitedOrgs && invitedOrgs?.length > 0
              ? tabsWithInvites
              : hasCalendars && currentOrganizations?.length > 0
              ? tabsWithAcceptedInvites
              : tabsNoInvites
          }
          activeIndex={state.currentStep}
        />
      </Layout>
    </ProtectedRoute>
  );
};

export default Welcome;
Welcome.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
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
  const {data: integrations} = await graphqlRequestHandler(
    integrationQueries.getCredentialsByToken,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: userDataResults} = await graphqlRequestHandler(
    queries.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  return {
    props: {
      userDataResults,
      integrations,
    },
  };
};
