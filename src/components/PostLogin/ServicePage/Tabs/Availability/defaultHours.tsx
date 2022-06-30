import useTranslation from 'next-translate/useTranslation';
import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import CustomTime from './CustomTime';

const DefaultHours = ({values, setFieldValue}) => {
  const {t} = useTranslation();

  return (
    <>
      <Switch.Group as='div' className='flex items-center'>
        <div className='grid grid-cols-2 my-4'>
          <Switch.Label as='span' className='mr-3'>
            <span className='text-sm font-medium text-gray-900'>
              {values?.serviceWorkingHours?.isCustomEnabled
                ? t('common:Custom')
                : t('common:Default')}
            </span>
          </Switch.Label>
          <Switch
            checked={values?.serviceWorkingHours?.isCustomEnabled}
            onChange={() =>
              values?.serviceWorkingHours?.isCustomEnabled
                ? setFieldValue('serviceWorkingHours.isCustomEnabled', false)
                : setFieldValue('serviceWorkingHours.isCustomEnabled', true)
            }
            className={classNames(
              values?.serviceWorkingHours?.isCustomEnabled ? 'bg-mainBlue' : 'bg-gray-200',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            )}
          >
            <span
              aria-hidden='true'
              className={classNames(
                values?.serviceWorkingHours?.isCustomEnabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
              )}
            />
          </Switch>
        </div>
      </Switch.Group>

      {!values?.serviceWorkingHours?.isCustomEnabled ? (
        'We are using your default working hours'
      ) : (
        <>
          <CustomTime values={values} setFieldValue={setFieldValue} />
        </>
      )}
    </>
  );
};

export default DefaultHours;
