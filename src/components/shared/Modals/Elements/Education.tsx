import {useContext, useState} from 'react';
import {PlusIcon} from '@heroicons/react/solid';
import {EDUCATION_HISTORY_STATE, EDUCATION_HISTORY_YUP} from 'constants/yup/education';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from 'constants/GraphQL/EducationHistory/mutations';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import DropDownComponent from 'components/shared/DropDownComponent';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const EducationModal = () => {
  const {data: session} = useSession();

  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {eventID, initdata} = modalProps || {};
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const isAdd = !eventID;

  const [createMutation] = useMutation(mutations.createEducationHistory);
  const [editMutation] = useMutation(mutations.editEducationHistory);

  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();

  const SelectGraduatedOptions = [
    {key: t('common:No'), value: 'false'},
    {key: t('common:Yes'), value: 'true'},
  ];

  const SelectCurrentOptions = [
    {key: t('common:No'), value: 'false'},
    {key: t('common:Yes'), value: 'true'},
  ];

  const [descLength, setDescLength] = useState(
    initdata?.extracurricular ? initdata.extracurricular.replace(/&nbsp;/gm, ' ').length - 7 : 0
  );

  const router = useRouter();
  const AddEducation = async (values, setSubmitting) => {
    await createMutation({
      variables: {
        educationHistoryData: {
          school: values.school,
          degree: values.degree,
          startDate: values.startDate,
          endDate: values.current === 'false' || values.current === false ? values.endDate : null,
          current:
            values.graduated === 'false' || values.graduated === false
              ? Boolean(values.current)
              : false,
          graduated:
            values.current === 'false' || values.current === false
              ? Boolean(values.graduated)
              : false,
          extracurricular: values.extracurricular,
          fieldOfStudy: values.fieldOfStudy,
        },
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Education successfully added', false);
    router.reload();
    setSubmitting(false);
  };

  const EditEducation = async (id, values, setSubmitting) => {
    await editMutation({
      variables: {
        educationHistoryData: {
          school: values.school,
          degree: values.degree,
          startDate: values.startDate,
          endDate: values.current === 'false' || values.current === false ? values.endDate : null,
          current:
            values.graduated === 'false' || values.graduated === false
              ? values.current.toString() === 'true'
                ? true
                : false
              : false,
          graduated:
            values.current === 'false' || values.current === false
              ? values.graduated.toString() === 'true'
                ? true
                : false
              : false,
          extracurricular: values.extracurricular,
          fieldOfStudy: values.fieldOfStudy,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Education successfully edited', false);
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddEducation(values, setSubmitting);
    } else {
      EditEducation(eventID, values, setSubmitting);
    }
  };

  return (
    <Modal
      title={
        isAdd
          ? t('profile:add_education_history_title')
          : `${`${t('profile:edit_education_history_title')} ${initdata.school}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={isAdd ? EDUCATION_HISTORY_STATE : initdata}
        validationSchema={EDUCATION_HISTORY_YUP}
        enableReinitialize
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
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
                            {t('profile:education_history_school')}
                          </label>
                          <input
                            value={values.school}
                            onChange={handleChange}
                            maxLength={100}
                            onBlur={handleBlur}
                            type='text'
                            name='school'
                            id='school'
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                          />
                          {touched.school && errors.school ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.school}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:education_history_field_of_study')}
                          </label>
                          <input
                            value={values.fieldOfStudy}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={100}
                            type='text'
                            name='fieldOfStudy'
                            id='fieldOfStudy'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.fieldOfStudy && errors.fieldOfStudy ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.fieldOfStudy}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('profile:education_history_degree')}
                          </label>
                          <input
                            value={values.degree}
                            maxLength={100}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='text'
                            name='degree'
                            id='degree'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.degree && errors.degree ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.degree}
                            </div>
                          ) : null}
                        </div>
                        {values?.current === false || values?.current?.toString() === 'false' ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='type'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('profile:education_history_graduated')}
                            </label>
                            <DropDownComponent
                              name='graduated'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.graduated}
                              options={SelectGraduatedOptions}
                            />
                            {touched.graduated && errors.graduated ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.graduated}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                            {t('profile:education_history_start_date')}
                          </label>
                          <input
                            value={values.startDate}
                            onChange={handleChange}
                            max={values.endDate}
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

                        {values?.graduated === false ||
                        values?.graduated?.toString() === 'false' ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='pub_type'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('profile:education_history_current')}
                            </label>
                            <DropDownComponent
                              name='current'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.current}
                              options={SelectCurrentOptions}
                            />

                            {touched.current && errors.current ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.current}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {values?.current === false || values?.current?.toString() === 'false' ? (
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='type'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('profile:education_history_end_date')}
                            </label>
                            <input
                              required
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
                            name={t('profile:education_history_extracurricular')}
                            value={values.extracurricular}
                            onChange={data => {
                              setFieldValue('extracurricular', data);
                            }}
                          />
                          {descLength}/750
                          {touched.extracurricular && errors.extracurricular ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.extracurricular}
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
export default EducationModal;
