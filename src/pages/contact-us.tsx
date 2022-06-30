import PreLoginLayout from 'components/Layout/PreLogin';
import Contact from 'components/PreLogin/Contact/Contact';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import useTranslation from 'next-translate/useTranslation';

const ContactPage = () => {
  const {t} = useTranslation();
  return (
    <PreLoginLayout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/contact-us/'}
        description={t('page:contact_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('common:Contact_Us')} | 30mins`}
      />
      <Contact />
    </PreLoginLayout>
  );
};

export default ContactPage;
