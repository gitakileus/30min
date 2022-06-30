/* eslint-disable no-unsafe-optional-chaining */
import axios from 'axios';
import UserCard from 'components/PreLogin/Search/userCard';
import PaginationBar from 'components/shared/Pagination/Pagination';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import Recaptcha from 'react-google-recaptcha';
import OrganizationCard from '../OrganizationCard';
import ServiceCard from '../serviceCard';
import HomeSearchForm from '../SearchForm';

const Users = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [formValues, setFormValues] = useState({keywords: '', location: ''});
  const [currentPage, setCurrentPage] = useState(1);
  const defaultItemsPerPage = 12;
  const recaptchaRef = useRef<Recaptcha>();

  const [userSearchResults, setUserSearchResults] = useState([]);
  const [totalMembersCount, setTotalMemberCount] = useState(0);
  const [orgSearchResults, setOrgSearchResults] = useState([]);
  const [totalOrgCount, setTotalOrgCount] = useState(0);

  const [serviceSearchResults, setServiceSearchResults] = useState([]);

  const handleUserSearch = async (values, pageNumber = 1, itemsPerPage = defaultItemsPerPage) => {
    try {
      const captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      setSubmittingSearch(true);
      setFormValues(values);
      const response = await axios.post('/api/searchPage/search', {
        keywords: values.keywords || router?.query.keywords,
        location: values.location || router?.query.location,
        isIndividual: null,
        pageNumber: pageNumber,
        resultsPerPage: itemsPerPage,
        isProvider: true,
        captchaToken,
      });
      const data = await response.data;
      setUserSearchResults(data?.queryData?.data?.getUserAndOrganizationSearchResults?.userData);
      setTotalMemberCount(data?.queryData?.data?.getUserAndOrganizationSearchResults?.userCount);
      setOrgSearchResults(
        data?.queryData?.data?.getUserAndOrganizationSearchResults?.organizationData
      );
      setTotalOrgCount(
        data?.queryData?.data?.getUserAndOrganizationSearchResults?.organizationCount
      );

      setServiceSearchResults(
        data?.queryData?.data?.getUserAndOrganizationSearchResults?.serviceData
      );

      setCurrentPage(pageNumber);
      setSubmittingSearch(false);
    } catch (err) {
      setSubmittingSearch(false);
      console.log('Unknown Error');
    }
  };

  const handleSubmit = values => {
    if (!formValues.keywords && !formValues.location) {
      router.replace({query: {}});
    }
    setFormValues(values);
    handleUserSearch(values);
  };
  useEffect(() => {
    setSubmittingSearch(true);
    handleUserSearch({keywords: formValues.keywords});
  }, []);

  return (
    <>
      <div className='sm:px-10'>
        <HomeSearchForm onSubmit={handleSubmit} recaptchaRef={recaptchaRef} />
      </div>
      {!submittingSearch ? (
        <>
          <div className='mt-5 md:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-0 sm:px-10 '>
            {userSearchResults?.length > 0 &&
              userSearchResults.map((member, index) => <UserCard key={index} member={member} />)}
            {orgSearchResults?.length > 0 &&
              orgSearchResults.map((org, index) => <OrganizationCard key={index} orgData={org} />)}
            {serviceSearchResults?.length > 0 &&
              serviceSearchResults.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
          </div>
          {totalMembersCount > defaultItemsPerPage ||
          totalMembersCount > 0 ||
          totalOrgCount > defaultItemsPerPage ||
          totalOrgCount > 0 ||
          serviceSearchResults?.length > 0 ? (
            <div className='box col-start-1 col-span-4 sm:col-start-4 sm:col-span-2'>
              <PaginationBar
                currentPage={currentPage}
                itemCount={
                  userSearchResults?.length +
                  orgSearchResults?.length +
                  serviceSearchResults?.length
                }
                searchHandler={(itemsPerPage, itemsToSkip) => {
                  handleUserSearch(formValues, itemsPerPage, itemsToSkip);
                }}
                itemsPerPage={defaultItemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          ) : (
            <div className='mt-5 md:mt-0 md:col-span-2 grid grid-cols-1 sm:grid-cols-1  gap-2 px-0 sm:px-10 '>
              <div className='flex justify-center mt-10'>
                <div className='m-auto'>
                  <div className='flex flex-1 justify-center text-center items-center align-middle text-xl font-bold'>
                    {t('common:no_result_found')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='mt-5 flex loader justify-center items-center align-middle self-center'>
          <svg
            className='custom_loader -ml-1 mr-3 h-10 w-10 text-mainBlue'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      )}
    </>
  );
};
export default Users;
