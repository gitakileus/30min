/* eslint-disable no-lone-blocks */
import {useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const DeleteModal = () => {
  const {t} = useTranslation();
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {
    handleDelete,
    name,
    id,
    isDeleteAccount,
    isDeleteUnverified,
    isAdminDeleteUsers,
    isOrgDelete,
  } = modalProps || {};
  const [isDeleting, setIsDeleting] = useState(false);

  const svgIcon = (
    <svg
      className='h-6 w-6 text-red-600'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      aria-hidden='true'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      />
    </svg>
  );

  const title = isDeleteAccount
    ? t('profile:delete_account')
    : isDeleteUnverified
    ? t('setting:delete_unverified')
    : isAdminDeleteUsers
    ? `${t('common:del_selected_users')}`
    : `${t('common:Delete_record')} ${name}?`;

  const modalContent = isDeleteAccount
    ? `${`${t('profile:confirm_delete_account')} ${name}?`}`
    : isDeleteUnverified
    ? t('setting:delete_unverified_question')
    : isAdminDeleteUsers
    ? ''
    : `${`${t('common:delete_confirm')} ${name}?`}`;

  return (
    <Modal icon={svgIcon} title={title} extraSmall>
      <div className='bg-white pt-3'>
        <div className='sm:flex sm:items-start'>
          <div className='mt-3 text-center sm:text-left'>
            <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
              {modalContent}
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>{t('common:delete_confirm1')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='py-3 sm:px-6 flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2'>
        <button
          type='button'
          onClick={() => {
            {
              isDeleteUnverified
                ? (handleDelete(), setIsDeleting(true))
                : isOrgDelete
                ? (handleDelete(), setIsDeleting(true))
                : (setIsDeleting(true), handleDelete(id));
            }
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {isDeleting ? t('common:btn_deleting') : t('common:btn_delete')}
        </button>

        <button
          type='button'
          disabled={isDeleting}
          onClick={hideModal}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:btn_cancel')}
        </button>
      </div>
    </Modal>
  );
};
export default DeleteModal;
