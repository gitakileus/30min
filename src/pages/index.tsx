import Layout from 'components/Layout/PreLogin';
import Hero from 'components/PreLogin/Home/Hero';
import ServiceCards from 'components/PreLogin/Home/ServiceCards';
import ScheduleWithUs from 'components/PreLogin/Home/Schedule';
import {GetServerSideProps} from 'next';
import queries from 'constants/GraphQL/User/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import useTranslation from 'next-translate/useTranslation';

const Home = ({userList}) => {
  const {t} = useTranslation();
  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/'}
        description={t('page:home_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={'30mins.com'}
      />
      <Hero userList={userList} />
      <ServiceCards />
      <ScheduleWithUs />
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const {data: usersWithExtensions} = await graphqlRequestHandler(
      queries.getUsersWithAdvertisingExtension,
      {},
      process.env.BACKEND_API_KEY
    );
    const userList = usersWithExtensions?.data?.getUsersWithAdvertisingExtension?.userData;
    return {
      props: {
        userList,
      },
    };
  } catch (err) {
    return {
      props: {
        userList: [],
      },
    };
  }
};
