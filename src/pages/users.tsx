import PreLoginLayout from 'components/Layout/PreLogin';
import Users from 'components/PreLogin/Search/Tabs/Users';
import HeadSeo from 'components/shared/HeadSeo/Seo';

const SearchPage = () => (
  <PreLoginLayout>
    <HeadSeo
      canonicalUrl={'https://30mins.com/users/'}
      description={'Schedule Meetings Effortlessly'}
      ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
      ogType={'website'}
      title={'30mins.com Users'}
    />
    <div className='px-2'>
      <Users />
    </div>
  </PreLoginLayout>
);
export default SearchPage;
