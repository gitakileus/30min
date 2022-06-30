import {Fragment, useContext, useEffect, useState} from 'react';
import {Disclosure, Menu, Transition} from '@headlessui/react';
import {MenuIcon, XIcon} from '@heroicons/react/outline';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import classNames from 'classnames';
import {useSession, signOut} from 'next-auth/react';
import Button from 'components/shared/Button/Button';
import Link from 'next/link';
import queries from 'constants/GraphQL/User/queries';
import {UserContext} from 'store/UserContext/User.context';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';

const Header = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();
  const [scrollActive, setScrollActive] = useState(false);

  const [userData, setUserData] = useState<any>([]);

  useEffect(() => {
    if (session) {
      const getUserData = async () => {
        const {data} = await graphqlRequestHandler(
          queries.getUserById,
          {token: session?.accessToken},
          session?.accessToken
        );
        setUserData(data);
      };
      getUserData();
    }
  }, [session]);

  const userAvatar = userData?.data?.getUserById?.userData?.accountDetails?.avatar;

  const {
    state: {avatar},
    actions: {setAvatar},
  } = useContext(UserContext);

  useEffect(() => {
    setAvatar(userAvatar);
  }, [userAvatar]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  const PAGES = {
    home: {name: t('page:Home'), pathname: '/'},
    pricing: {name: t('page:Pricing'), pathname: '/pricing/'},
    privacy: {name: t('page:Privacy'), pathname: '/privacy/'},
    tos: {name: t('page:terms_of_service'), pathname: '/tos/'},
    contact: {name: t('common:Contact_Us'), pathname: '/contact-us/'},
  };

  const desktopLink = ({pathname, name}: typeof PAGES['home'], index: number) => (
    <Link href={pathname} key={index}>
      <a
        key={index}
        className={classNames(
          router.asPath === pathname
            ? 'border-mainBlue text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
        )}
      >
        {name}
      </a>
    </Link>
  );

  const mobileLink = ({pathname, name}: typeof PAGES['home'], index: number) => (
    <Link href={pathname} key={index}>
      <a
        key={index}
        className={classNames(
          router.asPath === pathname
            ? 'bg-indigo-50 border-mainBlue text-mainBlue block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
        )}
      >
        {name}
      </a>
    </Link>
  );

  return (
    <Disclosure
      as='nav'
      id='nav'
      className={`fixed top-0 w-full z-30 bg-white transition-all ${
        scrollActive ? ' shadow-md pt-2' : ' pt-4'
      }`}
    >
      {({open}) => (
        <>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
              <div className='flex'>
                <div className='flex-shrink-0 flex items-center'>
                  <Link href='/' passHref>
                    <a>
                      <Image
                        src={'/assets/logo.svg'}
                        width={60}
                        height={60}
                        alt='logo'
                        className='hover:cursor-pointer'
                      />
                    </a>
                  </Link>
                </div>
                <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                  {Object.values(PAGES).map(desktopLink)}
                </div>
              </div>
              {session ? (
                <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                  <Button
                    type='button'
                    text={t('common:myaccount')}
                    href='/user/profile'
                    className='hidden sm:inline-flex mr-3 buttonBase'
                    classNameLink='buttonLinkOutlined text-mainBlue'
                  />
                  <Menu as='div' className='ml-3 relative'>
                    <div>
                      <Menu.Button className='bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'>
                        <span className='sr-only'>Open user menu</span>
                        <div
                          className={`relative flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden`}
                        >
                          <img
                            className='relative rounded-full w-10 h-10 object-cover object-center'
                            src={avatar || '/assets/default-profile.jpg'}
                            alt=''
                          />
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-200'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'
                    >
                      <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <Menu.Item>
                          {({active}) => (
                            <a
                              href='/user/profile'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {t('common:view_profile')}
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <a
                              href='/user/integrations'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {t('Settings')}
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({active}) => (
                            <a
                              href='#'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => signOut()}
                            >
                              {t('common:signout')}
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <div className='mt-3'>
                  <Button
                    type='button'
                    href={`/${router.locale}/auth/login`}
                    text={t('common:LOGIN')}
                    className='hidden sm:inline-flex mr-3 buttonBase'
                    classNameLink='buttonLinkOutlined text-mainBlue'
                  />
                  <Button
                    type='button'
                    href={`/${router.locale}/auth/signup`}
                    text={t('common:SIGN_UP')}
                    className='hidden sm:inline-flex mr-3 buttonBase'
                    classNameLink='buttonLinkFull bg-mainBlue hover:bg-blue-700'
                  />
                </div>
              )}
              <div className='-mr-2 flex items-center sm:hidden'>
                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mainBlue'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className='sm:hidden'>
            <div className='pt-2 pb-3 space-y-1'>{Object.values(PAGES).map(mobileLink)}</div>
            {session ? (
              <div className='pt-4 pb-3 border-t border-gray-200'>
                <div className='flex items-center px-4'>
                  <div className='flex-shrink-0'>
                    <div
                      className={`relative flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden`}
                    >
                      <img
                        className='relative rounded-full w-10 h-10 object-cover object-center'
                        src={avatar || '/assets/default-profile.jpg'}
                        alt=''
                      />
                    </div>
                  </div>
                  <div className='ml-3'>
                    <div className='text-base font-medium text-gray-800'>{session.user?.name}</div>
                    <div className='text-sm font-medium text-gray-500'>{session.user?.email}</div>
                  </div>
                </div>
                <div className='mt-3 space-y-1'>
                  <Disclosure.Button
                    as='a'
                    href='/user/profile'
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  >
                    {t('common:view_profile')}
                  </Disclosure.Button>
                  <Disclosure.Button
                    as='a'
                    href='/user/integrations'
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  >
                    {t('common:Settings')}
                  </Disclosure.Button>
                  <a
                    onClick={() => signOut()}
                    className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer'
                  >
                    {t('common:signout')}
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className='mt-6 px-5'>
                  <Button
                    type='button'
                    href={`/${router.locale}/auth/signup`}
                    text={t('common:SIGN_UP')}
                    className='buttonBase block text-center w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-mainBlue to-cyan-600 text-white font-medium hover:from-indigo-600 hover:to-cyan-700'
                  />
                </div>
                <div className='mt-6 px-5'>
                  <p className='text-center text-base font-medium text-gray-500'>
                    {t('page:already_have_account')}
                    <a
                      className='text-gray-700 hover:underline'
                      href={`/${router.locale}/auth/login`}
                    >
                      &nbsp; {t('common:LOGIN')}
                    </a>
                  </p>
                </div>
              </>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
export default Header;
