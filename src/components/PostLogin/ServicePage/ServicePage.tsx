import {useEffect, useState} from 'react';
import EmptyService from 'components/shared/Card/States/emptyService';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {ChevronRightIcon, LinkIcon, PencilIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import queries from 'constants/GraphQL/Service/queries';
import {useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import Loader from 'components/shared/Loader/Loader';
import {useRouter} from 'next/router';
import ServiceCard from './ServiceCard';

const Services = integrations => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();
  const [tag, setTag] = useState('');
  const {data, loading} = useQuery(queries.getServicesByUserId, {
    variables: {token: session?.accessToken},
  });
  const HasServices = data?.getServicesByUserId?.response?.status !== 404;
  const servicesData = data?.getServicesByUserId?.serviceData;

  const {showModal} = ModalContextProvider();

  const toggleAddServiceCategory = () => {
    showModal(MODAL_TYPES.EVENT);
  };

  const toggleAddOrgService = () => {
    showModal(MODAL_TYPES.ORG_SERVICE);
  };

  const toggleWorkingHours = () => {
    showModal(MODAL_TYPES.CHANGETIME);
  };

  const handleIntegrationRedirect = () => {
    router.push('/user/integrations');
  };

  useEffect(() => {
    setTag(window.location.href.split('#')[1]);
  }, [tag]);

  useEffect(() => {
    if (tag === 'create') {
      toggleAddServiceCategory();
    }
    if (tag === 'workingHours') {
      toggleWorkingHours();
    }
  }, [tag]);

  const creds = integrations?.integrations?.integrations?.data?.getCredentialsByToken;

  const {googleCredentials, officeCredentials} = creds;
  const hasIntegrations =
    (googleCredentials && googleCredentials?.length > 0) ||
    (officeCredentials && officeCredentials?.length > 0);

  const svg = (
    <svg
      className='mx-auto h-12 w-12 text-gray-400'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      role='img'
      width='1em'
      height='1em'
      preserveAspectRatio='xMidYMid meet'
      viewBox='0 0 16 16'
    >
      <g fill='currentColor'>
        <path d='M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z' />
      </g>
    </svg>
  );
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
                    </a>
                  </Link>
                </div>
              </li>
              <li>
                <div className='flex items-center'>
                  <ChevronRightIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                  <a
                    href='#'
                    className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                  >
                    {t('common:Services')}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            Your {t('common:Services')}
          </h2>
        </div>
        {hasIntegrations && (
          <div className='flex-col sm:flex-row mt-5 flex lg:mt-0 lg:ml-4'>
            <span className='sm:block mt-2 sm:mt-0'>
              <button
                type='button'
                onClick={toggleWorkingHours}
                className='w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <PencilIcon className='-ml-1 mr-2 h-5 w-5 text-gray-300' aria-hidden='true' />
                {t('event:txt_change_schedule_btn')}
              </button>
            </span>
            <span className='sm:block sm:ml-3 mt-2 sm:mt-0'>
              <button
                type='button'
                onClick={toggleAddServiceCategory}
                className='w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-500'
              >
                <LinkIcon className='-ml-1 mr-2 h-5 w-5 text-gray-300' aria-hidden='true' />
                {t('event:txt_add_service')}
              </button>
            </span>
            <span className='sm:block sm:ml-3 mt-2 sm:mt-0'>
              <button
                type='button'
                onClick={toggleAddOrgService}
                className='w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-500'
              >
                <LinkIcon className='-ml-1 mr-2 h-5 w-5 text-gray-300' aria-hidden='true' />
                {t('event:txt_add_org_service')}
              </button>
            </span>
          </div>
        )}
      </div>

      {!HasServices ? (
        <div className='max-w-lg mt-10'>
          <EmptyService
            title={
              hasIntegrations
                ? t('event:txt_not_add_desc2')
                : 'You do not have any Calendar Attached. Please add a Calendar to continue.'
            }
            svg={svg}
            onClick={hasIntegrations ? toggleAddServiceCategory : handleIntegrationRedirect}
          />
        </div>
      ) : (
        <div className=' mt-10 grid grid-cols-1 lg:grid-cols-2 gap-2 w-full'>
          {servicesData &&
            servicesData.map(service => <ServiceCard key={service?.title} service={service} />)}
        </div>
      )}
    </>
  );
};
export default Services;
