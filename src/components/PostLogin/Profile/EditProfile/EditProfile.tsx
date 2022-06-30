import {ChevronRightIcon} from '@heroicons/react/solid';
import Tabs from 'components/PostLogin/Tabs/Tab';
import {SUMMARY_TABS, TABS, TABS_TYPES} from 'constants/context/tabs';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import GeneralEdit from '../Tabs/General';
import SocialLinks from '../Tabs/Socials';
import ChangeEmail from '../Tabs/ChangeEmail';

const EditProfile = ({userData}) => {
  const [currentTab, setTab] = useState(TABS.general);
  const {t} = useTranslation();
  const router = useRouter();
  const {tab} = router.query;

  useEffect(() => {
    if (tab) {
      setTab(tab as string);
    }
  }, [tab]);

  const tabsContent = {
    [tab === TABS_TYPES.editProfile ? TABS.general : TABS.general]: (
      <GeneralEdit userData={userData} />
    ),
    [tab === TABS_TYPES.editProfile ? TABS.social : TABS.social]: (
      <SocialLinks userData={userData} />
    ),
    [tab === TABS_TYPES.editProfile ? TABS.email : TABS.email]: <ChangeEmail />,
  };

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800'>
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
                  <Link href='/user/profile' passHref>
                    <a className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                      {t('common:txt_Profile')}
                    </a>
                  </Link>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            {t('common:txt_edit_profile')}
          </h2>
        </div>
      </div>
      <div className='flex justify-start'>
        <Tabs
          openedTab={currentTab}
          tabsNames={SUMMARY_TABS.editProfile}
          onChange={(tabName: string) => setTab(tabName)}
        />
      </div>
      {tabsContent[currentTab]}
    </>
  );
};
export default EditProfile;
