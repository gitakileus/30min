import useTranslation from 'next-translate/useTranslation';

const AdditionalInfo = ({organization, orgMethods, modals, isManagement}) => {
  const {t} = useTranslation();
  return (
    <div className='container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between  '>
      {isManagement ? (
        <div className='flex flex-col md:flex-row w-full overflow-hidden break-words sm:justify-end sm:items-end'>
          <button
            onClick={() => {
              orgMethods.editOrg(organization);
            }}
            className='bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
          >
            {t('common:btn_edit')}
          </button>
          <button
            onClick={() => {
              modals.manageServiceCategories(organization);
            }}
            className='bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
          >
            {t('event:service_category')}
          </button>
          <button
            onClick={() => {
              modals.inviteMembers(organization);
            }}
            className='bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
          >
            {t('event:org_invite_members')}
          </button>
        </div>
      ) : null}
    </div>
  );
};
export default AdditionalInfo;
