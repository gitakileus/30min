import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';

const Privacy = () => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/privacy/'}
        description={t('page:privacy_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:Privacy_Policy')} | 30mins`}
      />
      <div className='px-8 py-12 flex flex-col gap-8'>
        <CenteredContainer className='containerCenter gap-8'>
          <h1 className='headerLg font-bold'>{t('page:Privacy_Policy')}</h1>
          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:privacy_overview')}</h3>
            <p>{t('page:privacy_overview_details_1')}</p>
            <p>{t('page:privacy_overview_details_2')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:privacy_information_we_collect')}</h3>
            <p>{t('page:privacy_information_we_collect_details_1')}</p>
            <p>{t('page:privacy_information_we_collect_details_2')}</p>
            <p>{t('page:privacy_information_we_collect_details_3')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <h3 className='header font-bold'>{t('page:privacy_information_you_provide')}</h3>
              <p>{t('page:privacy_information_you_provide_details')}</p>
            </div>
            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_you_provide_details_appointment_information_heading')}
              </h4>
              <p>{t('page:privacy_information_you_provide_details_appointment_information')}</p>
            </div>
            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_you_provide_details_calendar_information_heading')}
              </h4>
              <p>{t('page:privacy_information_you_provide_details_calendar_information')}</p>
            </div>
            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_you_provide_details_billing_information_heading')}
              </h4>
              <p>{t('page:privacy_information_you_provide_details_billing_information')}</p>
            </div>
            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_you_provide_details_log_information_heading')}
              </h4>
              <p>{t('page:privacy_information_you_provide_details_log_information')}</p>
            </div>
            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_you_provide_details_cookie_information_heading')}
              </h4>
              <p>{t('page:privacy_information_you_provide_details_cookie_information')}</p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <h3 className='header font-bold'>{t('page:privacy_information_how_we_use')}</h3>
              <p>{t('page:privacy_information_how_we_use_details')}</p>
            </div>

            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_how_we_use_details_service_heading')}
              </h4>
              <p>{t('page:privacy_information_how_we_use_details_service')}</p>
            </div>

            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_how_we_use_details_improve_heading')}
              </h4>
              <p>{t('page:privacy_information_how_we_use_details_improve')}</p>
            </div>

            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_how_we_use_details_communicate_heading')}
              </h4>
              <p>{t('page:privacy_information_how_we_use_details_communicate')}</p>
            </div>

            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_how_we_use_details_protect_heading')}
              </h4>
              <p>{t('page:privacy_information_how_we_use_details_protect')}</p>
            </div>

            <div>
              <h4 className='headerSm font-bold'>
                {t('page:privacy_information_how_we_use_details_legal_heading')}
              </h4>
              <p>{t('page:privacy_information_how_we_use_details_legal')}</p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:privacy_information_whom_we_share')}</h3>
            <p>{t('page:privacy_information_whom_we_share_details_1')}</p>
            <p>{t('page:privacy_information_whom_we_share_details_2')}</p>
            <p>{t('page:privacy_information_whom_we_share_details_6')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:privacy_security')}</h3>
            <p>{t('page:privacy_security_details_1')}</p>
            <p>{t('page:privacy_security_details_2')}</p>
            <p>{t('page:privacy_security_details_3')}</p>
            <p>{t('page:privacy_security_details_4')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:privacy_outside_usa')}</h3>
            <p>{t('page:privacy_outside_usa_details_1')}</p>
            <p>{t('page:privacy_outside_usa_details_2')}</p>
            <p>{t('page:privacy_outside_usa_details_3')}</p>
            <p>{t('page:privacy_outside_usa_details_4')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:Use_of_Data')}</h3>
            <div>
              <p>{t('page:Use_of_Data_1')}</p>
              <ul className='list-disc ml-4'>
                <li>{t('page:Use_of_Data_2')}</li>
                <li>{t('page:Use_of_Data_3')}</li>
                <li>{t('page:Use_of_Data_4')}</li>
                <li>{t('page:Use_of_Data_5')}</li>
                <li>{t('page:Use_of_Data_6')}</li>
                <li>{t('page:Use_of_Data_7')}</li>
                <li>{t('page:Use_of_Data_8')}</li>
                <li>{t('page:Use_of_Data_9')}</li>
                <li>{t('page:Use_of_Data_10')}</li>
                <li>{t('page:Use_of_Data_11')}</li>
                <li>{t('page:Use_of_Data_12')}</li>
                <li>{t('page:Use_of_Data_13')}</li>
              </ul>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='header font-bold'>{t('page:Payment_Disputes')}</h3>
            <p>{t('page:Please_email_us_disputes')}</p>
          </div>
        </CenteredContainer>
      </div>
    </Layout>
  );
};

export default Privacy;
