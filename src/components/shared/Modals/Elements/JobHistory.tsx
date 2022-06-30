import {useContext, useEffect, useState} from 'react';
import {PlusIcon} from '@heroicons/react/solid';
import {JOB_HISTORY_STATE, JOB_HISTORY_YUP} from 'constants/yup/jobHistory';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/JobHistory/mutations';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/JobHistory/queries';
import Loader from 'components/shared/Loader/Loader';
import dynamic from 'next/dynamic';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const JobHistoryModal = () => {
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {eventID} = modalProps || {};

  const {data: session} = useSession();
  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const isAdd = !eventID;
  const [JobHistoryData, setJobHistoryData] = useState<Object>([]);
  const [loading, setLoading] = useState(false);
  const [createMutation] = useMutation(mutations.createJobHistory);
  const [editMutation] = useMutation(mutations.editJobHistory);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getServiceData = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getJobHistoryById,
        {documentId: eventID, token: session?.accessToken},
        session?.accessToken
      );
      setJobHistoryData(data);
    };

    if (eventID !== undefined) {
      getServiceData();
    }
    setLoading(false);
  }, [eventID]);

  const jobData =
    JobHistoryData &&
    Object.values(JobHistoryData).map(job => job?.getJobHistoryById?.jobHistoryData);

  const jobHistoryValues = jobData?.reduce(
    (acc, cur) => ({
      ...acc,
      ...cur,
    }),
    {}
  );

  const [descLength, setDescLength] = useState(
    jobHistoryValues?.roleDescription
      ? (jobHistoryValues.roleDescription || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/&nbsp;/gi, ' ').length - 7
      : 0
  );

  const AddJobHistory = async (values, setSubmitting) => {
    await createMutation({
      variables: {
        jobHistoryData: {
          position: values.position,
          company: values.company,
          startDate: values.startDate,
          endDate: values.current === 'false' || values.current === false ? values.endDate : null,
          current: values.current === 'true' ? true : false,
          location: values.location,
          employmentType: values.employmentType,
          roleDescription: values.roleDescription,
        },
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Job History successfully added', false);
    router.reload();
    setSubmitting(false);
  };

  const EditJobHistory = async (id, values, setSubmitting) => {
    await editMutation({
      variables: {
        jobHistoryData: {
          position: values.position,
          company: values.company,
          startDate: values.startDate,
          endDate: values.current === 'false' || values.current === false ? values.endDate : null,
          current: values.current === 'true' ? true : false,
          location: values.location,
          employmentType: values.employmentType,
          roleDescription: values.roleDescription,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Job History successfully edited', false);
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddJobHistory(values, setSubmitting);
    } else {
      EditJobHistory(eventID, values, setSubmitting);
    }
  };

  const SelectTypeOptions = [
    {
      key: t('profile:add_job_history_employment_type_full_time'),
      value: 'Full-Time',
    },
    {
      key: t('profile:add_job_history_employment_type_part_time'),
      value: 'Part-Time',
    },
    {
      key: t('profile:add_job_history_employment_type_contract'),
      value: 'Contract',
    },
    {
      key: t('profile:add_job_history_employment_type_self_employed'),
      value: 'Self-Employed',
    },
    {
      key: t('profile:add_job_history_employment_type_freelance'),
      value: 'Freelance',
    },
    {
      key: t('profile:add_job_history_employment_type_internship'),
      value: 'Internship',
    },
    {
      key: t('profile:add_job_history_employment_type_seasonal'),
      value: 'Seasonal',
    },
    {key: t('profile:Other'), value: 'Other'},
  ];

  const JobTypes = SelectTypeOptions.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal
      title={
        isAdd
          ? t('profile:add_job_history_title')
          : `${`${t('profile:edit_job_history_title')} ${jobHistoryValues.position}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={isAdd ? JOB_HISTORY_STATE : jobHistoryValues}
        validationSchema={JOB_HISTORY_YUP}
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
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <>
              <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
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
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('common:btn_save')}
                </button>
              </div>

              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1 md:gap-6'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='grid grid-cols-6 gap-6'>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='first-name'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:add_job_history_position')}
                          </label>
                          <input
                            value={values.position}
                            maxLength={160}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='text'
                            name='position'
                            id='position'
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                          />
                          {touched.position && errors.position ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.position}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:add_job_history_company')}
                          </label>
                          <input
                            value={values.company}
                            maxLength={160}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='text'
                            name='company'
                            id='company'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.company && errors.company ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.company}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:add_job_history_location')}
                          </label>
                          <input
                            value={values.location}
                            maxLength={160}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='text'
                            name='location'
                            id='location'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.location && errors.location ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.location}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                            {t('profile:add_job_history_employment_type')}
                          </label>
                          <select
                            value={values.employmentType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id='employmentType'
                            name='employmentType'
                            className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                          >
                            {JobTypes}
                          </select>
                          {touched.employmentType && errors.employmentType ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.employmentType}
                            </div>
                          ) : null}
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                            {t('profile:add_job_history_current')}
                          </label>
                          <select
                            value={values.current}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id='current'
                            name='current'
                            className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                          >
                            <option value='true'> {t('common:Yes')}</option>
                            <option value='false'> {t('common:No')}</option>
                          </select>
                          {touched.current && errors.current ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.current}
                            </div>
                          ) : null}
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                            {t('profile:add_job_history_start_date')}
                          </label>
                          <input
                            value={values.startDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='date'
                            name='startDate'
                            id='startDate'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.startDate && errors.startDate ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {t('profile:enter_valid_date')}
                            </div>
                          ) : null}
                        </div>

                        {values.current === 'false' || values.current === false ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='type'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('profile:education_history_end_date')}
                            </label>
                            <input
                              required={values.current === 'false'}
                              value={values.endDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type='date'
                              name='endDate'
                              id='endDate'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                            {touched.endDate && errors.endDate ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {t('profile:enter_valid_date')}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <div className=' col-span-6'>
                          {t('common:txt_add_note')}
                          <CKEditor
                            setDescLength={setDescLength}
                            name={t('profile:add_job_history_role_description')}
                            value={values.roleDescription}
                            onChange={data => {
                              setFieldValue('roleDescription', data);
                            }}
                          />
                          {descLength}/750
                          {touched.roleDescription && errors.roleDescription ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.roleDescription}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default JobHistoryModal;
