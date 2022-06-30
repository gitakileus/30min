/* eslint-disable react/jsx-key */
import {useEffect} from 'react';
import {useTable, usePagination} from 'react-table';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Pagination from './Pagination';
import SearchForm from './SearchForm';

interface Props {
  columns: any;
  data: any[];
  pageCount: any;
  searchFilter: {
    keywords: string;
    newSearch: boolean;
  };
  setSearchFilter: any;
  query: (searchFilter: any, pageIndex: any, pageSize: any) => Promise<void>;
  isLoading: boolean;
  noResults: boolean;
}

// eslint-disable-next-line no-empty-pattern
const Table = ({
  columns,
  data,
  pageCount: controlledPageCount,
  query,
  searchFilter,
  isLoading,
  noResults,
  setSearchFilter,
}: Props) => {
  const {t} = useTranslation();
  const {
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0},
      pageCount: controlledPageCount,
      manualPagination: true,
    },
    usePagination
  );

  useEffect(() => {
    if (searchFilter.newSearch) {
      gotoPage(0);
    }
    query(searchFilter, pageIndex + 1, pageSize);
  }, [pageIndex, pageSize, query, searchFilter]);

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <SearchForm setSearchFilter={setSearchFilter} isLoading={isLoading} />
          </div>
          <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
            <Link href={`/user/createOrganization`} passHref>
              <div className='cursor-pointer bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'>
                {t('common:create_organization')}
              </div>
            </Link>
          </div>
        </div>
        <div className='mt-8 flex flex-col'>
          <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
              <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-300'>
                  <thead className='bg-gray-50'>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th
                            {...column.getHeaderProps()}
                            className='group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                          >
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {isLoading && !noResults ? (
                      <tr>
                        <td colSpan={6} rowSpan={6}>
                          <div className='flex justify-center m-5'>
                            <svg
                              className='custom_loader animate-spin -ml-1 mr-3 h-10 w-10 text-mainBlue'
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
                        </td>
                      </tr>
                    ) : !isLoading && noResults ? (
                      <tr>
                        <td colSpan={6}>
                          <div className='flex justify-center text-2xl font-bold'>
                            No results Found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      page?.map(row => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row?.cells.map(cell => (
                              <td
                                {...cell?.getCellProps()}
                                className='px-6 py-4 whitespace-nowrap'
                                role='cell'
                              >
                                <div className='text-sm text-gray-500'>{cell.render('Cell')}</div>
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
        />
      </div>
    </>
  );
};

export default Table;
