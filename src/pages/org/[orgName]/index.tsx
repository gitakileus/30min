import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/Organizations/queries';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';
import Header from 'components/PreLogin/PublicOrgPage/Header';
import {useState} from 'react';
import {SUMMARY_TABS, TABS, TABS_TYPES} from 'constants/context/tabs';
import OrgMemberSearch from 'components/PostLogin/Organizations/Tabs/OrgMemberSearch';
import Tabs from 'components/PostLogin/Tabs/Tab';
import OrgServiceSearch from 'components/PostLogin/Organizations/Tabs/OrgServiceSearch';
import HeadSeo from 'components/shared/HeadSeo/Seo';

const OrganizationPublicPage = ({organization}) => {
  const ReactSlides = dynamic(() => import('react-google-slides'), {
    ssr: false,
  });

  const organizationDetails = organization?.data?.getOrganizationBySlug?.organizationData;
  const hasServices = organizationDetails?.services?.length > 0;
  const [tab, setTab] = useState(TABS.members);

  const tabsContent = {
    [tab === TABS_TYPES.organization ? TABS.members : TABS.members]: (
      <OrgMemberSearch
        organizationDetails={organizationDetails}
        isManagement={false}
        userRole={null}
      />
    ),
    services: <OrgServiceSearch organizationDetails={organizationDetails} />,
  };

  return (
    <>
      <HeadSeo
        title={organizationDetails?.title}
        description={organizationDetails?.description}
        canonicalUrl={`https://30mins.com/org/${organizationDetails?.title}/`}
        ogTwitterImage={
          organizationDetails?.image
            ? organizationDetails?.image
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />
      <Header organizationDetails={organizationDetails} isManagement={false} />
      <div className='flex w-full justify-center bg-white '>
        {organizationDetails?.media?.link &&
        organizationDetails?.media?.type === 'Google Slides' ? (
          organizationDetails?.media?.type !== '' &&
          organizationDetails?.media?.link.startsWith('https://docs.google.com/presentation') ? (
            <div className='w-1/2 h-full my-8'>
              <ReactSlides
                height='640'
                width='100%'
                slideDuration={5}
                position={1}
                showControls
                loop
                slidesLink={organizationDetails?.media?.link}
              />
            </div>
          ) : null
        ) : null}

        {organizationDetails?.media?.type === 'Youtube Embed' ? (
          <div
            className='relative flex justify-center flex-wrap w-full overflow-hidden my-8'
            style={{
              height: '500px',
            }}
          >
            <ReactPlayer url={`${organizationDetails?.media?.link}`} />
          </div>
        ) : null}
      </div>
      <div className='container px-6 mx-auto items-start lg:items-center justify-between gap-4 flex'>
        <Tabs
          openedTab={tab}
          className={'mr-6 mb-0 list-none flex-wrap  gap-2 sm:gap-0'}
          tabsNames={
            hasServices ? SUMMARY_TABS.organizationPublic : SUMMARY_TABS.organizationPublicMembers
          }
          onChange={(tabName: string) => setTab(tabName)}
        />
      </div>
      <div className='container px-6 mx-auto items-start lg:items-center justify-between gap-4'>
        {tabsContent[tab]}
      </div>
    </>
  );
};
export default OrganizationPublicPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const {data: organization} = await graphqlRequestHandler(
    queries.getOrganizationBySlug,
    {
      slug: context.query.orgName,
    },
    process.env.BACKEND_API_KEY
  );

  const {status} = organization.data.getOrganizationBySlug.response;

  if (status === 500) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      organization,
    },
  };
};
