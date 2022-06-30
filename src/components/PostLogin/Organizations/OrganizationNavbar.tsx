import useTranslation from 'next-translate/useTranslation';

const OrganizationNavbar = ({orgs, modals, invitedOrgs}) => {
  const {t} = useTranslation();
  if (orgs !== null && orgs.length > 0) {
    return (
      <div className='flex-1 flex justify-end flex-wrap gap-2 rounded-md py-3 px-4'>
        {invitedOrgs && invitedOrgs?.length > 0 && (
          <a href='/user/pendingOrganizationInvites'>
            <button className='w-full sm:max-w-max bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'>
              {t('page:pending_org_invites')}
            </button>
          </a>
        )}
        <button
          onClick={() => {
            modals.showJoinModal();
          }}
          className='w-full sm:max-w-max bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
        >
          {t('page:Join Organization')}
        </button>

        <button
          onClick={() => {
            modals.showCreateModal();
          }}
          className='w-full sm:max-w-max bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
        >
          {t('page:Create Organization')}
        </button>
      </div>
    );
  }
  return (
    <div className={'flex items-center flex-col gap-4 w-full'}>
      <span className={'text-lg text-center w-full'}>{t('page:member_no_org')}</span>
      <div className={'flex gap-4 w-full justify-center flex-wrap'}>
        {invitedOrgs && invitedOrgs?.length > 0 && (
          <a href='/user/pendingOrganizationInvites'>
            <button className='w-full sm:max-w-max bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'>
              {t('page:pending_org_invites')}
            </button>
          </a>
        )}
        <button
          onClick={() => {
            modals.showJoinModal();
          }}
          className='w-full sm:max-w-max bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
        >
          {t('page:Join an Organization')}
        </button>
        <button
          onClick={() => {
            modals.showCreateModal();
          }}
          className='w-full sm:max-w-max bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
        >
          {t('page:Create an Organization')}
        </button>
      </div>
    </div>
  );
};

export default OrganizationNavbar;
