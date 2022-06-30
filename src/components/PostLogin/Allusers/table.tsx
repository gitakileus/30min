/* eslint-disable react/jsx-key */
import React, {useEffect} from 'react';
import {useTable, usePagination, useGlobalFilter, useRowSelect} from 'react-table';
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/solid';
import IndeterminateCheckbox from './IndeterminateCheckbox';

type IProps = {
  columns: any;
  data: any;
  pageCount: any;
  query: any;
  searchFilter: any;
  isLoading: any;
  setUserSelectedIds?: any;
};

const Table = (props: IProps) => {
  const {
    columns,
    data,
    pageCount: controlledPageCount,
    query,
    searchFilter,
    isLoading,
    setUserSelectedIds,
  } = props;

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
    state: {pageIndex, pageSize, selectedRowIds},
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0},
      pageCount: controlledPageCount,
      manualPagination: true,
    },
    useGlobalFilter,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(cols => [
        {
          id: 'selection',
          Header: ({getToggleAllRowsSelectedProps}) => (
            <div>
              <IndeterminateCheckbox name={''} {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({row}) => (
            <div>
              <IndeterminateCheckbox name={''} {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...cols,
      ]);
    }
  );

  useEffect(() => {
    if (searchFilter.newSearch) {
      gotoPage(0);
    }
    query(searchFilter, pageIndex + 1, pageSize);
  }, [pageIndex, pageSize, query, searchFilter]);

  useEffect(() => {
    if (selectedRowIds) {
      let UserSelectedIds: any = [];
      if (Object.keys(selectedRowIds).length > 0) {
        for (let n = 0; n < Object.keys(page).length; n++) {
          if (page[n].isSelected) {
            UserSelectedIds.push(page[n].values._id);
          }
        }
        setUserSelectedIds({UserIds: UserSelectedIds, isSelected: true});
      } else {
        UserSelectedIds = [];
        setUserSelectedIds({UserIds: UserSelectedIds, isSelected: false});
      }
    }
  }, [selectedRowIds]);

  return (
    <>
      <div className='flex flex-col'>
        <div className='-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          scope='col'
                          key={index}
                          className='group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          <div className='flex items-center justify-between'>
                            {column.render('Header')}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6}>
                        <div className='flex justify-center text-2xl font-bold'>Loading...</div>
                      </td>
                    </tr>
                  ) : (
                    page.map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td
                              {...cell.getCellProps()}
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
      <div className='py-3 flex items-center justify-between'>
        <div className='flex-1 flex justify-between sm:hidden'>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
        <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
          <div className='flex gap-x-2 items-baseline'>
            <span className='text-sm text-gray-700'>
              Page <span className='font-medium'>{pageIndex + 1}</span> of{' '}
              <span className='font-medium'>{controlledPageCount}</span>
            </span>
            <label>
              <span className='sr-only'>Items Per Page</span>
              <select
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
              aria-label='Pagination'
            >
              <button
                className='rounded-l-md'
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className='sr-only'>First</span>
                <ChevronDoubleLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                <span className='sr-only'>Previous</span>
                <ChevronLeftIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                <span className='sr-only'>Next</span>
                <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
              <button
                className='rounded-r-md'
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className='sr-only'>Last</span>
                <ChevronDoubleRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
