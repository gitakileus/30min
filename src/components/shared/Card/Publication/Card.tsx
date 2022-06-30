import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/Publications/mutations';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {GlobeIcon} from '@heroicons/react/solid';
import {useContext} from 'react';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';

const PublicationCard = ({publication}) => {
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const {t} = useTranslation();
  const [deleteMutation] = useMutation(mutations.deletePublication);
  const router = useRouter();

  const EditPublication = itemID => {
    showModal(MODAL_TYPES.PUBLICATION, {
      pubID: itemID,
    });
  };
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const handleDelete = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Publication successfully deleted', false);
    router.reload();
  };

  const deletePublication = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: publication.headline,
      id: itemID,
      handleDelete: handleDelete,
    });
  };

  return (
    <>
      <div className='bg-white rounded-lg border shadow-lg mt-5 pad-24 flex flex-col '>
        <div
          className='flex-none sm:flex flex-row py-6 pubItemContainer flex-wrap justify-center px-4'
          key={publication.id}
        >
          <div className='w-36 h-36 rounded-md overflow-hidden'>
            <img
              className='w-full h-full object-cover object-center'
              src={publication.image}
              alt='publicationImage'
            />
          </div>
          <div className='flex flex-1 flex-col ml-2 overflow-hidden'>
            <span className='font-22 font-bold text-gray-700 break-words'>
              {publication.headline}
            </span>

            <a href={publication.url} target='_blank' rel='noreferrer'>
              <GlobeIcon className='w-6 h-6' />{' '}
            </a>
            <div className='unreset'>{publication.type}</div>
            {publication.description && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: publication.description,
                  }}
                ></dd>
              </div>
            )}
            <div className='flex flex-1 justify-end flex-cont-end flex-items-end space-x-3 mx-2'>
              <button
                onClick={() => EditPublication(publication._id)}
                className='w-30 h-10 mt-2 mr-2 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-mainBlue text-white hover:bg-blue-700'
              >
                {t('common:btn_edit')}
              </button>{' '}
              <button
                onClick={() => deletePublication(publication._id)}
                className='w-30 h-10 mt-2 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700'
              >
                {t('common:btn_delete')}
              </button>
            </div>
          </div>
        </div>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center'></div>
        </div>
      </div>
    </>
  );
};

export default PublicationCard;
