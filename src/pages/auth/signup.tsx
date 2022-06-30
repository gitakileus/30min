import Layout from 'components/Layout/PreLogin';
import SignUp from 'components/PreLogin/Auth/SignUp';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import useTranslation from 'next-translate/useTranslation';

const LoginPage = () => {
  const {t} = useTranslation();
  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/auth/login/'}
        description={t('page:signup_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('common:SIGN_UP')} | 30mins`}
      />
      <SignUp />
    </Layout>
  );
};

export default LoginPage;
