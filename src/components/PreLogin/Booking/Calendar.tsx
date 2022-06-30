import React, {useEffect, useMemo, useRef, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import axios from 'axios';
import {DAYS} from 'constants/forms/calendar';
import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import timezones from 'constants/forms/timezones.json';
import getSlots from './getSlots';
import BookingForm from './Form';
import Confirmation from './Confirmation';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const Calendar = ({user, serviceData, isAvailability}) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [loading, setLoading] = useState(false);
  const [is24h, setIs24h] = useState(false);
  const [busy, setBusy] = useState<[]>([]);
  const [selectedTime, setSelectedTime] = useState<any>('');
  const [selectedBookerTimezone, setSelectedBookerTimezone] = useState<any>(dayjs.tz.guess());
  const [selectedDate, setSelectedDate] = useState<any>();

  const myRef = useRef<HTMLInputElement | null>(null);
  const executeScroll = () => myRef.current?.scrollIntoView();

  const [customAvailabilityBlock, setCustomAvailabilityBlock] = useState<any>('');

  const {t} = useTranslation();
  const [confirmBooking, setConfirmBooking] = useState(false);
  const [activeTime, setActiveTime] = useState(false);

  const TimezonesPicker = timezones.map(timezoneData => (
    <option key={timezoneData.value}>{timezoneData.value}</option>
  ));

  const handleTimezoneChange = ({target: {value}}) => {
    setSelectedBookerTimezone(value);
  };

  const lowerBound = useMemo(() => {
    if (!selectedDate) {
      return null;
    }
    return selectedDate.startOf('day');
  }, [selectedDate]);

  const upperBound = useMemo(() => {
    if (!selectedDate) return null;

    return selectedDate.endOf('day');
  }, [selectedDate]);

  const [emptyDays, setEmptyDays] = useState<number[]>([]);
  const [numOfDays, setNumOfDays] = useState<number[]>([]);

  const getNoOfDays = () => {
    let i;
    const daysInMonth = new Date(dayjs().year(), selectedMonth + 1, 0).getDate();

    const dayOfWeek = new Date(dayjs().year(), selectedMonth).getDay();
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

  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const convertSet = weekDays.reduce((acc, day, index) => {
    if (serviceData?.serviceWorkingHours?.isCustomEnabled) {
      if (
        !serviceData?.serviceWorkingHours?.[day].isActive ||
        serviceData?.serviceWorkingHours?.[day].availability?.length === 0
      ) {
        acc.add(index);
      }
    } else if (
      !user.workingHours[day].isActive ||
      (user.workingHours.isCustomEnabled && user.workingHours?.[day]?.availability?.length === 0)
    ) {
      acc.add(index);
    }

    return acc;
  }, new Set());

  const handleDaySelect = e => {
    setSelectedDate(
      dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(e.target.dataset.day)
    );

    const dayChoose = dayjs()
      .tz(selectedBookerTimezone)
      .month(selectedMonth)
      .date(e.target.dataset.day)
      .day();

    if (serviceData?.serviceWorkingHours?.isCustomEnabled) {
      setCustomAvailabilityBlock(
        serviceData?.serviceWorkingHours[weekDays[dayChoose]]?.availability
      );
    } else if (user?.workingHours?.isCustomEnabled) {
      setCustomAvailabilityBlock(user.workingHours[weekDays[dayChoose]]?.availability);
    } else {
      setCustomAvailabilityBlock([
        {
          start: user?.workingHours?.startTime,
          end: user?.workingHours?.endTime,
        },
      ]);
    }
  };

  const isToday = date => {
    const today = new Date();
    const d = new Date(today.getFullYear(), today.getMonth(), date);
    return today.toDateString() === d.toDateString();
  };

  const handle24Change = () => {
    setIs24h(!is24h);
  };

  useEffect(() => {
    setBusy([]);
    const changeDate = async () => {
      if (!selectedDate) {
        return;
      }
      try {
        setLoading(true);
        const date = lowerBound.utc().format().split('').splice(0, 19).join('');
        const date2 = upperBound.utc().format().split('').splice(0, 19).join('');
        const response = await axios.post('/api/integrations/getBusyTimes', {
          username: user.accountDetails.username,
          startTime: date,
          endTime: date2,
        });
        const busyTimes = await response.data;
        const googleBusy = busyTimes?.googleBusyTimes[0]
          ? busyTimes.googleBusyTimes[0].map(item => ({
              start: item.start,
              end: item.end,
            }))
          : [];
        const officeBusy = busyTimes?.officeBusyTimes[0]
          ? busyTimes?.officeBusyTimes[0]?.map(item => ({
              start: item.start,
              end: item.end,
            }))
          : [];

        const customBusy = googleBusy.concat(officeBusy);
        if (Object.values(busyTimes).length > 0) setBusy(customBusy);
        setLoading(false);
      } catch (err) {
        // TODO: @Dan add some error handling here
        console.log('Unknown Error');
      }
    };

    changeDate();
  }, [selectedDate]);

  const times = getSlots({
    calendarTimeZone: user?.locationDetails?.timezone,
    selectedTimeZone: selectedBookerTimezone,
    eventLength: isAvailability ? 30 : serviceData && serviceData?.duration,
    selectedDate: selectedDate,
    availabilityWindows: customAvailabilityBlock,
  });

  useEffect(() => {
    getNoOfDays();
    const currDay = dayjs().tz(selectedBookerTimezone).month(selectedMonth).date();
    const dayNow = dayjs().tz(selectedBookerTimezone).month(selectedMonth).day();

    if (!convertSet.has(dayNow)) {
      handleDaySelect({target: {dataset: {day: currDay}}});
    }
  }, [selectedMonth]);

  for (let i = times.length - 1; i >= 0; i -= 1) {
    busy.forEach((busyTime: any) => {
      const startTime = dayjs(busyTime?.start);
      const endTime = dayjs(busyTime?.end);
      const timeSlot = dayjs(times[i]);
      const startMinute = dayjs(busyTime?.start).get('m');
      const duration = isAvailability ? 30 : serviceData && serviceData?.duration;
      const startMinusDuration = startTime.set('m', startMinute - duration);

      if (timeSlot.isBetween(startMinusDuration, endTime)) {
        times.splice(i, 1);
      }
    });
  }

  const handleTime = time => {
    setSelectedTime(time);
  };

  const availableTimes =
    times.length === 0 ? (
      <div className={'text-gray-600 font-light mt-5 text-center justify-center items-center'}>
        {t('common:book_not_available')}
      </div>
    ) : (
      <>
        {times.map((time: any) => (
          <div key={dayjs(time).utc().format()}>
            <button
              onClick={() => {
                handleTime(time.$d);
                executeScroll();
                setActiveTime(dayjs(time.$d).format(is24h ? 'HH:mm' : 'hh:mma'));
              }}
              key={dayjs(time).format('hh:mma')}
              className={`block px-3 font-medium mb-2 text-mainBlue border border-mainBlue rounded  ${
                !isAvailability && activeTime === dayjs(time).format(is24h ? 'HH:mm' : 'hh:mma')
                  ? 'bg-mainBlue text-white hover:bg-mainBlue hover:text-white'
                  : ''
              } py-2  ${isAvailability ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {dayjs(time)
                .tz(selectedBookerTimezone)
                .format(is24h ? 'HH:mm' : 'hh:mma')}
            </button>
          </div>
        ))}
      </>
    );

  const incrementMonth = () => {
    setSelectedMonth(selectedMonth + 1);
    getNoOfDays();
    const currDay = dayjs().tz(selectedBookerTimezone).month(selectedMonth).date();

    handleDaySelect({target: {dataset: {day: currDay}}});
  };

  const decrementMonth = () => {
    setSelectedMonth(selectedMonth - 1);
    getNoOfDays();
  };

  return (
    <>
      {!confirmBooking ? (
        <>
          <div
            className={`flex flex-wrap px-3  ${
              selectedTime && !isAvailability ? 'border-b-2' : ''
            } `}
          >
            <div className='max-w-xs'>
              <span
                className={`items-center ${
                  isAvailability ? 'text-mainBlue text-3xl' : 'text-gray-600'
                } font-bold justify-center`}
              >
                {isAvailability ? t('meeting:my_availability') : t('meeting:select_date')}
              </span>
              <br /> <br />
              <div className='flex text-gray-600 font-bold text-xl mb-4'>
                <span className='w-1/2'>{dayjs().month(selectedMonth).format('MMMM YYYY')}</span>
                <div className='w-1/2 text-right'>
                  <button
                    onClick={decrementMonth}
                    className={`mr-4 ${selectedMonth < dayjs().format('MM') && 'text-gray-400'}`}
                    disabled={selectedMonth < dayjs().format('MM')}
                  >
                    <ChevronLeftIcon className='w-5 h-5' />
                  </button>
                  <button onClick={incrementMonth}>
                    <ChevronRightIcon className='w-5 h-5' />
                  </button>
                </div>
              </div>
              <div className='grid  grid-cols-7 gap-y-4 gap-x-4 sm:gap-x-1 text-center '>
                {DAYS.map((day, index) => (
                  <div className='px-1' key={index}>
                    <div
                      key={index}
                      className='text-gray-800 font-medium text-center text-xs w-7 font-skylight'
                    >
                      {day}
                    </div>
                  </div>
                ))}
                {emptyDays.map(emptyDay => (
                  <div key={emptyDay} className='text-center w-7 h-7 rounded-full mx-auto' />
                ))}
                {numOfDays.map(day => (
                  <button
                    key={day}
                    data-day={day}
                    onClick={handleDaySelect}
                    disabled={
                      (selectedMonth < dayjs().format('MM') &&
                        dayjs().month(selectedMonth).format('D') > day) ||
                      convertSet.has(
                        dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(day).day()
                      )
                    }
                    className={`cursor-pointer text-center text-sm rounded-full leading-loose w-8 hover:bg-mainBlue hover:text-white ${
                      (selectedMonth < dayjs().format('MM') &&
                        dayjs().month(selectedMonth).format('D') > day) ||
                      convertSet.has(
                        dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(day).day()
                      )
                        ? ' text-gray-400 bg-none font-light '
                        : 'border-2 border-mainBlue'
                    }${
                      dayjs().isSameOrBefore(dayjs().date(day).month(selectedMonth))
                        ? ' font-medium '
                        : ' '
                    }${selectedDate?.$D === day ? ' bg-mainBlue text-white ' : ''}
          ${isToday(day) && selectedDate === '' ? ' bg-mainBlue text-white ' : ''}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className='mt-4 text-sm font-light'>
                Note: The selected times are displayed in {selectedBookerTimezone} timezone.
              </div>
              <div className='col-span-4 sm:col-span-2'>
                <select
                  value={selectedBookerTimezone}
                  onChange={handleTimezoneChange}
                  id='selectedBookerTimezone'
                  name='selectedBookerTimezone'
                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                >
                  {TimezonesPicker}
                </select>
              </div>
              <Switch.Group as='div' className='flex items-center'>
                <div className='grid grid-cols-2 my-4'>
                  <Switch.Label as='span' className='mr-3'>
                    <span className='text-sm font-medium text-gray-900'>
                      {t('common:txt_am_pm')}
                    </span>
                  </Switch.Label>
                  <Switch
                    checked={is24h}
                    onChange={handle24Change}
                    className={classNames(
                      is24h ? 'bg-mainBlue' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={classNames(
                        is24h ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>
              </Switch.Group>
            </div>
            {selectedDate && (
              <div className='sm:pl-4 mt-8 sm:mt-0 text-center w-full md:w-2/5 max-h-80 overflow-y-auto'>
                <div className='text-gray-600 font-light text-xl mb-4 text-center'>
                  <span className='w-1/2'>{dayjs(selectedDate).format('dddd DD MMMM YYYY')}</span>
                </div>
                {!loading ? (
                  <div
                    className={`${
                      times.length === 0
                        ? ''
                        : 'grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 justify-start w-full place-items-center'
                    }`}
                  >
                    {availableTimes}
                  </div>
                ) : (
                  <div className='flex loader justify-center items-center align-middle self-center'>
                    <svg
                      className='custom_loader -ml-1 mr-3 h-10 w-10 text-mainBlue'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            {!isAvailability && selectedTime && (
              <div className='w-full' ref={myRef}>
                <BookingForm
                  selectedBookerTimezone={selectedBookerTimezone}
                  user={user}
                  serviceData={serviceData}
                  selectedDate={selectedDate}
                  setConfirmBooking={setConfirmBooking}
                  selectedTime={selectedTime}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <Confirmation
          user={user}
          serviceData={serviceData}
          selectedDate={selectedTime}
          paymentInvoice={''}
        />
      )}
    </>
  );
};

export default Calendar;
