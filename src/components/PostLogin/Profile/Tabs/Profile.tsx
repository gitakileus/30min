import MainCard from './Profile/MainCard';
import Socials from './Profile/Socials';
import Organizations from './Profile/Organizations';
import Calendars from './Profile/Calendars';
import Extensions from './Profile/Extension';

const Profile = ({user, userServices, credentials, extensionsArray}) => {
  const User = user?.data?.getUserById?.userData;
  const {googleCredentials, officeCredentials} = credentials;
  const hasIntegrations =
    (googleCredentials && googleCredentials?.length > 0) ||
    (officeCredentials && officeCredentials?.length > 0);

  return (
    <div className='mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 mb-36'>
      <div className='space-y-6 lg:col-start-1 lg:col-span-2'>
        <MainCard User={User} hasIntegrations={hasIntegrations} userServices={userServices} />
      </div>

      <section
        aria-labelledby='profile-info'
        className='lg:col-start-3 lg:col-span-1 flex flex-col gap-4'
      >
        <Socials User={User} />
        <Organizations User={User} />
        <Extensions extensionsArray={extensionsArray} />
        <Calendars credentials={credentials} hasIntegrations={hasIntegrations} />
      </section>
    </div>
  );
};
export default Profile;
