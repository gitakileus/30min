import {PencilIcon, PlusIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';

const Calendars = ({credentials, hasIntegrations}) => {
  const {t} = useTranslation();
  const {googleCredentials, officeCredentials} = credentials;
  return (
    <a href='/user/integrations'>
      <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6'>
        <div className='flex justify-between'>
          <h2 className='text-md font-medium text-gray-500'>{t('profile:connected_calendars')}</h2>
          <div className='flex flex-row items-center'>
            <a href='/user/integrations'>
              <PlusIcon className='w-4 h-4 text-sm font-medium text-gray-500 mr-2' />
            </a>
            <a href='/user/integrations'>
              <PencilIcon className='w-4 h-4 text-sm font-medium text-gray-500' />
            </a>
          </div>
        </div>
        <div className='mt-2 flow-root'>
          {hasIntegrations ? (
            <div className='sm:col-span-2'>
              <dd className='mt-1 text-sm text-gray-900 overflow-hidden break-words'>
                <ul>
                  {googleCredentials &&
                    googleCredentials?.length > 0 &&
                    googleCredentials.map((integration, key) => (
                      <li key={key}>
                        <div className='flex w-full overflow-hidden truncate'>
                          <div className='font-medium text-black flex py-1'>
                            <svg
                              width={19}
                              height={20}
                              viewBox='0 0 19 20'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z'
                                fill='#4285F4'
                              />
                              <path
                                d='M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z'
                                fill='#34A853'
                              />
                              <path
                                d='M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z'
                                fill='#FBBC05'
                              />
                              <path
                                d='M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z'
                                fill='#EB4335'
                              />
                            </svg>
                          </div>
                          <span className='ml-1 py-1 truncate font-medium text-black'>
                            {integration.userEmail}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
                <ul>
                  {officeCredentials &&
                    officeCredentials?.length > 0 &&
                    officeCredentials.map((integration, key) => (
                      <li key={key}>
                        <div className='flex w-full overflow-hidden truncate'>
                          <div className='font-medium text-black flex py-1'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              aria-hidden='true'
                              role='img'
                              width={19}
                              height={20}
                              preserveAspectRatio='xMidYMid meet'
                              viewBox='0 0 32 32'
                            >
                              <path
                                fill='#0072c6'
                                d='M19.484 7.937v5.477l1.916 1.205a.489.489 0 0 0 .21 0l8.238-5.554a1.174 1.174 0 0 0-.959-1.128Z'
                              />
                              <path
                                fill='#0072c6'
                                d='m19.484 15.457l1.747 1.2a.522.522 0 0 0 .543 0c-.3.181 8.073-5.378 8.073-5.378v10.066a1.408 1.408 0 0 1-1.49 1.555h-8.874v-7.443Zm-9.044-2.525a1.609 1.609 0 0 0-1.42.838a4.131 4.131 0 0 0-.526 2.218A4.05 4.05 0 0 0 9.02 18.2a1.6 1.6 0 0 0 2.771.022a4.014 4.014 0 0 0 .515-2.2a4.369 4.369 0 0 0-.5-2.281a1.536 1.536 0 0 0-1.366-.809Z'
                              />
                              <path
                                fill='#0072c6'
                                d='M2.153 5.155v21.427L18.453 30V2Zm10.908 14.336a3.231 3.231 0 0 1-2.7 1.361a3.19 3.19 0 0 1-2.64-1.318A5.459 5.459 0 0 1 6.706 16.1a5.868 5.868 0 0 1 1.036-3.616a3.267 3.267 0 0 1 2.744-1.384a3.116 3.116 0 0 1 2.61 1.321a5.639 5.639 0 0 1 1 3.484a5.763 5.763 0 0 1-1.035 3.586Z'
                              />
                            </svg>
                          </div>
                          <span className='ml-1 py-1 truncate font-medium text-black'>
                            {integration.userEmail}
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
              </dd>
            </div>
          ) : (
            <li className='text-sm'>None</li>
          )}
        </div>
      </div>
    </a>
  );
};
export default Calendars;
