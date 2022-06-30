import {ChatIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useRouter} from 'next/router';
import SidebarSubmenu from './SidebarLinkGroup';

const Links = ({AccountType, isCollapse, isMobile, isWelcomeComplete, invitedOrgs}) => {
  const {pathname} = useRouter();
  const finalArray = isWelcomeComplete ? AccountType.slice(1) : AccountType;
  const displayWelcome = AccountType.slice(0, 1);
  const {t} = useTranslation();

  const pending = {
    name: 'Pending Invites',
    href: '/user/pendingOrganizationInvites',
    pending: invitedOrgs?.length,
    icon: ChatIcon,
  };

  if (invitedOrgs?.length > 0) {
    finalArray.splice(4, 0, pending);
  }

  return (
    <>
      {isWelcomeComplete ? (
        <>
          {finalArray.map(item => {
            const {children} = item;
            return (
              <>
                {children && children?.length > 0 ? (
                  <SidebarSubmenu
                    route={item}
                    key={item.name}
                    isCollapse={isCollapse}
                    isMobile={isMobile}
                  />
                ) : (
                  <Link key={item.name} href={item.href} passHref>
                    <span
                      key={item.name}
                      className={classNames(
                        item.href === pathname
                          ? 'bg-[#eef3fb] text-mainBlue'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'flex items-center py-2 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.href === pathname
                            ? 'bg-[#eef3fb] text-mainBlue'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-2 flex flex-shrink-0 items-start justify-center'
                        )}
                        style={{
                          height: '22px',
                          width: '22px',
                        }}
                        aria-hidden='true'
                      />

                      <span className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
                        {isMobile
                          ? t(`page:${item.name}`)
                          : !isCollapse
                          ? t(`page:${item.name}`)
                          : ''}
                      </span>
                      {item?.pending && !isCollapse && (
                        <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mainBlue text-white'>
                          {item?.pending}
                        </span>
                      )}
                    </span>
                  </Link>
                )}
              </>
            );
          })}
        </>
      ) : (
        <>
          {displayWelcome.map(item => (
            <Link key={item.name} href={item.href} passHref>
              <span
                key={item.name}
                className={classNames(
                  item.href === pathname
                    ? 'bg-[#eef3fb] text-mainBlue'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'flex items-center py-2 pr-3 pl-5 text-sm font-medium rounded-lg cursor-pointer text-left'
                )}
              >
                <item.icon
                  className={classNames(
                    item.href === pathname
                      ? 'bg-[#eef3fb] text-mainBlue'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-4 flex flex-shrink-0 items-start justify-center'
                  )}
                  style={{
                    height: '22px',
                    width: '22px',
                  }}
                  aria-hidden='true'
                />

                <span className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
                  {isMobile ? item.name : !isCollapse ? item.name : ''}
                </span>
              </span>
            </Link>
          ))}
        </>
      )}
    </>
  );
};
export default Links;
