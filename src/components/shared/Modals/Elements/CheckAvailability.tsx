/* eslint-disable no-lone-blocks */
import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';
import Modal from '../Modal';

const AvailabilityDuration = () => {
  const {t} = useTranslation();
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {handleConfirm, values, setFieldValue} = modalProps || {};
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(30);

  return (
    <Modal title={t('common:txt_check_availability')} small>
      <form>
        <div className='flex justify-end flex-col mt-2'>
          <span className='font-bold text-sm mt-1'>{t('common:Duration')}</span>
          <input
            type={'number'}
            onChange={e => setDuration(Number(e.target.value))}
            value={duration}
            placeholder={t('common:Meeting_Duration')}
            name='duration'
            id='duration'
            min={1}
            className='col-span-5 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          />
        </div>
        <div className='flex justify-end flex-wrap sm:flex-nowrap gap-2 mt-2'>
          <button
            type='button'
            onClick={async () => {
              setLoading(true);
              await handleConfirm(duration, values, setFieldValue);
              setLoading(false);
              hideModal();
            }}
            disabled={loading || duration < 1}
            className={classNames([
              'bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue disabled:bg-slate-600 disabled:text-white',
              duration > 1
                ? ' hover:bg-mainBlue hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                : '',
            ])}
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </button>

          <button
            type='button'
            disabled={loading}
            onClick={hideModal}
            className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
          >
            {t('common:btn_cancel')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default AvailabilityDuration;
