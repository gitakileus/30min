import {ChevronRightIcon, PlusSmIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import {useContext, useState} from 'react';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {Field, Form, Formik} from 'formik';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {useRouter} from 'next/router';
import AvailabilityQueries from 'constants/GraphQL/CollectiveAvailability/queries';
import AvailabilityMutations from 'constants/GraphQL/CollectiveAvailability/mutations';
import {
  COLLECTIVE_AVAILABILITY_STATE,
  COLLECTIVE_AVAILABILITY_YUP,
} from 'constants/yup/ColectaveAvailablaty';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import dayjs from 'dayjs';
import classNames from 'classnames';
import ListGroups from './ListGroups';
import ListEmails from './ListEmails';
import Calendar from './AvailabilityCalendar';

const Availability = ({session, integrations, isExtensionActivate}) => {
  const {showModal, hideModal} = ModalContextProvider();
  const route = useRouter();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const {t} = useTranslation();
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const [Ref, setRef] = useState<any>(null);
  const handleClear = setFieldValue => {
    setFieldValue('idSelectedGroup', '');
    setFieldValue('availableTimeSlots', []);
    setFieldValue('emails', []);
    setFieldValue('email', '');
  };
  const GetAllGroups = async setFieldValue => {
    const {data} = await graphqlRequestHandler(
      AvailabilityQueries.getAllGroups,
      {},
      session?.accessToken
    );
    const getAllGroups = data?.data?.getAllGroups;
    setFieldValue('groups', getAllGroups?.groupData);
  };

  const CheckUserEmailAndCalendar = async (values, setFieldValue) => {
    setIsCheckingEmail(true);
    const {data} = await graphqlRequestHandler(
      AvailabilityQueries.CheckUserEmailAndCalendar,
      {
        email: values.email,
      },
      session?.accessToken
    );
    if (
      !data?.data?.checkUserEmailAndCalendar?.hasCalendar ||
      !data?.data?.checkUserEmailAndCalendar?.userExists
    ) {
      showNotification(
        NOTIFICATION_TYPES.error,
        data?.data?.checkUserEmailAndCalendar?.response?.message,
        false
      );
      setIsCheckingEmail(false);
      return false;
    }
    values.emails?.push({
      email: values.email,
      _id: data?.data?.checkUserEmailAndCalendar?.guestID,
    });
    setFieldValue('emails', values.emails);
    setFieldValue('email', '');
    setIsCheckingEmail(false);
    return true;
  };

  const handleDeleteGroup = async (values, setFieldValue) => {
    const {data: deleteGroup} = await graphqlRequestHandler(
      AvailabilityMutations.DeleteGroup,
      {
        documentId: values.idSelectedGroup,
      },
      session?.accessToken
    );
    if (deleteGroup?.data?.deleteGroup?.status === 200) {
      showNotification(NOTIFICATION_TYPES.success, deleteGroup?.data?.deleteGroup?.message, false);
      handleClear(setFieldValue);
      await GetAllGroups(setFieldValue);
      hideModal();
    }
  };

  const showDeleteGroup = async (values, setFieldValue) => {
    showModal(MODAL_TYPES.CONFIRM, {
      handleConfirm: async () => handleDeleteGroup(values, setFieldValue),
      title: 'Delete group',
      message: `Are you sure you want to delete group ${
        values.groups.filter(item => item._id === values.idSelectedGroup)[0].name
      }?`,
    });
  };

  const CheckAvailabilityTimeSlots = async (duration, values, setFieldValue) => {
    try {
      const {data} = await graphqlRequestHandler(
        AvailabilityQueries.getCollectiveAvailability,
        {
          emails: values.emails.map(item => item.email),
          date: dayjs(values.selectedDate).format('YYYY-MM-DD'),
          duration: Number(duration),
        },
        session?.accessToken
      );

      if (data.data.getCollectiveAvailability.response.status === 200) {
        setFieldValue(
          'availableTimeSlots',
          Object.values(data?.data?.getCollectiveAvailability?.availableTimeSlots)
        );
        showNotification(
          NOTIFICATION_TYPES.info,
          data?.data.getCollectiveAvailability.response.message,
          false
        );
      } else {
        showNotification(
          NOTIFICATION_TYPES.error,
          data?.data.getCollectiveAvailability.response.message,
          false
        );
      }
      window.scrollTo(0, Ref.offsetTop);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditGroup = async (values, setFieldValue) => {
    const {data} = await graphqlRequestHandler(
      AvailabilityMutations.EditGroup,
      {
        groupData: {
          guestIDs: Object.values(values.emails.map(item => item._id)),
          name: values.groups?.filter(group => group._id === values.idSelectedGroup)[0].name,
        },
        documentId: values.idSelectedGroup,
      },
      session?.accessToken
    );
    const editGroup = data?.data?.editGroup;
    if (editGroup?.status === 200) {
      showNotification(NOTIFICATION_TYPES.success, editGroup?.message, false);
      handleClear(setFieldValue);
      await GetAllGroups(setFieldValue);
      hideModal();
    }
  };

  const showDuration = (values, setFieldValue) => {
    showModal(MODAL_TYPES.CHECK_AVAILABILITY, {
      handleConfirm: CheckAvailabilityTimeSlots,
      values: values,
      setFieldValue: setFieldValue,
    });
  };

  const showUpdateGroup = (values, setFieldValue) => {
    showModal(MODAL_TYPES.CONFIRM, {
      handleConfirm: () => handleEditGroup(values, setFieldValue),
      title: 'Update group',
      message: t('common:txt_save_changes'),
      values,
      setFieldValue,
    });
  };

  const CheckEmailThenAddToList = async (values, setFieldValue) => {
    if (values.emails.length > 9) {
      showNotification(NOTIFICATION_TYPES.info, t('common:txt_max_10_people_per_group'), false);
    } else if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(values.email)
    ) {
      if (values.emails.filter(item => item.email === values.email).length === 0) {
        await CheckUserEmailAndCalendar(values, setFieldValue);
      }
    }
  };

  const handleKeyEnterDown = async (e, values, setFieldValue) => {
    try {
      if (e.which === 13 && values.email !== '') {
        if (values.emails.length > 9) {
          showNotification(NOTIFICATION_TYPES.info, 'Max 10 Emails', false);
        } else {
          // eslint-disable-next-line
          if (
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
              values.email
            )
          ) {
            if (values.emails.filter(item => item.email === values.email).length === 0) {
              await CheckUserEmailAndCalendar(values, setFieldValue);
              e.preventDefault();
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateGroup = async (values, setFieldValue) => {
    setIsAddingGroup(true);
    const {data} = await graphqlRequestHandler(
      AvailabilityMutations.CreateGroup,
      {
        groupData: {
          guestIDs: Object.values(values?.emails?.map(item => item._id)),
        },
      },
      session?.accessToken
    );
    const createGroup = data?.data?.createGroup;
    if (createGroup?.status === 200) {
      showNotification(NOTIFICATION_TYPES.success, createGroup?.message, false);
      handleClear(setFieldValue);
      await GetAllGroups(setFieldValue);
    } else {
      showNotification(NOTIFICATION_TYPES.info, createGroup?.message, false);
    }
    setIsAddingGroup(false);
  };

  return (
    <>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-2 py-4'>
        <div className='flex-1 min-w-0'>
          <nav className='flex' aria-label='Breadcrumb'>
            <ol role='list' className='flex items-center space-x-4'>
              <li>
                <div className='flex'>
                  <Link href='/' passHref>
                    <a className='text-sm font-medium text-gray-700  hover:text-gray-800 cursor-pointer'>
                      {t('page:Home')}
                    </a>
                  </Link>
                </div>
              </li>
              <li>
                <div className='flex items-center'>
                  <ChevronRightIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                  <a
                    href='#'
                    className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'
                  >
                    {t('page:Collective Availability')}
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
            {t('page:Collective Availability')}
          </h2>
        </div>
      </div>
      <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mt-4'>
        {isExtensionActivate ? (
          <div className='flex flex-1'>
            <Formik
              initialValues={
                integrations.data.getAllGroups
                  ? {
                      ...COLLECTIVE_AVAILABILITY_STATE,
                      ...{groups: integrations.data.getAllGroups.groupData},
                    }
                  : COLLECTIVE_AVAILABILITY_STATE
              }
              validationSchema={COLLECTIVE_AVAILABILITY_YUP}
              onSubmit={() => {}}
            >
              {({values, handleBlur, setFieldValue}) => (
                <>
                  <Form className='flex flex-1 flex-col sm:flex-row'>
                    <div
                      onSubmit={() => {}}
                      className='flex flex-col sm:w-6/6 md:w-2/6 px-1 w-full'
                    >
                      <span className='font-bold'>
                        {values?.idSelectedGroup !== ''
                          ? `${
                              values.groups.filter(item => item._id === values.idSelectedGroup)[0]
                                ?.name.length < 40
                                ? values.groups.filter(
                                    item => item._id === values.idSelectedGroup
                                  )[0]?.name
                                : `${values.groups
                                    .filter(item => item._id === values.idSelectedGroup)[0]
                                    ?.name.substring(0, 40)
                                    .trim()}...`
                            }`
                          : t('common:txt_add_group_participant')}
                      </span>
                      <div className='mt-2 grid col-span-6 row-span-1 grid-flow-col gap-2 px-1'>
                        <Field
                          type={'email'}
                          onKeyDown={e => handleKeyEnterDown(e, values, setFieldValue)}
                          onBlur={handleBlur}
                          value={values.email}
                          placeholder={t('common:txt_enter_an_email')}
                          name='email'
                          id='email'
                          disabled={isCheckingEmail}
                          className='col-span-4 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                        <button
                          onClick={() => CheckEmailThenAddToList(values, setFieldValue)}
                          className='bg-mainBlue col-span-1 border border-transparent rounded-md shadow-sm text-center py-2 px-2 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                          disabled={isCheckingEmail}
                        >
                          <div className='m-auto flex flex-row'>
                            <span>{t('common:Add')}</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleClear(setFieldValue)}
                          className='bg-mainBlue col-span-1 border border-transparent rounded-md shadow-sm text-center py-2 px-2 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                          disabled={isCheckingEmail}
                        >
                          <div className='m-auto flex flex-row'>
                            <span className='m-auto'>{t('common:Clear')}</span>
                          </div>
                        </button>
                      </div>
                      <ListEmails emails={values.emails} setFieldValue={setFieldValue} />
                      <div
                        className={classNames([
                          'grid grid-cols-2 grid-rows-2 gap-1 p-2',
                          'col-span-1> row-span-1>',
                        ])}
                      >
                        <button
                          disabled={
                            !(values?.emails?.length > 0 && values?.idSelectedGroup === '') ||
                            isAddingGroup
                          }
                          onClick={() => handleCreateGroup(values, setFieldValue)}
                          className='bg-mainBlue mt-2 w-full border border-transparent rounded-md shadow-sm text-center py-2 px-2 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                        >
                          <span className='m-auto select-none'>{t('common:btn_add_group')}</span>
                        </button>
                        <button
                          disabled={
                            !(values?.emails?.length >= 0 && values?.idSelectedGroup !== '')
                          }
                          onClick={() => showUpdateGroup(values, setFieldValue)}
                          className='bg-mainBlue mt-2 w-full border border-transparent rounded-md shadow-sm text-center py-2 px-2 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                        >
                          <span className='m-auto select-none'>{t('common:btn_update_group')}</span>
                        </button>
                        <button
                          disabled={
                            !(values?.emails?.length >= 0 && values?.idSelectedGroup !== '')
                          }
                          onClick={() => showDeleteGroup(values, setFieldValue)}
                          className='bg-mainBlue mt-2 w-full border border-transparent rounded-md shadow-sm text-center py-2 px-2 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                        >
                          <span className='m-auto select-none'>{t('common:btn_delete_group')}</span>
                        </button>
                        <button
                          disabled={!(values?.emails?.length > 0 && values?.idSelectedGroup !== '')}
                          onClick={() => showDuration(values, setFieldValue)}
                          className='bg-mainBlue mt-2 w-full border border-transparent rounded-md shadow-sm text-center py-2 px-2 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                        >
                          <span className='m-auto select-none'>
                            {t('common:txt_check_availability')}
                          </span>
                        </button>
                      </div>
                      <span className='mt-3 font-bold'>{t('common:txt_Current_groups')}</span>
                      <ListGroups
                        session={session}
                        t={t}
                        setFieldValue={setFieldValue}
                        values={values}
                        handleClear={handleClear}
                      />
                    </div>
                    <div className='block w-full pl-4 mt-2 sm:pl-2 md:w-4/6 sm:mt-0'>
                      <Calendar setRef={setRef} setFieldValue={setFieldValue} values={values} />
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        ) : (
          <button
            onClick={() => {
              route.push('/user/extensions');
            }}
            type='button'
            className='flex flex-col justify-center items-center w-full md:w-1/2 border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <PlusSmIcon width={44} height={44} className='text-gray-600' />
            <span className='mt-2 block text-sm font-medium text-gray-900'>
              {t('event:txt_requires_Activ_extention_availability')}
            </span>
          </button>
        )}
      </div>
    </>
  );
};
export default Availability;
