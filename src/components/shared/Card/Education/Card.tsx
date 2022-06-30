import {useMutation} from '@apollo/client';
import {MODAL_TYPES} from 'constants/context/modals';
import mutations from 'constants/GraphQL/EducationHistory/mutations';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useContext} from 'react';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';

const EducationCard = ({education}) => {
  const {showModal} = ModalContextProvider();
  const {data: session} = useSession();
  const router = useRouter();
  const [deleteMutation] = useMutation(mutations.deleteEducationHistory);
  const {t} = useTranslation();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const EditPublication = itemID => {
    showModal(MODAL_TYPES.EDUCATION, {
      eventID: itemID,
      initdata: education,
    });
  };

  const handleDelete = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Education successfully deleted', false);
    router.reload();
  };

  const deleteEducation = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: education.school,
      id: itemID,
      handleDelete: handleDelete,
    });
  };

  return (
    <>
      <div className='bg-white rounded-lg border shadow-lg mt-5 pad-24 flex flex-col'>
        <div
          className='flex-none sm:flex flex-row py-6 pubItemContainer flex-wrap justify-center px-4'
          key={education.id}
        >
          <div className='flex flex-1 flex-col px-4 overflow-hidden'>
            <span className='font-22 font-bold text-gray-700 break-words'>
              {education.school} - {education.fieldOfStudy}
            </span>

            <div className='unreset'>{education.degree}</div>
            <div className='unreset'>
              {new Date(education.startDate).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'short',
              })}
              -{' '}
              {education.current && education.endDate === null
                ? 'Present'
                : new Date(education.endDate).toLocaleDateString('en-us', {
                    year: 'numeric',
                    month: 'short',
                  })}
            </div>
            <div>{education.graduated ? 'Graduated' : null}</div>
            {education.extracurricular && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: education.extracurricular,
                  }}
                ></dd>
              </div>
            )}
            <div className='flex flex-1 justify-end flex-cont-end flex-items-end space-x-3 mx-2'>
              <button
                onClick={() => EditPublication(education._id)}
                className='w-30 h-10 mt-2 mr-2 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-mainBlue text-white hover:bg-blue-700
              '
              >
                {t('common:btn_edit')}
              </button>{' '}
              <button
                onClick={() => deleteEducation(education._id)}
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

export default EducationCard;
