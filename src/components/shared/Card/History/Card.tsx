import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/JobHistory/mutations';
import {useContext} from 'react';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';

const HistoryCard = ({jobs}) => {
  const {showModal} = ModalContextProvider();

  const {t} = useTranslation();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const EditJobHistory = itemID => {
    showModal(MODAL_TYPES.JOBHISTORY, {
      eventID: itemID,
    });
  };

  const {data: session} = useSession();
  const router = useRouter();
  const [deleteMutation] = useMutation(mutations.deleteJobHistory);

  const DeletePublication = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Jos History successfully deleted', false);
    router.reload();
  };

  const deleteHistory = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: jobs.company,
      id: itemID,
      handleDelete: DeletePublication,
    });
  };

  return (
    <div key={jobs.id} className='bg-white rounded-lg border shadow-lg mt-5 pad-24 flex flex-col'>
      <div
        className='flex-none sm:flex flex-row py-6 pubItemContainer flex-wrap justify-center px-4'
        key={jobs.id}
      >
        <div className='flex flex-1 flex-col ml-2 overflow-hidden'>
          <span className='font-22 font-bold text-gray-700 break-words'>
            {jobs.position} - {jobs.company}
          </span>
          <div className='unreset'>
            {new Date(jobs.startDate).toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
            })}
            -{' '}
            {jobs.current && jobs.endDate === null
              ? 'Present'
              : new Date(jobs.endDate).toLocaleDateString('en-us', {
                  year: 'numeric',
                  month: 'short',
                })}
          </div>
          <div className='unreset'>
            {jobs.location} - {jobs.employmentType}
          </div>
          {jobs.roleDescription && (
            <div className='sm:col-span-2'>
              <dd
                className='mt-1 custom break-words'
                dangerouslySetInnerHTML={{
                  __html: jobs.roleDescription,
                }}
              ></dd>
            </div>
          )}
          <div className='flex flex-1 justify-end flex-cont-end flex-items-end space-x-3 mx-2'>
            <button
              onClick={() => EditJobHistory(jobs._id)}
              className='w-30 h-10 mt-2 mr-2 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-mainBlue text-white hover:bg-blue-700'
            >
              {t('common:btn_edit')}
            </button>{' '}
            <button
              onClick={() => deleteHistory(jobs._id)}
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
  );
};

export default HistoryCard;
