import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import Modal from '../Modal';

const DeleteModal = () => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const router = useRouter();

  return (
    <Modal title={t('common:signout_confirm')} extraSmall>
      <div className='flex flex-row-reverse flex-wrap sm:flex-nowrap gap-2 mt-2'>
        <button
          type='button'
          onClick={hideModal}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('common:No')}
        </button>
        <button
          type='button'
          onClick={async () => {
            const path = await signOut({
              callbackUrl: `/${router.locale}/`,
              redirect: false,
            });
            router.push(path.url);
          }}
          className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
        >
          {t('Yes')}
        </button>
      </div>
    </Modal>
  );
};
export default DeleteModal;
