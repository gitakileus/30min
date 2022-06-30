import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

const Visibility = ({values, setFieldValue}) => {
  const {t} = useTranslation();
  return (
    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
      <div className='px-4 py-5 flex-auto'>
        <div className='tab-content tab-space'>
          <div className='block' id='link1'>
            <div className='mb-4'>
              <div className='mt-1 '>
                <Switch.Group as='div' className='flex items-center justify-between'>
                  <span className='flex-grow flex flex-col'>
                    <Switch.Label as='span' className='text-sm font-medium text-gray-900' passive>
                      {`${`${t('event:Visibility')} :`}`}{' '}
                      {values.isPrivate ? t('event:Private') : t('event:Public')}
                    </Switch.Label>
                  </span>
                  <Switch
                    checked={values.isPrivate}
                    onChange={() =>
                      values.isPrivate
                        ? setFieldValue('isPrivate', false)
                        : setFieldValue('isPrivate', true)
                    }
                    className={classNames(
                      values.isPrivate ? 'bg-mainBlue' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={classNames(
                        values.isPrivate ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </Switch.Group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Visibility;
