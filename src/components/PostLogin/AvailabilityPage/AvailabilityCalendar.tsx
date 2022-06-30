import React, {useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import {DAYS} from 'constants/forms/calendar';
import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import timezones from 'constants/forms/timezones.json';

const dayjs = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isBetween = require('dayjs/plugin/isBetween');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const Calendar = ({setFieldValue, values, setRef}) => {
  const {t} = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [loading] = useState(false);
  const [is24h, setIs24h] = useState(false);
  const [selectedBookerTimezone, setSelectedBookerTimezone] = useState<any>(dayjs.tz.guess());
  const [selectedDate, setSelectedDate] = useState<any>(
    dayjs().tz(selectedBookerTimezone).month(selectedMonth)
  );
  useEffect(() => {
    setFieldValue('selectedDate', selectedDate);
  }, [selectedDate]);

  useEffect(() => {}, [values.availableTimeSlots]);
  const NoTimeSlotsAvailable = (
    <div
      className={
        'text-gray-600 font-bold mt-5 mx-auto w-full col-span-2 text-center justify-center items-center'
      }
    >
      {t('common:txt_no_time_slots_available')}
    </div>
  );
  const [availableTimes, setAvailableTimes] = useState<any>(NoTimeSlotsAvailable);

  useEffect(() => {
    if (values.availableTimeSlots) {
      if (values.availableTimeSlots.length > 0) {
        setAvailableTimes(
          <>
            {values?.availableTimeSlots?.map((time: any, index) => (
              <div key={index}>
                <button
                  className={`block px-3 font-medium mb-2 text-mainBlue border border-mainBlue rounded py-2`}
                >
                  {dayjs(`${selectedDate?.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mma')
                    .utc('z')
                    .tz(selectedBookerTimezone)
                    .format(is24h ? 'HH:mm' : 'hh:mma')}
                </button>
              </div>
            ))}
          </>
        );
      } else {
        setAvailableTimes(NoTimeSlotsAvailable);
      }
    }
  }, [values.availableTimeSlots, selectedBookerTimezone, is24h]);

  const TimezonesPicker = timezones.map(timezoneData => (
    <option key={timezoneData.value}>{timezoneData.value}</option>
  ));

  const handleTimezoneChange = ({target: {value}}) => {
    setSelectedBookerTimezone(value);
  };

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

  const handleDaySelect = e => {
    setSelectedDate(
      dayjs().tz(selectedBookerTimezone).month(selectedMonth).date(e.target.dataset.day)
    );
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
    getNoOfDays();
  }, [selectedMonth]);

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
      <div className={`grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-2 w-full `}>
        <div className='max-w-xs min-w-min w-full justify-self-center'>
          <span className={`items-center font-bold justify-center`}>
            {t('common:selected_people_are_available')}
            {' :'}
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
                <div className='text-gray-800 font-medium text-center text-xs w-7 font-skylight'>
                  {day}
                </div>
              </div>
            ))}
            {emptyDays.map(emptyDay => (
              <div key={emptyDay} className='text-center w-7 h-7 rounded-full mx-auto' />
            ))}
            {numOfDays.map((day, index) => (
              <button
                key={index}
                data-day={day}
                onClick={handleDaySelect}
                disabled={
                  selectedMonth < dayjs().format('MM') &&
                  dayjs().month(selectedMonth).format('D') > day
                }
                className={`cursor-pointer text-center text-sm rounded-full leading-loose w-8 hover:bg-mainBlue hover:text-white ${
                  selectedMonth < dayjs().format('MM') &&
                  dayjs().month(selectedMonth).format('D') > day
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
                <span className='text-sm font-medium text-gray-900'>{t('common:txt_am_pm')}</span>
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
          <div className='sm:pl-4 mt-8 sm:mt-0 text-center justify-self-center max-h-96 overflow-y-auto overflow-x-hidden'>
            <div className='text-gray-600 font-light text-xl mb-4 text-center'>
              <span className='w-1/2'>{dayjs(selectedDate).format('dddd DD MMMM YYYY')}</span>
            </div>
            {!loading ? (
              <div
                ref={ref => setRef(ref)}
                className={
                  'grid min-w-fit grid-cols-2 justify-center gap-2 sm:gap-1 items-start justify-items-center w-full place-items-center'
                }
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
    </>
  );
};

export default Calendar;
