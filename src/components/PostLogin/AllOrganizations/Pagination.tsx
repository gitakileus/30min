import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';

export default function Pagination({
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageSize,
  setPageSize,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
}: any) {
  return (
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
            <span className='font-medium'>{pageCount}</span>
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
  );
}
