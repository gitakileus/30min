import {useState} from 'react';
import {Formik, Form} from 'formik';
import {PencilAltIcon} from '@heroicons/react/solid';
import {ORG_SERVICE_CATEGORY_STATE, ORG_SERVICE_CATEGORY_YUP} from 'constants/yup/organization';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import {MODAL_TYPES} from 'constants/context/modals';
import Modal from '../Modal';

const OrganizationInviteModal = () => {
  const {hideModal, store} = ModalContextProvider();
  const {data: session} = useSession();
  const {modalProps} = store || {};
  const {initData} = modalProps || {};

  const router = useRouter();
  const [serviceCategories] = useState(initData.serviceCategories);

  const {t} = useTranslation();
  const {showModal} = ModalContextProvider();
  const [deleteMutation] = useMutation(mutations.removeOrganizationServiceCategory);
  const [createCategory] = useMutation(mutations.addOrganizationServiceCategory);

  const handleDeleteService = async categoryTitle => {
    await deleteMutation({
      variables: {
        organizationId: initData._id,
        categoryData: categoryTitle,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const deleteConfirmation = (categoryId, categoryName) => {
    hideModal();
    showModal(MODAL_TYPES.DELETE, {
      name: categoryName,
      id: categoryId,
      handleDelete: () => {
        handleDeleteService(categoryId);
      },
    });
  };

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    await createCategory({
      variables: {
        organizationId: initData._id,
        categoryData: values.title,
        token: session?.accessToken,
      },
    });
    router.reload();
    setSubmitting(false);
  };

  return (
    <Modal
      icon={PencilAltIcon}
      title={`Manage Service Categories for ${initData.title}`}
      extraSmall
    >
      <div className='flex flex-wrap gap-8 items-center'>
        <div className='flex-1'>
          <Formik
            initialValues={ORG_SERVICE_CATEGORY_STATE}
            validationSchema={ORG_SERVICE_CATEGORY_YUP}
            onSubmit={(values, {setSubmitting}) => {
              submitHandler(values, setSubmitting);
            }}
            enableReinitialize
          >
            {({values, errors, touched, handleBlur, isSubmitting, setFieldValue}) => {
              const handleChange = e => {
                const {name, value} = e.target;
                setFieldValue(name, value);
              };

              return (
                <Form>
                  <>
                    <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
                      <button
                        type='submit'
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

                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col'>
                        <div className='flex'>
                          <label
                            htmlFor='first-name'
                            className='block text-sm font-medium text-gray-700'
                          >
                            Category Title
                          </label>
                        </div>
                        <input
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={160}
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
                    </div>
                  </>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
      <div className='flex flex-col pt-4 flex-1'>
        {serviceCategories.length > 0 ? (
          <span className='text-center text-xl pb-4'>Current Categories</span>
        ) : null}
        <div className='max-h-64 overflow-y-auto'>
          {serviceCategories.map((category, index) => (
            <div
              key={index}
              className='border-t border-b border-solid pl-4 relative py-4 w-full h-min'
            >
              <span>{category}</span>

              <button
                className='absolute top-4 right-2 hover:text-red-600 duration-200 disabled:opacity-20'
                onClick={() => {
                  deleteConfirmation(category, category);
                }}
              >
                {t('common:Delete_record')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
export default OrganizationInviteModal;
