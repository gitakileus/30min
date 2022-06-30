import useTranslation from 'next-translate/useTranslation';
import DefaultHours from './Availability/defaultHours';

const Availability = ({values, setFieldValue}) => {
  const {t} = useTranslation();

  return (
    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
      <div className='px-4 py-5 flex-auto'>
        <div className='tab-content tab-space'>
          <div className='block' id='link1'>
            <div className='mb-4'>
              <div className='row'>
                <span className='text-xs'>{t('event:choose_availability')}</span>
              </div>
              <div className='mt-1'>
                <span className='text-sm font-medium text-gray-900'>
                  {t('event:choose_availability_desc')}{' '}
                </span>
              </div>
              <DefaultHours values={values} setFieldValue={setFieldValue} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Availability;
