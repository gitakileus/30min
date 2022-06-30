import React from 'react';
import Layout from 'components/Layout/PreLogin';
import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import HeadSeo from 'components/shared/HeadSeo/Seo';

export default function TermsAndConditions() {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/tos/'}
        description={t('page:terms_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('common:Terms_and_Conditions1')} | 30mins`}
      />
      <div className='px-8 py-12 flex flex-col gap-8'>
        <CenteredContainer className='containerCenter gap-8'>
          <h1 className='headerLg font-bold'>{t('common:Terms_and_Conditions1')}</h1>
          <div className='flex flex-col gap-4'>
            <p>{t('page:t1')}</p>
            <p>{t('page:t2')}</p>
            <p>{t('page:t3')}</p>
            <p>{t('page:t4')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:t5')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t6')}</li>
              <li>{t('page:t7')}</li>
              <li>{t('page:t8')}</li>
              <li>{t('page:t9')}</li>
              <li>{t('page:t10')}</li>
              <li>{t('page:t11')}</li>
              <li>{t('page:t12')}</li>
              <li>{t('page:t13')}</li>
              <li>{t('page:t14')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('common:sellers')}</h3>
            <h4 className='headerSm font-bold'>{t('common:basics')}</h4>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t15')}</li>
              <li>{t('page:t16')}</li>
              <li>{t('page:t17')}</li>
              <li>{t('page:t18')}</li>
              <li>{t('page:t19')}</li>
              <li>{t('page:t20')}</li>
              <li>{t('page:t21')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('common:services')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t22')}</li>
              <li>{t('page:t23')}</li>
              <li>{t('page:t24')}:</li>
              <p>
                <ul className='list-decimal ml-4'>
                  <li>{t('page:t25')}</li>
                  <li>{t('page:t26')}</li>
                  <li>{t('page:t27')}</li>
                  <li>{t('page:t28')}</li>
                  <li>{t('page:t29')}</li>
                  <li>{t('page:t30')}</li>
                  <li>{t('page:t31')}</li>
                  <li>{t('page:t32')}</li>
                </ul>
              </p>
              <li>{t('page:t89')}</li>
              <li>{t('page:t88')}</li>
              <li>{t('page:t87')}</li>
              <li>{t('page:t86')}</li>
              <li>{t('page:t85')}</li>
              <li>{t('page:t84')}</li>
              <li>{t('page:t83')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('common:levels')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t82')}</li>
              <li>{t('page:t81')}</li>
              <li>{t('page:t80')}</li>
              <li>{t('page:t79')}</li>
              <li>{t('page:t78')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('page:t77')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t76')}</li>
              <li>{t('page:t75')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('common:buyers')}</h3>
            <h3 className='headerSm font-bold'>{t('common:basics')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t74')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('common:purchasing')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t73')}</li>
              <li>{t('page:t72')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('page:t71')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t70')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('page:t69')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t68')}</li>
              <li>{t('page:t67')}</li>
              <li>{t('page:t66')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('common:basics')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t65')}</li>
              <li>{t('page:t64')}</li>
              <li>{t('page:t63')}</li>
              <li>{t('page:t62')}</li>
              <li>{t('page:t61')}</li>
              <li>{t('page:t60')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('common:services')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t59')}</li>
              <li>{t('page:t58')}</li>
              <li>{t('page:t57')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='headerSm font-bold'>{t('page:t56')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t55')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('common:violations')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t54')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:t53')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t52')}</li>
              <li>{t('page:t51')}</li>
              <li>{t('page:t50')}</li>
              <li>{t('page:t49')}</li>
              <li>{t('page:t48')}</li>
              <li>{t('page:t47')}</li>
              <li>{t('page:t46')}</li>
              <li>{t('page:t45')}</li>
              <li>{t('page:t44')}</li>
              <li>{t('page:t43')}</li>
              <li>{t('page:t42')}</li>
            </ul>
          </div>

          <div className='flex flex-col gap-4'>
            <h3 className='header font-bold'>{t('page:t41')}</h3>
            <ul className='list-disc ml-4 flex gap-2 flex-col'>
              <li>{t('page:t40')}</li>
            </ul>
          </div>
        </CenteredContainer>
      </div>
    </Layout>
  );
}
