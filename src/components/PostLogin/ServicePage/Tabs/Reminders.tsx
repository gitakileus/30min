import {useState} from 'react';
import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

const Reminders = ({values, handleChange, setFieldValue}) => {
  const [reminderDesc] = useState(false);
  const {t} = useTranslation();

  return (
    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
      <div className='px-4 py-5 flex-auto'>
        <div className='tab-content tab-space'>
          <div className='block' id='link1'>
            <div className='row ml-1'>
              <span className='text-xs'>{t('event:Service_reminder_desc')}</span>
            </div>
            <div className='mt-1 '>
              <Switch.Group as='div' className='flex items-center justify-between'>
                <span className='flex-grow flex flex-col'>
                  <Switch.Label as='span' className='text-sm font-medium text-gray-900' passive>
                    {`${`${t('event:Reminders')} :`}`}{' '}
                    {values.hasReminder ? t('common:On') : t('common:Off')}
                  </Switch.Label>
                </span>
                <Switch
                  checked={values.hasReminder}
                  onChange={() =>
                    values.hasReminder
                      ? setFieldValue('hasReminder', false)
                      : setFieldValue('hasReminder', true)
                  }
                  className={classNames(
                    values.hasReminder ? 'bg-mainBlue' : 'bg-gray-200',
                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  )}
                >
                  <span
                    aria-hidden='true'
                    className={classNames(
                      values.hasReminder ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </Switch.Group>
            </div>
          </div>
          {values.hasReminder ? (
            <>
              {reminderDesc && (
                <div className='pos-relative mt-2'>
                  <span className='font-12 text-gray-700 w-80 ft-white-break'>
                    {t('event:reminder_desc')}
                  </span>
                </div>
              )}
              <fieldset className='space-y-5'>
                <div className='relative flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      onChange={handleChange}
                      checked={values.b15mins}
                      id='b15mins'
                      name='b15mins'
                      type='checkbox'
                      className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                    />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label htmlFor='comments' className='font-medium text-gray-700'>
                      {t('event:notification')}
                    </label>
                    <p id='comments-description' className='text-gray-500'>
                      {t('event:notification15')}
                    </p>
                  </div>
                  <div className='flex items-center h-5'>
                    <input
                      onChange={handleChange}
                      checked={values.b24hours}
                      id='b24hours'
                      name='b24hours'
                      type='checkbox'
                      className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                    />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label htmlFor='comments' className='font-medium text-gray-700'>
                      {t('event:notification')}
                    </label>
                    <p id='comments-description' className='text-gray-500'>
                      {t('event:notification24')}
                    </p>
                  </div>
                </div>
              </fieldset>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default Reminders;
