/* eslint-disable no-lone-blocks */
import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const ConfirmModal = () => {
  const {t} = useTranslation();
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {handleConfirm, title, message, subMessage} = modalProps || {};
  const [loading, setLoading] = useState(false);

  return (
    <Modal title={title} small>
      <div>{message}</div>
      {subMessage ? <div>{subMessage}</div> : null}
      <div className='flex justify-end flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <button
          type='button'
          onClick={() => {
            setLoading(true);
            handleConfirm();
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue hover:bg-mainBlue hover:text-white duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
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
    </Modal>
  );
};
export default ConfirmModal;
