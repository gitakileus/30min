import {useContext, useState} from 'react';
import {PlusIcon} from '@heroicons/react/solid';
import Tabs from 'components/PostLogin/Tabs/Tab';
import {SUMMARY_TABS, TABS} from 'constants/context/tabs';
import {TabsContext} from 'store/Tabs/Tabs.context';
import {EVENT_STATE, EVENT_YUP} from 'constants/yup/service';
import {Field, Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Recurring from 'components/PostLogin/ServicePage/Tabs/Recurring';
import Visibility from 'components/PostLogin/ServicePage/Tabs/Visibility';
import ServiceFee from 'components/PostLogin/ServicePage/Tabs/ServiceFee';
import Availability from 'components/PostLogin/ServicePage/Tabs/Availability';
import mutations from 'constants/GraphQL/Service/mutations';
import {useMutation, useQuery} from '@apollo/client';
import slug from 'slug';
import {getCustomHours} from 'components/PostLogin/CustomTIme/utils';
import {useSession} from 'next-auth/react';
import userQueries from 'constants/GraphQL/User/queries';
import charityQuery from 'constants/GraphQL/Charity/queries';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import WhiteBlacklist from 'components/PostLogin/ServicePage/Tabs/WhiteBlackList';
import {PAYMENT_TYPE, SERVICE_TYPES} from 'constants/enums';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const EventModal = () => {
  const {t} = useTranslation();
  const router = useRouter();
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {eventID, initdata} = modalProps || {};

  const isAdd = !eventID;

  const {
    state: {tabsType},
  } = useContext(TabsContext);

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [slugError, setSlugError] = useState('');

  const {data: session} = useSession();
  const {data: userData} = useQuery(userQueries.getUserById, {
    variables: {token: session?.accessToken},
  });

  const {data: charityData} = useQuery(charityQuery.getCharities, {
    variables: {token: session?.accessToken},
  });

  const charities = charityData?.getCharities?.charityData;
  const userUsername = userData?.getUserById?.userData?.accountDetails?.username;
  const {paymentAccounts} = userData.getUserById.userData.accountDetails;

  const [createMutation] = useMutation(mutations.createService);
  const [editMutation] = useMutation(mutations.editService);

  const [tab, setTab] = useState(TABS.Fee);
  const {hideModal} = ModalContextProvider();

  const SelectMediaType = [
    {key: t('Select'), value: ''},
    {
      key: t('common:txt_media_type_google'),
      value: 'Google Slides',
    },
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ];
  const SelectServiceType = [
    {
      key: t('common:txt_service_type_Meeting'),
      value: SERVICE_TYPES.MEETING,
    },
    {
      key: t('common:txt_service_type_freelance_work'),
      value: SERVICE_TYPES.FREELANCING_WORK,
    },
    {
      key: t('common:txt_service_type_full_time_job'),
      value: SERVICE_TYPES.FULL_TIME_JOB,
    },
  ];

  const MediaTypeSelect = SelectMediaType.map(type => (
    <option key={type.value} value={type.value}>
      {type.key}
    </option>
  ));
  const ServiceTypeSelect = SelectServiceType.map(type => (
    <option key={type.value} value={type.value}>
      {type.key}
    </option>
  ));

  const conferenceTypes = userData?.getUserById?.userData?.accountDetails?.allowedConferenceTypes;

  const [descLength, setDescLength] = useState(
    initdata?.description ? initdata.description.replace(/&nbsp;/gm, ' ').length : 0
  );

  const GetValuesChanged = values => {
    const staticValue = {
      title: values.title,
      media: {
        type: values.media.link ? values.media.type : '',
        link: values.media.link,
      },
      slug: slug(values.slug),
      conferenceType: values.conferenceType,
      duration: values.duration,
      description: values.description,
      isPaid: values.isPaid,
      currency: values.currency,
      charity: values.charity,
      price: parseInt(values.price, 10),
      percentDonated: parseInt(values.percentDonated, 10),
      paymentType: values.paymentType,
      isPrivate: values.isPrivate,
      isRecurring: values.isRecurring,
      recurringInterval: values.recurringInterval,
      serviceType: values?.serviceType,
    };
    switch (true) {
      case values?.serviceWorkingHours?.isCustomEnabled && values.emailFilter?.isEnabled
        ? true
        : false:
        return {
          serviceData: {
            ...staticValue,
            emailFilter: {
              type: values.emailFilter.type,
              domains: values.emailFilter.domains,
              emails: values.emailFilter.emails,
            },
            serviceWorkingHours: {
              isCustomEnabled: true,
              sunday: {
                isActive: values?.serviceWorkingHours?.sunday?.isActive,
                availability: values?.serviceWorkingHours?.sunday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              monday: {
                isActive: values?.serviceWorkingHours?.monday.isActive,
                availability: values?.serviceWorkingHours?.monday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              tuesday: {
                isActive: values?.serviceWorkingHours?.tuesday.isActive,
                availability: values?.serviceWorkingHours?.tuesday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              wednesday: {
                isActive: values?.serviceWorkingHours?.wednesday.isActive,
                availability: values?.serviceWorkingHours?.wednesday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              thursday: {
                isActive: values?.serviceWorkingHours?.thursday.isActive,
                availability: values?.serviceWorkingHours?.thursday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              friday: {
                isActive: values?.serviceWorkingHours?.friday.isActive,
                availability: values?.serviceWorkingHours?.friday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              saturday: {
                isActive: values?.serviceWorkingHours?.saturday.isActive,
                availability: values?.serviceWorkingHours?.saturday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
            },
          },
        };
      case values?.serviceWorkingHours?.isCustomEnabled:
        return {
          serviceData: {
            ...staticValue,
            serviceWorkingHours: {
              isCustomEnabled: true,
              sunday: {
                isActive: values?.serviceWorkingHours?.sunday?.isActive,
                availability: values?.serviceWorkingHours?.sunday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              monday: {
                isActive: values?.serviceWorkingHours?.monday.isActive,
                availability: values?.serviceWorkingHours?.monday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              tuesday: {
                isActive: values?.serviceWorkingHours?.tuesday.isActive,
                availability: values?.serviceWorkingHours?.tuesday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              wednesday: {
                isActive: values?.serviceWorkingHours?.wednesday.isActive,
                availability: values?.serviceWorkingHours?.wednesday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              thursday: {
                isActive: values?.serviceWorkingHours?.thursday.isActive,
                availability: values?.serviceWorkingHours?.thursday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              friday: {
                isActive: values?.serviceWorkingHours?.friday.isActive,
                availability: values?.serviceWorkingHours?.friday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
              saturday: {
                isActive: values?.serviceWorkingHours?.saturday.isActive,
                availability: values?.serviceWorkingHours?.saturday?.availability?.map(item => ({
                  start: getCustomHours(item?.start),
                  end: getCustomHours(item?.end),
                })),
              },
            },
          },
        };
      case values.emailFilter ? values.emailFilter.isEnabled : false:
        return {
          serviceData: {
            ...staticValue,
            emailFilter: {
              type: values.emailFilter.type,
              domains: values.emailFilter.domains,
              emails: values.emailFilter.emails,
            },
          },
        };
      default:
        return {
          serviceData: {
            ...staticValue,
          },
        };
    }
  };
  const AddService = async (values, setSubmitting) => {
    const response = await createMutation({
      variables: {
        ...GetValuesChanged(values),
        token: session?.accessToken,
      },
    });
    if (response.data.createService.status === 409) {
      setSubmitting(false);
      setSlugError(response.data.createService.message);
      return;
    }

    if (response.data.createService.status !== 200) {
      setSubmitting(false);
      showNotification(
        NOTIFICATION_TYPES.error,
        `${t('common:Error')}: ${response.data.createService.message}`,
        false
      );
      return;
    }
    showNotification(NOTIFICATION_TYPES.info, 'Service successfully added', false);
    router.reload();
    setSubmitting(false);
  };

  const EditService = async (id, values, setSubmitting) => {
    const response = await editMutation({
      variables: {
        ...GetValuesChanged(values),
        token: session?.accessToken,
        documentId: id,
      },
    });
    if (response.data.editService.status === 409) {
      setSubmitting(false);
      setSlugError(response.data.editService.message);
      return;
    }
    if (response.data.editService.status !== 200) {
      setSubmitting(false);
      showNotification(
        NOTIFICATION_TYPES.error,
        `${t('common:Error')}: ${response.data.editService.message}`,
        false
      );
      return;
    }
    showNotification(NOTIFICATION_TYPES.info, 'Service successfully edited', false);
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    if (values.paymentType === PAYMENT_TYPE.MANUAL) {
      values.charity = undefined;
      values.percentDonated = undefined;
    }

    if (
      (PAYMENT_TYPE.DIRECT === values.paymentType && !paymentAccounts.direct.length) ||
      (PAYMENT_TYPE.ESCROW === values.paymentType && !paymentAccounts.escrow.length)
    ) {
      if (values.isPaid) {
        setSubmitting(false);
        showNotification(NOTIFICATION_TYPES.error, t('setting:stripe_required'), false);
        return;
      }
    }

    if (isAdd) {
      AddService(values, setSubmitting);
    } else {
      EditService(eventID, values, setSubmitting);
    }
  };

  return (
    <Modal
      title={
        isAdd
          ? t('event:txt_add_new_service')
          : `${`${t('event:txt_edit_service')} -  ${initdata.title} `}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={
          isAdd
            ? {
                ...EVENT_STATE,
                conferenceType: conferenceTypes,
              }
            : initdata
        }
        validationSchema={EVENT_YUP}
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
        enableReinitialize={true}
      >
        {({
          isSubmitting,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          touched,
          isValid,
          submitCount,
          errors,
        }) => {
          const tabsContent = {
            Fee: (
              <ServiceFee
                values={values}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                handleBlur={handleBlur}
                charities={charities}
                errors={errors}
              />
            ),
            visibility: <Visibility values={values} setFieldValue={setFieldValue} />,
            recurring: (
              <Recurring
                values={values}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            ),
            availability: <Availability values={values} setFieldValue={setFieldValue} />,
            Whiteblacklist: <WhiteBlacklist values={values} setFieldValue={setFieldValue} />,
          };

          const customHandleChange = async e => {
            const {name, value} = e.target;
            if (name === 'title') {
              setFieldValue('title', value);
              setFieldValue('slug', slug(value));
            } else {
              setFieldValue(name, value);
            }
          };

          return (
            <Form onSubmit={handleSubmit}>
              <>
                <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
                  {!isValid && submitCount > 0 && (
                    <div className='text-red-500 mt-2 text-sm font-normal  mb-2'>
                      {t('profile:formik_errors_invalid')}
                    </div>
                  )}
                  <button
                    type='button'
                    onClick={hideModal}
                    className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('common:btn_cancel')}
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-mainBlue disabled:opacity-20 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {isSubmitting ? t('common:btn_saving') : t('common:btn_save')}
                  </button>
                </div>
                <div className='mt-10 sm:mt-0'>
                  <div className='md:grid md:grid-cols-1 md:gap-6'>
                    <div className='mt-5 md:mt-0 md:col-span-2'>
                      <div className='overflow-hidden sm:rounded-md'>
                        <div className='grid grid-cols-6 gap-5'>
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='first-name'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('event:Title')}
                            </label>
                            <input
                              value={values.title}
                              onChange={customHandleChange}
                              maxLength={160}
                              onBlur={handleBlur}
                              type='text'
                              name='title'
                              id='title'
                              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                            />
                            {touched.title && errors.title ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.title}
                              </div>
                            ) : null}
                          </div>

                          <div className='col-span-6 sm:col-span-2'>
                            <label
                              htmlFor='mediaLink'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('common:txt_media_link_label')}
                            </label>
                            <input
                              value={values.media.link}
                              maxLength={160}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='text'
                              name='media.link'
                              id='media.link'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                          </div>

                          <div className='col-span-6 sm:col-span-1'>
                            <label
                              htmlFor='duration'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('event:Duration')}
                            </label>
                            <input
                              value={values.duration}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='number'
                              name='duration'
                              placeholder='15'
                              min={5}
                              id='duration'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                            {touched.duration && errors.duration ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.duration}
                              </div>
                            ) : null}
                          </div>

                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='last-name'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('common:slug')}
                            </label>
                            <div className='mt-1 flex rounded-md shadow-sm'>
                              <span className='hidden sm:inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                                https://30mins.com/{userUsername}/
                              </span>
                              <input
                                type='text'
                                value={values.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name='slug'
                                id='slug'
                                className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-mainBlue  focus:border-mainBlue sm:text-sm border-gray-300'
                              />
                            </div>
                            {slugError ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {slugError}
                              </div>
                            ) : null}
                            {touched.slug && errors.slug ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.slug}
                              </div>
                            ) : null}
                          </div>

                          <div className='col-span-6 sm:col-span-1'>
                            <label
                              htmlFor='mediaType'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('common:txt_media_type_label')}
                            </label>
                            <select
                              value={values.media.type}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id='media.type'
                              name='media.type'
                              className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              {MediaTypeSelect}
                            </select>
                          </div>

                          <div
                            className={`col-span-6 ${
                              values.serviceType === SERVICE_TYPES.MEETING
                                ? 'sm:col-span-1'
                                : 'sm:col-span-2'
                            }`}
                          >
                            <label
                              htmlFor='serviceType'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('common:txt_service_type_label')}
                            </label>
                            <select
                              value={values.serviceType}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id='serviceType'
                              name='serviceType'
                              className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                            >
                              {ServiceTypeSelect}
                            </select>
                          </div>

                          {values.serviceType === SERVICE_TYPES.MEETING && (
                            <div className='col-span-6 sm:col-span-1'>
                              <label
                                htmlFor='conferenceType'
                                className='block text-sm font-medium text-gray-700'
                              >
                                {t('event:typeof_meeting')}
                              </label>
                              <div className='flex flex-col gap-2 py-2 items-start pl-2'>
                                {conferenceTypes &&
                                  conferenceTypes.map((option, index) => (
                                    <div className='flex gap-2' key={index}>
                                      <Field
                                        type='checkbox'
                                        className='checked:bg-mainBlue'
                                        name='conferenceType'
                                        value={option}
                                      />
                                      <label
                                        htmlFor='fname'
                                        className='block text-sm font-medium text-gray-700 '
                                      >
                                        {t(`event:${option}`)}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                              {touched.conferenceType && errors.conferenceType ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.conferenceType}
                                </div>
                              ) : null}
                            </div>
                          )}

                          <label
                            htmlFor='description'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('common:Description')}
                          </label>
                          <div className='col-span-6'>
                            <CKEditor
                              name={t('common:Description')}
                              value={values.description}
                              setDescLength={setDescLength}
                              onChange={data => {
                                setFieldValue('description', data);
                              }}
                            />{' '}
                            {descLength}/750
                            {touched.description && errors.description ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.description}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-start'>
                      <Tabs
                        openedTab={tab}
                        className='w-full'
                        tabsNames={SUMMARY_TABS[tabsType]}
                        onChange={(tabName: string) => setTab(tabName)}
                      />
                    </div>
                  </div>
                  {tabsContent[tab]}
                </div>
              </>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default EventModal;
