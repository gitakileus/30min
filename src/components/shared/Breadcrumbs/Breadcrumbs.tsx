import {ChevronRightIcon} from '@heroicons/react/solid';
import Link from 'next/link';
import {useRouter} from 'next/router';

const Breadcrumbs = () => {
  const router = useRouter();
  const {pathname} = router;

  const route = pathname.split('/');
  route.shift();

  return (
    <nav className='flex' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-4'>
        <li>
          <div className='flex'>
            <Link href='/user/home' passHref>
              <span className='text-sm font-medium text-gray-300 hover:text-white cursor-pointer'>
                Home
              </span>
            </Link>
          </div>
        </li>
        {route.map(page => (
          <li key={page}>
            <div className='flex items-center'>
              <ChevronRightIcon
                className='flex-shrink-0 h-5 w-5 text-gray-500'
                aria-hidden='true'
              />
              <Link href={page} passHref>
                <span className='ml-4 text-sm font-medium text-gray-300 hover:text-white cursor-pointer'>
                  {page}
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
export default Breadcrumbs;
