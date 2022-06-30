import {useEffect, useState} from 'react';
import {PlusIcon} from '@heroicons/react/solid';
import {CHARITY_STATE, CHARITY_YUP} from 'constants/yup/charity';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {useRouter} from 'next/router';
import Loader from 'components/shared/Loader/Loader';
import queries from 'constants/GraphQL/Charity/queries';
import mutations from 'constants/GraphQL/Charity/mutations';
import Modal from '../Modal';

const Charity = () => {
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {charityID} = modalProps || {};

  const isAdd = !charityID;
  const [charityData, setCharityData] = useState<Object>([]);
  const {data: session} = useSession();
  const [loading, setLoading] = useState(false);
  const [createMutation] = useMutation(mutations.createCharity);
  const [editMutation] = useMutation(mutations.updateCharity);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getCharityData = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getCharityById,
        {documentId: charityID, token: session?.accessToken},
        session?.accessToken
      );
      setCharityData(data);
    };

    if (charityID !== undefined) {
      getCharityData();
    }
    setLoading(false);
  }, [charityID]);

  const pubData =
    charityData && Object.values(charityData).map(service => service?.getCharityById?.charityData);

  const charityValues = pubData?.reduce(
    (acc, cur) => ({
      ...acc,
      ...cur,
    }),
    {}
  );

  const AddCharity = async (values, setSubmitting) => {
    await createMutation({
      variables: {
        charityData: {
          name: values.name,
          taxID: values.taxID,
          description: values.description,
          website: values.website,
        },
        token: session?.accessToken,
      },
    });
    router.reload();
    setSubmitting(false);
  };

  const EditCharity = async (id, values, setSubmitting) => {
    await editMutation({
      variables: {
        charityData: {
          name: values.name,
          taxID: values.taxID,
          description: values.description,
          website: values.website,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });

    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddCharity(values, setSubmitting);
    } else {
      EditCharity(charityID, values, setSubmitting);
    }
  };

  const {hideModal} = ModalContextProvider();
  const {t} = useTranslation();

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal
      title={
        isAdd
          ? t('setting:txt_add_new_charity')
          : `${`${t('setting:Edit_charity')} ${charityValues.name}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
      small
    >
      <Formik
        initialValues={isAdd ? CHARITY_STATE : charityValues}
        validationSchema={CHARITY_YUP}
        enableReinitialize
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
      >
        {({isSubmitting, values, handleChange, handleBlur, handleSubmit, touched, errors}) => (
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
                      <div className='px-4 py-5 bg-white sm:p-6'>
                        <div className='grid grid-cols-6 gap-6'>
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='first-name'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('setting:Name')}
                            </label>
                            <input
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={50}
                              type='text'
                              name='name'
                              id='name'
                              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                            />
                            {touched.name && errors.name ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.name}
                              </div>
                            ) : null}
                          </div>
                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='mediaLink'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('setting:tax_id')}
                            </label>
                            <input
                              value={values.taxID}
                              onChange={handleChange}
                              maxLength={50}
                              onBlur={handleBlur}
                              type='text'
                              name='taxID'
                              id='taxID'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                            {touched.taxID && errors.taxID ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.taxID}
                              </div>
                            ) : null}
                          </div>

                          <div className='col-span-6 sm:col-span-3'>
                            <label
                              htmlFor='mediaLink'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('setting:website')}
                            </label>
                            <input
                              value={values.website}
                              onChange={handleChange}
                              maxLength={50}
                              onBlur={handleBlur}
                              type='text'
                              name='website'
                              id='website'
                              className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            />
                            {touched.website && errors.website ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {errors.website}
                              </div>
                            ) : null}
                          </div>

                          <div className=' col-span-6'>
                            <label
                              htmlFor='description'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {t('common:Description')}
                            </label>
                            <div className='mt-1'>
                              <textarea
                                rows={4}
                                onChange={handleChange}
                                name='description'
                                value={values.description}
                                maxLength={750}
                                id='description'
                                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                              />
                              {touched.description && errors.description ? (
                                <div className='text-red-500 mt-2 text-sm font-normal'>
                                  {errors.description}
                                </div>
                              ) : null}
                            </div>
                          </div>
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
export default Charity;
