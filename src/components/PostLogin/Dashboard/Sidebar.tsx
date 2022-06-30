import {Fragment, useEffect, useContext, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XIcon, ArrowCircleRightIcon} from '@heroicons/react/outline';

import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import Image from 'next/image';
import {admin, users} from 'routes/dashboard';
import {CollapseDrawerContext} from 'store/Sidebar/Sidebar.context';
import Link from 'next/link';
import {useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/User/queries';
import orgQuery from 'constants/GraphQL/Organizations/queries';
import ChangeLanguage from 'components/shared/LanguageSwitcher/LanguageSwitcherSidebar';
import useTranslation from 'next-translate/useTranslation';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import CollapseButton from './CollapseButton';
import Links from './Links';

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
};
const Sidebar = ({isOpenSidebar, onCloseSidebar}: Props) => {
  const {t} = useTranslation();
  const {pathname} = useRouter();
  const {data: session} = useSession();
  const {data} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  const {data: invitedUsers} = useQuery(orgQuery.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;
  const isWelcomeComplete = data?.getUserById?.userData?.welcomeComplete;

  const User = data?.getUserById?.userData?.accountDetails;

  const isUser = User?.accountType !== 'admin';
  const isAdmin = User?.accountType === 'admin';

  const Routes = isUser ? users : isAdmin ? admin : users;

  const [width, setWidth] = useState<number>(0);
  const {isCollapse, collapseClick, onToggleCollapse, onHoverEnter, onHoverLeave} =
    useContext(CollapseDrawerContext);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    setWidth(window.innerWidth);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const {showModal} = ModalContextProvider();
  const isMobile = width <= 768;

  const handleSignOut = () => {
    showModal(MODAL_TYPES.SIGN_OUT);
  };

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Transition.Root show={isOpenSidebar} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 flex z-40 lg:hidden' onClose={onCloseSidebar}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <div className='relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='absolute top-0 right-0 -mr-12 pt-2'>
                  <button
                    type='button'
                    className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                    onClick={() => onCloseSidebar()}
                  >
                    <span className='sr-only'>Close sidebar</span>
                    <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
                  </button>
                </div>
              </Transition.Child>
              <div className='flex-shrink-0 flex items-center px-4'>
                <Link href='/' passHref>
                  <Image
                    className='h-16 w-auto items-center cursor-pointer'
                    src='/assets/logo.svg'
                    alt='logo'
                    height={40}
                    width={40}
                  />
                </Link>
              </div>

              <div className='mt-5 flex-1 h-0 overflow-y-auto'>
                <nav className='px-2 space-y-1'>
                  <Links
                    isWelcomeComplete={isWelcomeComplete}
                    AccountType={Routes}
                    invitedOrgs={invitedOrgs}
                    isCollapse={isCollapse}
                    isMobile={isMobile}
                  />
                  <ChangeLanguage />
                  <span
                    className={
                      'text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center py-2 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left'
                    }
                  >
                    <ArrowCircleRightIcon
                      className={
                        'text-gray-400 group-hover:text-gray-500 mr-4 flex flex-shrink-0 items-start justify-center'
                      }
                      style={{
                        height: '22px',
                        width: '22px',
                      }}
                      aria-hidden='true'
                    />

                    <span
                      className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'
                      onClick={handleSignOut}
                    >
                      {isMobile ? t(`profile:sign_out`) : !isCollapse ? t(`profile:sign_out`) : ''}{' '}
                      {!isCollapse && (
                        <p className='text-xs text-gray-600 truncate'>{User?.email}</p>
                      )}
                    </span>
                  </span>
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className='flex-shrink-0 w-14' aria-hidden='true'></div>
        </Dialog>
      </Transition.Root>

      <div
        className={`hidden lg:flex md:flex-col md:fixed md:inset-y-0 transition-width duration-300 easy z-50 ${
          isCollapse ? 'lg:w-24' : 'lg:w-64'
        }`}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
      >
        <div className='flex flex-col flex-grow border-r border-dashed border-gray-200 bg-white overflow-y-auto bg-opacity-80'>
          <div
            className='flex flex-col flex-shrink-0'
            style={{
              padding: '24px 20px 16px',
            }}
          >
            <div className={`grid overflow-hidden grid-cols-2 grid-rows-1 gap-2`}>
              <div className={`item w-20`}>
                <Link href='/' passHref>
                  <Image
                    className='h-16 w-auto items-center cursor-pointer'
                    src='/assets/logo.svg'
                    alt='logo'
                    height={50}
                    width={50}
                  />
                </Link>
              </div>
              {!isMobile && !isCollapse && (
                <div className='item justify-self-end'>
                  <CollapseButton
                    onToggleCollapse={onToggleCollapse}
                    collapseClick={collapseClick}
                  />
                </div>
              )}
            </div>
          </div>

          <div className='mt-2 flex-grow flex flex-col'>
            <nav className='flex-1 px-4 pb-4 space-y-1'>
              <Links
                isWelcomeComplete={isWelcomeComplete}
                invitedOrgs={invitedOrgs}
                AccountType={Routes}
                isCollapse={isCollapse}
                isMobile={isMobile}
              />
              <ChangeLanguage />
              <span
                className={
                  'text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center py-2 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left'
                }
              >
                <ArrowCircleRightIcon
                  className={
                    'text-gray-400 group-hover:text-gray-500 mr-4 flex flex-shrink-0 items-start justify-center'
                  }
                  style={{
                    height: '22px',
                    width: '22px',
                  }}
                  aria-hidden='true'
                />
                <span
                  className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'
                  onClick={handleSignOut}
                >
                  {isMobile ? t(`profile:sign_out`) : !isCollapse ? t(`profile:sign_out`) : ''}{' '}
                  {!isCollapse && <p className='text-xs text-gray-600 truncate'>{User?.email}</p>}
                </span>
              </span>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
