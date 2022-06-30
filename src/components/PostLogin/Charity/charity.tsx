import {useMutation, useQuery} from '@apollo/client';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {MODAL_TYPES} from 'constants/context/modals';
import queries from 'constants/GraphQL/User/queries';
import charityQuery from 'constants/GraphQL/Charity/queries';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Loader from 'components/shared/Loader/Loader';
import trimString from 'utils';
import {PencilAltIcon, TrashIcon} from '@heroicons/react/outline';
import mutations from 'constants/GraphQL/Charity/mutations';
import Link from 'next/link';

const Charity = () => {
  const {data: session} = useSession();
  const router = useRouter();
  const {data, loading} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  const [deleteMutation] = useMutation(mutations.deleteCharity);

  const isAdmin = data?.getUserById?.userData?.accountDetails?.accountType === 'admin';
  const {t} = useTranslation();

  const {showModal} = ModalContextProvider();

  const toggleAddCharity = () => {
    showModal(MODAL_TYPES.CHARITY);
  };

  const toggleEditCharity = itemID => {
    showModal(MODAL_TYPES.CHARITY, {
      charityID: itemID,
    });
  };

  const DeleteCharity = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const {data: charityData, loading: charityLoading} = useQuery(charityQuery.getCharities, {
    variables: {token: session?.accessToken},
  });

  const charities = charityData !== null && charityData?.getCharities?.charityData;

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push('/');
    }
  }, [session, loading]);

  if (charityLoading) {
    return <Loader />;
  }

  if (!isAdmin && !loading) {
    return null;
  }
  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
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
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('common:txt_charity_setting')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            {t('common:txt_charity_setting')}
          </h2>
        </div>
      </div>

      <div className='text-right'>
        <button
          type='button'
          onClick={toggleAddCharity}
          className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:txt_add_charity')}
        </button>
      </div>
      <div className='flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className=''>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {t('common:Charity_Name')}
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      taxID
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Website
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Description
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {charities && charities.length > 0
                    ? charities.map(charity => (
                        <>
                          <tr>
                            <td
                              key={charity}
                              className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'
                            >
                              {charity.name}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {charity.taxID}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {trimString(charity?.website || '', 100)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              {trimString(charity.description, 100)}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                              <button onClick={() => toggleEditCharity(charity._id)}>
                                <PencilAltIcon className='text-mainBlue w-6 h-6 mr-4' />
                              </button>
                              <button onClick={() => DeleteCharity(charity._id)}>
                                <TrashIcon className='text-red-600 w-6 h-6' />
                              </button>
                            </td>
                          </tr>
                        </>
                      ))
                    : 'No charities to show'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Charity;
