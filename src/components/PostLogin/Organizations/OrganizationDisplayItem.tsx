import {useState, useContext} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';

const OrganizationDisplayItem = ({organization, userId}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const {data: session} = useSession();
  const [handlingLeave] = useState(false);
  const [lastOwnerError, setLastOwnerError] = useState('');
  const {showModal} = ModalContextProvider();

  const isOwner = organization?.role === 'owner' && organization?.userId === userId;
  const isAdmin = organization?.role === 'admin' && organization?.userId === userId;
  const orgID = organization?.organizationId?._id;

  const [deleteMutation] = useMutation(mutations.deleteOrganization);
  const [leaveMutation] = useMutation(mutations.handleLeave);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const deleteOrg = async itemID => {
    await deleteMutation({
      variables: {
        documentId: itemID,
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Organization successfully deleted', false);
    router.reload();
  };

  const deleteOrganization = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: organization?.organizationId?.title,
      id: itemID,
      handleDelete: deleteOrg,
    });
  };

  const handleLeave = async (itemID: string) => {
    try {
      const response = await leaveMutation({
        variables: {
          token: session?.accessToken,
          organizationId: itemID,
        },
      });
      const {data} = response;
      if (data?.leaveOrganization?.status === 400) {
        setLastOwnerError(data?.leaveOrganization?.message);
      } else {
        router.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='flex flex-col py-4 px-4 border-b-2 border-solid gap-4'>
      <div className='flex gap-4 sm:gap-6 flex-wrap'>
        <div className='w-36 h-36 rounded-md overflow-hidden'>
          <img
            className='w-full h-full object-contain object-center'
            src={organization?.organizationId?.image}
            alt='OrganizationImage'
          />
        </div>
        <div className='flex-1 flex flex-col w-full overflow-hidden break-words'>
          <h3 className='text-lg sm:text-xl font-bold text-gray-500 leading-5'>
            {organization?.organizationId?.title}
          </h3>
          <h4 className='sm:text-lg text-gray-500 leading-5'>
            {organization?.organizationId?.headline}
          </h4>
          <p className='hidden font-light sm:line-clamp-3 leading-5 mt-2 '>
            {organization?.organizationId?.description && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: organization?.organizationId?.description,
                  }}
                ></dd>
              </div>
            )}
          </p>
          <br></br>
          <Link href={`/org/${organization?.organizationId?.slug}`}>
            <a target={'_blank'} className='text-sm'>
              {t('event:view_public_page')}
            </a>
          </Link>
          {lastOwnerError && <span className='text-red-500 text-md'>{lastOwnerError}</span>}
        </div>
      </div>
      <div className='w-full flex flex-col sm:flex-row justify-end gap-2 flex-wrap'>
        {isAdmin || isOwner ? (
          <a href={`/user/organizations/edit/${orgID}`}>
            <button className='bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'>
              {t('common:btn_edit')}
            </button>
          </a>
        ) : null}
        {isOwner ? (
          <button
            onClick={() => {
              deleteOrganization(orgID);
            }}
            className='bg-red-500 mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
          >
            {t('common:btn_delete')}
          </button>
        ) : null}
        <button
          disabled={handlingLeave}
          onClick={() => {
            handleLeave(orgID);
          }}
          className='bg-mainBlue mt-2 mr-2 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
        >
          {handlingLeave ? 'Leaving...' : 'Leave'}
        </button>
      </div>
    </div>
  );
};

export default OrganizationDisplayItem;
