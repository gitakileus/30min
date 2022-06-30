import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {Column} from 'react-table';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import {MODAL_TYPES} from 'constants/context/modals';
import extensionQueries from 'constants/GraphQL/ActiveExtension/queries';
import mutations from 'constants/GraphQL/ActiveExtension/mutations';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {NotificationContext} from 'store/Notification/Notification.context';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import HeaderBar from './HeaderBar';
import Table from './Table';
import SearchForm from './SearchForm';

const AllExtentions = ({session}) => {
  const [activeExtension, setActiveExtension] = useState([]);
  const [searchFilter, setSearchFilter] = useState({keywords: '', newSearch: false});
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const router = useRouter();

  const queryIdRef = useRef(0);

  const {showModal} = ModalContextProvider();

  const toggleGiftExtensionModal = () => {
    showModal(MODAL_TYPES.GIFT_EXTENSION, [activeExtension, setSearchFilter]);
  };

  const {t} = useTranslation();

  // query all extenstions
  const queryExtensions = useCallback(
    async (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      const searchPayload = searchParams;
      delete searchPayload.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);

          const dataResponse = await graphqlRequestHandler(
            extensionQueries.getActiveExtensionsForAdmin,
            {
              searchParams: {
                ...searchParams,
                pageNumber,
                resultsPerPage: pageSize,
              },
              token: session?.accessToken,
            },
            session?.accessToken
          );

          if (dataResponse?.data?.data?.getActiveExtensionsForAdmin?.response?.status === 404) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            setIsLoading(false);
            const activeExtensionCount =
              dataResponse?.data?.data?.getActiveExtensionsForAdmin?.extensionsCount || 0;
            setActiveExtension(
              dataResponse?.data?.data?.getActiveExtensionsForAdmin?.activeExtensionData
            );
            setPageCount(Math.ceil(activeExtensionCount / pageSize));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [session?.accessToken]
  );

  const handleRemvoe = async id => {
    await graphqlRequestHandler(
      mutations.adminDeleteActiveExtension,
      {
        documentId: id,
      },
      session?.accessToken
    );
    showNotification(NOTIFICATION_TYPES.info, 'Extensions Successfully Deleted', false);
    router.reload();
  };

  const removeExtention = column => {
    const extenion = column.cell.row.original;
    showModal(MODAL_TYPES.DELETE, {
      name: 'Extentions',
      id: extenion._id,
      handleDelete: handleRemvoe,
    });
  };

  const ActionColumn = ({column}: any) => (
    <button onClick={() => removeExtention(column)} className='text-red-600 hover:text-indigo-900'>
      Remove
    </button>
  );

  const UserName = ({column}: any) => (
    <h6>{column.cell.row.original?.userId?.accountDetails?.username}</h6>
  );

  const FormatedDate = ({value}) => (
    <div className='flex items-center'>{dayjs.unix(value / 1000).toString()}</div>
  );

  const columns = useMemo(
    () =>
      [
        {
          Header: t('common:extensions_title'),
          accessor: 'extensionTitle',
        },
        {
          Header: t('common:username'),
          accessor: 'userid',
          Cell: column => <UserName column={column} />,
        },
        {
          Header: t('common:date_added'),
          accessor: 'createdDate',
          Cell: FormatedDate,
        },
        {
          Header: t('common:status'),
          accessor: 'status',
        },
        {
          Header: t('common:actions'),
          accessor: '_id',
          Cell: column => <ActionColumn column={column} />,
        },
      ] as Column<{Header: string; accessor: string; Cell?: any}>[],
    [t]
  );

  return (
    <>
      <HeaderBar />
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <SearchForm setSearchFilter={setSearchFilter} isLoading={false} />
        </div>
        <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
          <button
            type='button'
            onClick={toggleGiftExtensionModal}
            className='w-full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-indigo-500'
          >
            {t('common:gift_extension')}
          </button>
        </div>
      </div>
      <Table
        data={activeExtension}
        columns={columns}
        isLoading={isLoading}
        noResults={noResults}
        query={queryExtensions}
        pageCount={pageCount}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
    </>
  );
};

export default AllExtentions;
