import {ChevronRightIcon} from '@heroicons/react/outline';
import queries from 'constants/GraphQL/User/queries';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React, {useCallback, useRef, useState, useContext} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {useRouter} from 'next/router';
import axios from 'axios';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import Table from './table';
import SearchForm from './SearchForm';

const Allusers = ({session}) => {
  const {t} = useTranslation();

  const [users, setUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const queryIdRef = useRef(0);

  const [searchFilter, setSearchFilter] = useState({
    keywords: '',
    newSearch: false,
  });

  const [userSelectedIds, setUserSelectedIds] = useState({
    UserIds: [],
    isSelected: false,
  });
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const [deleteUser] = useMutation(mutations.adminDeleteUser);
  const [AdminDeleteUsers] = useMutation(mutations.adminDeleteUsers);
  const {showModal, hideModal} = ModalContextProvider();
  const router = useRouter();

  const handleMutationAdminDeleteUsers = async () => {
    const {data} = await AdminDeleteUsers({
      variables: {
        userIDs: userSelectedIds.UserIds,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
          'Content-Type': 'application/json',
        },
      },
    });
    showNotification(NOTIFICATION_TYPES.success, data?.adminDeleteUsers?.response?.message, false);
    router.reload();
    hideModal();
  };

  const handleAdminDeleteUsers = async () => {
    try {
      showModal(MODAL_TYPES.DELETE, {
        isAdminDeleteUsers: true,
        handleDelete: handleMutationAdminDeleteUsers,
      });
    } catch (err) {
      showNotification(NOTIFICATION_TYPES.error, 'Error', false);
    }
  };

  const queryUsers = useCallback(
    async (userSearchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = userSearchParams;
      delete searchPayload.newSearch;

      if (queryId === queryIdRef.current) {
        setIsLoading(true);
        graphqlRequestHandler(
          queries.getUsersForAdmin,
          {
            userSearchParams: {
              ...userSearchParams,
              pageNumber,
              resultsPerPage: pageSize,
            },
            token: session?.accessToken,
          },
          process.env.BACKEND_API_KEY
        )
          .then(response => {
            const usersCount = response?.data?.data?.getUsersForAdmin?.userCount || 0;
            setUsers(response?.data?.data?.getUsersForAdmin?.userData);
            setPageCount(Math.ceil(usersCount / pageSize));
            setIsLoading(false);
          })
          .catch(e => console.log(e));
      }
    },
    [session?.accessToken]
  );

  const handleuserDelete = async row => {
    try {
      await axios.post('/api/stripe/deleteCustomerByAdmin', {
        customerDocumentId: row?.original._id,
      });

      await deleteUser({
        variables: {
          token: session?.accessToken,
          documentId: row?.original._id,
        },
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const deleteUserMutation = row => {
    showModal(MODAL_TYPES.DELETE, {
      isDeleteAccount: true,
      name: row.original?.personalDetails?.name,
      handleDelete: () => {
        handleuserDelete(row);
      },
    });
  };

  const ActionColumn = ({row, value}) => (
    <div className='flex items-center'>
      <Link href={`/user/allusers/${value}`} passHref>
        <div className='mr-2 w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border  bg-gray-100 hover:text-mainBlue cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon cursor-pointer icon-tabler icon-tabler-edit'
            width={20}
            height={20}
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <path d='M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3' />
            <path d='M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3' />
            <line x1={16} y1={5} x2={19} y2={8} />
          </svg>
        </div>
      </Link>
      {row.isSelected && (
        <a
          className='w-12 justify-center flex items-center text-gray-600 p-2 border-transparent border bg-gray-100
                          hover:text-red-600 cursor-pointer rounded focus:outline-none focus:border-gray-800 focus:shadow-outline-gray'
          onClick={() => deleteUserMutation(row)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon cursor-pointer icon-tabler icon-tabler-trash'
            width={20}
            height={20}
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <line x1={4} y1={7} x2={20} y2={7} />
            <line x1={10} y1={11} x2={10} y2={17} />
            <line x1={14} y1={11} x2={14} y2={17} />
            <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
            <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
          </svg>
        </a>
      )}
    </div>
  );

  const PublicView = ({row}) => (
    <>
      <div className='flex items-center'>
        <Link href={`https://30mins.com/${row.original.accountDetails.username}`} passHref>
          Public View
        </Link>
      </div>
    </>
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'accountDetails.username',
      },
      {
        Header: 'Email',
        accessor: 'accountDetails.email',
      },
      {
        Header: 'Timezone',
        accessor: 'locationDetails.timezone',
      },
      {
        Header: 'Public View',
        Cell: PublicView,
      },
      {
        Header: 'Actions',
        accessor: '_id',
        Cell: ActionColumn,
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
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('common:txt_all_users')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            {t('common:txt_all_users')}
          </h2>
        </div>
      </div>
      <div className='min-h-screen text-gray-900'>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
          <SearchForm
            setSearchFilter={setSearchFilter}
            isLoading={isLoading}
            userSelectedIds={userSelectedIds.isSelected}
            handleAdminDeleteUsers={handleAdminDeleteUsers}
          />
          <div className='mt-6'>
            <Table
              columns={columns}
              data={users}
              pageCount={pageCount}
              searchFilter={searchFilter}
              query={queryUsers}
              isLoading={isLoading}
              setUserSelectedIds={setUserSelectedIds}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Allusers;
