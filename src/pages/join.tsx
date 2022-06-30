import {GetServerSideProps} from 'next/types';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import userQueries from 'constants/GraphQL/User/queries';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Layout from '../components/Layout/PreLogin';
import VerifyEmail from '../components/PreLogin/Auth/VerifyEmail';

const Join = ({emailHint, hasAccount, error}) => (
  <Layout>
    <HeadSeo
      canonicalUrl={'https://30mins.com/join/'}
      description={'Schedule Meetings Effortlessly'}
      ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
      ogType={'website'}
      title={'30mins.com Join'}
    />
    <VerifyEmail emailHint={emailHint} queryError={error} hasAccount={hasAccount} />
  </Layout>
);

export default Join;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const {data: emailHintResponse} = await graphqlRequestHandler(
      userQueries.getUserByCode,
      {
        code: context.query.code,
      },
      process.env.BACKEND_API_KEY
    );

    if (emailHintResponse.data.getUserByCode.response.status === 404) {
      return {
        props: {
          error: 'Account not Found',
        },
      };
    }

    const {emailHint, hasAccount} = emailHintResponse.data.getUserByCode;

    return {
      props: {
        emailHint,
        hasAccount,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
