import Header from 'components/PreLogin/PublicOrgPage/Header';
import AdditionalInfo from 'components/PreLogin/PublicOrgPage/AdditionalInfo';

const Information = ({organizationDetails, orgMethods, orgModals}) => (
  <>
    <AdditionalInfo
      organization={organizationDetails}
      orgMethods={orgMethods}
      modals={orgModals}
      isManagement={true}
    />
    <Header organizationDetails={organizationDetails} isManagement={true} />
  </>
);
export default Information;
