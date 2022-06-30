import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import {
  BadgeCheckIcon,
  UsersIcon,
  FolderAddIcon,
  ClockIcon,
  CalendarIcon,
  GiftIcon,
} from '@heroicons/react/outline';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/User/mutations';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import LastStepSvg from './Svg/lastStepSvg';

const StepFour = ({User, integrations}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const router = useRouter();
  const [publicUrl, setPublicUrl] = useState('');
  const userIntegrations = integrations?.data?.getCredentialsByToken;
  const {googleCredentials, officeCredentials} = userIntegrations;
  const hasCalendars = googleCredentials || officeCredentials;

  const actions = [
    {
      icon: FolderAddIcon,
      name: t('common:tier_create_service'),
      description: t('common:tier_create_service_desc'),
      href: `/user/services#create`,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-50',
      learnMore: '/user/faq#service',
    },
    {
      icon: ClockIcon,
      name: t('common:tier_working_hours'),
      description: t('common:tier_working_hours_desc'),
      href: `/user/services#workingHours`,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
      learnMore: '/user/faq#workingHours',
    },
    {
      icon: UsersIcon,
      name: t('common:tier_edit_profile'),
      description: t('common:tier_edit_profile_desc'),
      href: `/user/profile`,
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
      learnMore: '/user/faq#editProfile',
    },
    {
      icon: CalendarIcon,
      name: t('common:tier_multiple_calendars'),
      description: t('common:tier_multiple_calendars_desc'),
      href: `/user/integrations`,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-50',
      learnMore: '/user/faq#calendars',
    },
    {
      icon: GiftIcon,
      name: t('common:tier_donate_charity'),
      description: t('common:tier_donate_charity_desc'),
      href: `/user/services`,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
      learnMore: '/user/faq#charity',
    },
    {
      icon: BadgeCheckIcon,
      name: t('common:ties_direct_escrow'),
      description: t('common:ties_direct_escrow_desc'),
      href: `/user/services`,
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
      learnMore: '/user/faq#escrow',
    },
  ];

  const [mutateUpdateWelcome] = useMutation(mutations.updateUserWelcome);

  useEffect(() => {
    setPublicUrl(`${window.origin}/${User?.accountDetails?.username}`);
    const updateWelcome = async () => {
      if (!User.welcomeComplete) {
        await mutateUpdateWelcome({
          variables: {
            userData: {
              welcomeComplete: true,
            },
            token: session?.accessToken,
          },
        });
        router.reload();
      }
    };
    updateWelcome();
  }, []);

  return (
    <>
      <div className='md:grid grid-cols-1 md:grid-cols-2 '>
        <div className='w-full flex justify-center items-center place-content-center place-items-center row-start-1 row-span-1'>
          <LastStepSvg
            className='w-48 h-48 sm:w-72 sm:h-72'
            skeleton='animate-animated animate-fadeInUp animate-fast animate-repeat-1'
          />
        </div>
        <div className='w-full col-start-2 col-end-2 overflow-hidden break-words'>
          <div className='bg-white py-6 px-4 sm:p-6'>
            <div className='py-6 text-left sm:px-6 items-start justify-start'>
              <h1 className='font-bold text-3xl'>{t('profile:welcome_final_title')}</h1>
              <div className='mt-4 text-md'>{t('common:tier_last_step_share_profile')}</div>
              <div className='mt-4 text-md text-mainBlue'>
                <a href={publicUrl} target='_blank' rel='noreferrer'>
                  {publicUrl}
                </a>
              </div>
              {hasCalendars && (
                <>
                  <div className='mt-4 text-md'>{t('common:tier_last_step_share_call')}</div>
                  <div className='mt-4 text-md text-mainBlue'>
                    <a href={`${publicUrl}/call`} target='_blank' rel='noreferrer'>
                      {publicUrl}/call
                    </a>
                  </div>
                </>
              )}{' '}
              <div className='mt-4 text-md'>{t('common:tier_last_step_share_availability')}</div>
              <div className='mt-4 text-md text-mainBlue'>
                <a href={`${publicUrl}/availability`} target='_blank' rel='noreferrer'>
                  {publicUrl}/availability
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className='box col-span-2'>
          <div
            className={`rounded-lg bg-white overflow-hidden shadow divide-x divide-y divide-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-px`}
          >
            <h2 className='sr-only'>{t('profile:welcome_final_title')}</h2>
            {actions.map((action, actionIdx) => (
              <a
                href={action.href}
                key={action.name}
                target='_blank'
                rel='noreferrer'
                className='focus:outline-none'
              >
                <div
                  className={classNames(
                    actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                    actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                    actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                    actionIdx === actions.length - 1
                      ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
                      : '',
                    'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-mainBlue'
                  )}
                >
                  <div>
                    <span
                      className={classNames(
                        action.iconBackground,
                        action.iconForeground,
                        'rounded-lg inline-flex p-3 ring-4 ring-white'
                      )}
                    >
                      <action.icon className='h-6 w-6' aria-hidden='true' />
                    </span>
                  </div>

                  <div className='mt-8'>
                    <h3 className='text-lg font-medium'>
                      <span className='inset-0' aria-hidden='true' />
                      {action.name}
                    </h3>
                    <p className='mt-2 text-sm text-gray-500'>{action.description}</p>
                  </div>
                  <a href={action.learnMore} target='_blank' rel='noreferrer'>
                    <p className='mt-2 text-sm text-mainBlue'>Learn More</p>
                  </a>
                  <span
                    className='pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400'
                    aria-hidden='true'
                  >
                    <svg
                      className='h-6 w-6'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z' />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default StepFour;
