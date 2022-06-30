import Card from 'components/shared/Card';
import CardHeader from 'components/shared/Card/CardHeader';
import CardBody from 'components/shared/Card/CardBody';
import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import headerImage from '../../public/assets/pricing_header.svg';

const Pricing = () => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/pricing/'}
        description={t('page:pricing_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:Pricing')} | 30mins`}
      />
      <div className='containerCenter'>
        <div className='containerGrid gap-8'>
          <div className='col-span-8 m-auto'>
            <Image
              src={headerImage}
              alt='People shaking hands after transaction'
              width={800}
              height={300}
            />
          </div>
          <div className='col-span-8 flex justify-center headerLg font-bold'>
            {t('page:pricing_header')}
          </div>
          <div className='containerGrid col-span-8'>
            <Card className='cardContainerBase col-span-8 sm:col-span-4'>
              <CardHeader className='cardHeaderBase' text={t('client')} />
              <CardBody className='cardBodyBase' text={t('page:pricing_client')} />
            </Card>

            <Card className='cardContainerBase col-span-8 sm:col-span-4 border-green-500'>
              <CardHeader className='cardHeaderBase' text={t('provider')} />
              <CardBody text={t('page:pricing_provider')} />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
