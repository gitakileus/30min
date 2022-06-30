import {useEffect, useState} from 'react';
import {ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import {useQuery} from '@apollo/client';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import {useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/User/queries';
import Loader from 'components/shared/Loader/Loader';
import Link from 'next/link';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const {data: session} = useSession();
  const date = new Date();
  const [month, setMonth] = useState(date.getMonth());
  const [year] = useState(date.getFullYear());
  const [numOfDays, setNumOfDays] = useState<number[]>([]);
  const [namemOfDays, setNamemOfDays] = useState<string[]>([]);
  const [emptyDays, setEmptyDays] = useState<number[]>([]);
  const {t} = useTranslation();

  const {data} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  const {data: providerBooking, loading} = useQuery(bookingQueries.getBookings, {
    variables: {
      token: session?.accessToken,
      searchParams: {
        pageNumber: 1,
        resultsPerPage: 10000,
        isProvider: true,
      },
    },
  });

  const {data: clientBooking, loading: clientLoading} = useQuery(bookingQueries.getBookings, {
    variables: {
      token: session?.accessToken,
      searchParams: {
        pageNumber: 1,
        resultsPerPage: 10000,
        isProvider: false,
      },
    },
  });

  const userID = data?.getUserById?.userData?._id;
  const providerMeetings = providerBooking?.getBookings?.bookingData;
  const clientMeetings = clientBooking?.getBookings?.bookingData;

  const isProvider = providerMeetings?.map(meeting => meeting.provider === userID);
  const isClient = clientMeetings?.map(meeting => meeting.booker === userID);

  const providerBookings =
    /*  providerBooking !== undefined &&  */ providerBooking?.getBookings?.bookingData;
  const clientBookings =
    /*  clientBooking !== undefined && */ clientBooking?.getBookings?.bookingData;

  const isToday = (todayDate: number) => {
    const today = new Date();
    const d = new Date(year, month, todayDate);

    return today.toDateString() === d.toDateString();
  };

  const getNoOfDays = () => {
    let i;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayOfWeek = new Date(year, month).getDay();
    const emptyDaysArray: number[] = [];
    for (i = 1; i <= dayOfWeek; i++) {
      emptyDaysArray.push(i);
    }

    const daysArray: number[] = [];
    for (i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setEmptyDays(emptyDaysArray);
    setNumOfDays(daysArray);
  };

  const getWeekDays = () => {
    const weekDays = numOfDays.map(day => {
      const weekDay = new Date(year, month, day).getDay();
      return days[weekDay];
    });
    setNamemOfDays(weekDays);
    /*   return weekDays; */
  };

  const eventClass = (type: string) => {
    switch (type) {
      case 'blue':
        return 'border-blue-200 text-blue-800 bg-blue-100';
      case 'gray':
        return 'border-gray-200 text-gray-800 bg-gray-100';
      case 'green':
        return 'border-green-200 text-gray-800 bg-green-100';
      default:
        return 'border-blue-200 text-blue-800 bg-blue-100';
    }
  };

  useEffect(() => {
    getNoOfDays();
    getWeekDays();
  }, [month, days]);

  const btnClass = (limit: number) =>
    classNames(
      month === limit ? 'cursor-not-allowed opacity-25' : '',
      'leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center focus:outline-none'
    );

  const nextMonth = () => {
    setMonth(month + 1);
    getNoOfDays();
  };

  const prevMonth = () => {
    setMonth(month - 1);
    getNoOfDays();
  };

  if (loading || clientLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
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
                  <span className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                    {t('meeting:txt_my_meeting')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold h-10 text-mainBlue sm:text-3xl sm:truncate'>
            {t('meeting:txt_my_meeting')}
          </h2>
        </div>
      </div>

      <div className='container mx-auto py-4 px-6'>
        <div className='bg-white rounded-lg shadow'>
          <div className='flex items-center justify-between px-6 '>
            <div>
              <span className='text-lg font-bold text-gray-800'>{monthNames[month]}</span>
              <span className='ml-1 text-lg text-gray-600 font-normal'>{year}</span>
              <div className='mt-2'>
                <div className='flex flex-row'>
                  <div className='w-5 h-5 border-blue-200 bg-blue-200 mr-2' /> Meetings as a
                  provider
                </div>
                <div className='flex flex-row'>
                  <div className='w-5 h-5 border-blue-200 bg-green-200 mr-2' /> Meetings as a
                  customer
                </div>
                <div className='flex flex-row'>
                  <div className='w-5 h-5 border-blue-200 bg-gray-200 mr-2' /> Cancelled meetings
                </div>
              </div>
            </div>
            <div className='border rounded-lg px-1 pt-1'>
              <button
                type='button'
                onClick={() => prevMonth()}
                disabled={month === 0}
                className={btnClass(0)}
              >
                <ArrowLeftIcon className='h-6 w-6 text-gray-500 inline-flex leading-none' />
              </button>
              <div className='border-r inline-flex h-6' />
              <button
                type='button'
                onClick={() => nextMonth()}
                disabled={month === 11}
                className={btnClass(11)}
              >
                <ArrowRightIcon className='h-6 w-6 text-gray-500 inline-flex leading-none' />
              </button>
            </div>
          </div>
          <div className='hidden lg:flex  items-center justify-between px-6 py-4 border-b'>
            {days.map(day => (
              <div key={day} className='px-2 py-2 w-20'>
                <div className='text-gray-600 text-sm uppercase tracking-wide font-bold text-center'>
                  {day}
                </div>
              </div>
            ))}
          </div>
          <div className='-mx-1 -mb-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7'>
              {emptyDays.map(emptyDay => (
                <div key={emptyDay} className='hidden md:flex h-48 p-2 border-b-2 border-r-2' />
              ))}
              {numOfDays.map((nrDate, index) => (
                <div key={index} className='h-48 p-2 border-b-2 border-r-2'>
                  <div className='flex flex-row justify-between items-center'>
                    <div
                      className={classNames(
                        isToday(nrDate)
                          ? 'bg-mainBlue text-white'
                          : 'text-gray-700 hover:bg-blue-200',
                        'inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100'
                      )}
                    >
                      {nrDate}
                    </div>
                    <div className='lg:hidden'>{namemOfDays[index]}</div>
                  </div>

                  {isProvider &&
                    providerBookings &&
                    providerBookings
                      .filter(
                        e =>
                          new Date(e.meetingDate).toDateString() ===
                          new Date(year, month, nrDate).toDateString()
                      )
                      .map(e => (
                        // eslint-disable-next-line react/jsx-key
                        <div className='mt-1 overflow-y-auto'>
                          <a href={`/user/meetingDetails/${e._id}`}>
                            <div
                              key={e.title}
                              className={classNames(
                                e.status.clientCanceled ||
                                  e.status.providerCanceled ||
                                  e.status.providerDeclined
                                  ? eventClass('gray')
                                  : eventClass('blue'),
                                'px-2 py-1 rounded-lg mt-1 overflow-hidden border'
                              )}
                            >
                              <p className='text-sm truncate leading-tight'>{e.title}</p>
                            </div>
                          </a>
                        </div>
                      ))}
                  {isClient &&
                    clientBookings &&
                    clientBookings
                      .filter(
                        e =>
                          dayjs(e.dateBooked).utc().tz(e.bookerTimeZone)?.$d.toDateString() ===
                          new Date(year, month, nrDate).toDateString()
                      )
                      .map(e => (
                        // eslint-disable-next-line react/jsx-key
                        <div className='mt-1 overflow-y-auto'>
                          <a href={`/user/meetingDetails/${e._id}`}>
                            <div
                              key={e.title}
                              className={classNames(
                                e.status.clientCanceled ||
                                  e.status.providerCanceled ||
                                  e.status.providerDeclined
                                  ? eventClass('gray')
                                  : eventClass('green'),
                                'px-2 py-1 rounded-lg mt-1 overflow-hidden border'
                              )}
                            >
                              <p className='text-sm truncate leading-tight'>{e.title}</p>
                            </div>
                          </a>
                        </div>
                      ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
