import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

const Recurring = ({values, handleChange, setFieldValue}) => {
  const {t} = useTranslation();

  const SelectRequiringType = [
    {key: t('event:None'), value: 'None'},
    {key: t('event:Weekly_desc'), value: 'weekly'},
  ];

  const RequringSelect = SelectRequiringType.map(req => <option key={req.key}>{req.value}</option>);

  return (
    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
      <div className='px-4 py-5 flex-auto'>
        <div className='tab-content tab-space'>
          <div className='block' id='link1'>
            <div className='mb-4'>
              <div className='row'>
                <span className='text-xs'>{t('event:Service_reccuring_desc')}</span>
              </div>
              <div className='mt-1 '>
                <Switch.Group as='div' className='flex items-center justify-between'>
                  <span className='flex-grow flex flex-col'>
                    <Switch.Label as='span' className='text-sm font-medium text-gray-900' passive>
                      {`${`${t('event:Allow_Recurring')} :`}`}{' '}
                      {values.isRecurring ? t('On') : t('Off')}
                    </Switch.Label>
                  </span>
                  <Switch
                    checked={values.isRecurring}
                    onChange={() =>
                      values.isRecurring
                        ? setFieldValue('isRecurring', false)
                        : setFieldValue('isRecurring', true)
                    }
                    className={classNames(
                      values.isRecurring ? 'bg-mainBlue' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={classNames(
                        values.isRecurring ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </Switch.Group>
              </div>
            </div>
            {values.isRecurring ? (
              <>
                <div className='flex flex-col items-start max-w-sm'>
                  {t('event:Weekly_desc')}
                  <select
                    value={values.recurringInterval}
                    onChange={handleChange}
                    id='recurringInterval'
                    name='recurringInterval'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                  >
                    {RequringSelect}
                  </select>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Recurring;
