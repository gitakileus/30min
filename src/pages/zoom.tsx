import React from 'react';
import Layout from 'components/Layout/PreLogin';
import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import HeadSeo from 'components/shared/HeadSeo/Seo';

export default function ZoomDocumentation() {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/zoom/'}
        description={'Schedule Meetings Effortlessly'}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={'30mins.com Zoom'}
      />
      <div className='px-8 py-12 flex flex-col gap-8'>
        <CenteredContainer className='containerCenter gap-8'>
          <h1 className='headerLg font-bold'>{t('common:zoom_doc_title')}</h1>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('common:zoom_doc_header_1')}</h3>
            <ul className='list-decimal ml-4 flex gap-2 flex-col'>
              <li>{t('common:zoom_doc_section_1_text_1')}</li>
              <ul className='list-disc ml-4 flex gap-2 flex-col'>
                <li>
                  {t('common:zoom_doc_section_1_text_1_sub_1')}{' '}
                  <a href='https://30mins.com/auth/signup' className='text-mainBlue'>
                    https://30mins.com/auth/signup
                  </a>
                </li>
                <li>
                  {t('common:zoom_doc_section_1_text_1_sub_2')}{' '}
                  <a href='https://30mins.com/auth/login' className='text-mainBlue'>
                    https://30mins.com/auth/login
                  </a>
                </li>
              </ul>

              <li>{t('common:zoom_doc_section_1_text_2')}</li>
              <ul className='list-disc ml-4 flex gap-2 flex-col'>
                <li>{t('common:zoom_doc_section_1_text_2_sub_1')}</li>
                <li>{t('common:zoom_doc_section_1_text_2_sub_2')}</li>
              </ul>
              <li>{t('common:zoom_doc_section_1_text_3')}</li>
              <li>{t('common:zoom_doc_section_1_text_4')}</li>
              <li>{t('common:zoom_doc_section_1_text_5')}</li>
              <li>{t('common:zoom_doc_section_1_text_6')}</li>
              <li>{t('common:zoom_doc_section_1_text_7')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('common:zoom_doc_header_2')}</h3>
            <h3 className='headerSm font-bold'>{t('common:zoom_doc_subheader_2')}</h3>
            <ul className='list-decimal ml-4 flex gap-2 flex-col'>
              <li>{t('common:zoom_doc_subheader_text_1')}</li>
              <li>{t('common:zoom_doc_subheader_text_2')}</li>
              <li>{t('common:zoom_doc_subheader_text_3')}</li>
              <li>{t('common:zoom_doc_subheader_text_4')}</li>
            </ul>
            <p>{t('common:zoom_doc_section_2_text_1')}</p>
            <p>{t('common:zoom_doc_section_2_text_2')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('common:zoom_doc_header_3')}</h3>
            <ul className='list-decimal ml-4 flex gap-2 flex-col'>
              <li>{t('common:zoom_doc_section_3_text_1')}</li>
              <li>{t('common:zoom_doc_section_3_text_2')}</li>
              <li>{t('common:zoom_doc_section_3_text_3')}</li>
              <li>{t('common:zoom_doc_section_3_text_4')}</li>
            </ul>
            <p>{t('common:zoom_doc_section_3_text_5')}</p>
          </div>
        </CenteredContainer>
      </div>
    </Layout>
  );
}
