/* eslint-disable no-restricted-globals */
import useTranslation from 'next-translate/useTranslation';
import {Menu, Transition} from '@headlessui/react';
import {Fragment, useContext, useEffect, useState} from 'react';
import {PencilAltIcon, DotsVerticalIcon, TrashIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import {UserContext} from 'store/UserContext/User.context';
import {useMutation, useQuery} from '@apollo/client';
import {useSession} from 'next-auth/react';
import Loader from 'components/shared/Loader/Loader';
import Link from 'next/link';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import userQueries from 'constants/GraphQL/User/queries';
import mutations from 'constants/GraphQL/Service/mutations';
import orgMutations from 'constants/GraphQL/Organizations/mutations';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import {useRouter} from 'next/router';

const ServiceCard = ({service}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const {data: session} = useSession();
  const [copied, setCopied] = useState(false);
  const {
    state: {username},
    actions: {setUsername},
  } = useContext(UserContext);
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const {showModal} = ModalContextProvider();
  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const [deleteMutation] = useMutation(mutations.deleteService);
  const [deleteOrgMutation] = useMutation(orgMutations.DeleteOrganizationService);

  const handleDeleteService = async serviceID => {
    await deleteMutation({
      variables: {
        token: session?.accessToken,
        documentId: serviceID,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Service successfully deleted', false);
    router.reload();
  };

  const deleteService = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: service.title,
      id: itemID,
      handleDelete: handleDeleteService,
    });
  };

  const handleDeleteOrgService = async serviceID => {
    await deleteOrgMutation({
      variables: {
        token: session?.accessToken,
        documentId: serviceID,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Organization Service successfully deleted', false);
    router.reload();
  };

  const deleteOrgService = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: service.title,
      id: itemID,
      handleDelete: handleDeleteOrgService,
    });
  };

  const {data: user, loading} = useQuery(userQueries.getUserById, {
    variables: {token: session?.accessToken},
  });
  const User = user?.getUserById?.userData?.accountDetails;

  const EditEvent = itemID => {
    showModal(MODAL_TYPES.EVENT, {
      eventID: itemID,
      initdata: service,
    });
  };
  const EditOrgModal = itemID => {
    showModal(MODAL_TYPES.ORG_SERVICE, {
      eventID: itemID,
      initdata: service,
    });
  };
  const isOrgService = service?.isOrgService === true;

  useEffect(() => {
    setUsername(User?.username);
  }, [User?.username]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div
      className='bg-white shadow rounded-lg divide-y divide-gray-200 col-span-1'
      key={service?.title}
    >
      <div className='px-4 py-5 sm:px-6 flex flex-wrap'>
        <div className='w-2/5 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2'>
          {service.isPrivate ? t('event:Private') : t('event:Public')}
        </div>

        <div className='w-3/5 sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 justify-end text-right'>
          {t(`event:${service?.conferenceType[0]}`)}

          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <Menu.Button className='px-4 bg-white '>
                <DotsVerticalIcon className='w-4 h-4' />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <Menu.Item>
                    {({active}) => (
                      <button
                        onClick={() =>
                          isOrgService ? EditOrgModal(service._id) : EditEvent(service._id)
                        }
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'w-24 px-4 py-2 text-sm  flex'
                        )}
                      >
                        <PencilAltIcon className='w-5 h-5 text-mainBlue' />
                        <span>Edit</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <button
                        onClick={() =>
                          isOrgService ? deleteOrgService(service._id) : deleteService(service._id)
                        }
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'w-24 px-4 py-2 text-sm  flex'
                        )}
                      >
                        <TrashIcon className='w-5 h-5 text-red-600' /> <span>Delete</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      <div
        className='cursor-pointer hover:shadow-md max-h-36'
        onClick={() => (isOrgService ? EditOrgModal(service._id) : EditEvent(service._id))}
      >
        <div className='px-4 py-5 sm:p-6'>
          <p className='font-bold text-md break-words'>{service.title}</p>
          <p className='overflow-hidden break-words'>
            {isOrgService && (
              <>
                <span>
                  {`Linked Organization -
                              ${service.organizationName}`}
                </span>
              </>
            )}
          </p>
          {service.description && (
            <div className='sm:col-span-2 line-clamp-2'>
              <div
                className='mt-1 text-sm text-gray-900 custom'
                dangerouslySetInnerHTML={{
                  __html: service.description,
                }}
              />
            </div>
          )}

          <p>{service.price > 0 ? service.currency + service.price : t('event:Free')}</p>
        </div>
      </div>

      <div className='px-4 py-5 sm:px-6 flex w-full overflow-hidden'>
        <Link href={`${location?.origin}/${username}/${service.slug}`} passHref={false}>
          <a className='cursor-pointer text-mainBlue truncate w-full' target={'_blank'}>
            https://30mins.com/{username}/{service.slug}
          </a>
        </Link>
        <button
          className=''
          onClick={() => {
            navigator.clipboard.writeText(`${location?.origin}/${username}/${service.slug}`);
            setCopied(true);
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-6 w-6 ${copied ? 'text-green-600' : 'text-black'}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default ServiceCard;
