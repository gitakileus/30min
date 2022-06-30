import {ChevronRightIcon, TrashIcon, PencilAltIcon} from '@heroicons/react/outline';
import {MODAL_TYPES} from 'constants/context/modals';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import mutations from 'constants/GraphQL/Organizations/mutations';
import queries from 'constants/GraphQL/Organizations/queries';
import dayjs from 'dayjs';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {NotificationContext} from 'store/Notification/Notification.context';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Table from './Table';

const AllOrganizations = ({session}) => {
  const {t} = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const {showModal} = ModalContextProvider();

  const queryIdRef = useRef(0);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const router = useRouter();

  // search state
  const [searchFilter, setSearchFilter] = useState({keywords: '', newSearch: false});

  const queryOrganizations = useCallback(
    async (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = searchParams;
      delete searchPayload.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);

          const dataResponse = await graphqlRequestHandler(
            queries.getOrganizationsForAdmin,
            {
              orgSearchParams: {
                ...searchParams,
                pageNumber,
                resultsPerPage: pageSize,
              },
              token: session?.accessToken,
            },
            session?.accessToken
          );
          if (dataResponse?.data?.data?.getOrganizationsForAdmin?.response?.status === 404) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            const organzationsCount =
              dataResponse?.data?.data?.getOrganizationsForAdmin?.organizationCount || 0;
            setOrganizations(dataResponse?.data?.data?.getOrganizationsForAdmin?.organizationData);
            setPageCount(Math.ceil(organzationsCount / pageSize));
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [session?.accessToken]
  );

  const handleDelete = async id => {
    await graphqlRequestHandler(
      mutations.adminDeleteOrganization,
      {
        documentId: id,
        token: session?.accessToken,
      },
      session?.accessToken
    );

    showNotification(NOTIFICATION_TYPES.info, 'Organizations Successfully Deleted', false);
    router.reload();
  };

  const deleteOrganizations = column => {
    const organization = column.cell.row.original;
    showModal(MODAL_TYPES.DELETE, {
      name: 'organization',
      id: organization._id,
      handleDelete: handleDelete,
    });
  };

  const FormatedDate = ({value}) => (
    <div className='flex items-center'>{dayjs.unix(value / 1000).toString()}</div>
  );

  const PublicUrl = ({value}) => (
    <a
      href={value ? `/org/${value}` : ''}
      className='text-mainBlue'
      target='_blank'
      rel='noreferrer'
    >
      {value ? `https://30mins.com/org/${value}` : 'no public url'}
    </a>
  );

  const ActionColumn = ({column}: any) => (
    <div className='flex items-center'>
      <Link href={`/user/updateOrganization/${column.cell.row.original._id}`} passHref>
        <div className='mr-2 w-10 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-gray-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <PencilAltIcon />
        </div>
      </Link>
      <button onClick={() => deleteOrganizations(column)}>
        <div className='mr-2 w-10 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-red-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <TrashIcon />
        </div>
      </button>
    </div>
  );

  // organzation table columns
  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({value}: {value: string}) => (
          <div>{value.length > 50 ? `${value.slice(0, 30)} ...` : value}</div>
        ),
      },
      {
        Header: 'Date Created',
        accessor: 'createdDate',
        Cell: FormatedDate,
      },
      {
        Header: 'Public Url',
        accessor: 'slug',
        Cell: PublicUrl,
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: column => <ActionColumn column={column} />,
      },
    ],
    []
  );

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
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                    {t('page:All Organzation')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            {t('page:All Organzation')}
          </h2>
        </div>
      </div>

      <div className='min-h-screen text-gray-9000'>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
          <Table
            setSearchFilter={setSearchFilter}
            columns={columns}
            data={organizations}
            pageCount={pageCount}
            searchFilter={searchFilter}
            query={queryOrganizations}
            isLoading={isLoading}
            noResults={noResults}
          />
        </main>
      </div>
    </>
  );
};

export default AllOrganizations;
