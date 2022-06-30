import {
  CurrencyDollarIcon,
  CashIcon,
  BellIcon,
  RefreshIcon,
  CalendarIcon,
  GiftIcon,
} from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';

const ServiceCards = () => {
  const {t} = useTranslation('page');
  const features = [
    {
      name: t('page:Paid_or_Free_Meetings'),
      description: t('page:You_decide_your_rate'),
      icon: CurrencyDollarIcon,
    },
    {
      name: t('page:Get_paid_on_time'),
      description: t('page:Payment_is_transferred_to_you'),
      icon: CashIcon,
    },
    {
      name: t('page:Automate_reminders_and_followup'),
      description: t('page:Your_entire_meeting_workflow'),
      icon: BellIcon,
    },
    {
      name: t('page:Recurring_meetings'),
      description: t('page:Let_users_book_a_one_time_meeting'),
      icon: RefreshIcon,
    },
    {
      name: t('page:Control_your_availability'),
      description: t('page:Open_your_schedule'),
      icon: CalendarIcon,
    },
    {
      name: t('page:Work_your_way'),
      description: t('page:Want_to_donate'),
      icon: GiftIcon,
    },
  ];
  return (
    <div className='relative py-36'>
      <div className='mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl'>
        <h2 className='text-base font-semibold tracking-wider text-mainBlue uppercase'>
          {t('page:What_30mins_offers')}
        </h2>
        <p className='mt-2 text-3xl font-extrabold text-mainText tracking-tight sm:text-4xl'>
          {t('page:We_make_scheduling_and_earning_easy')}
        </p>
        <div className='mt-12'>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 '>
            {features.map(feature => (
              <div key={feature.name} className='pt-6 h-full '>
                <div className='flow-root rounded-lg px-6 pb-8 shadow-md bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full h-full '>
                  <div className='-mt-6'>
                    <div>
                      <span className='inline-flex items-center justify-center p-3 bg-mainBlue rounded-md shadow-lg'>
                        <feature.icon className='h-6 w-6 text-white' aria-hidden='true' />
                      </span>
                    </div>
                    <h3 className='mt-8 text-lg font-medium text-mainText tracking-tight'>
                      {feature.name}
                    </h3>
                    <p className='mt-5 text-base text-gray-500'>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceCards;
