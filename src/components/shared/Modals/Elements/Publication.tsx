import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {PlusIcon} from '@heroicons/react/solid';
import {PUBLICATION_STATE, PUBLICATION_YUP} from 'constants/yup/publication';
import {Form, Formik} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Publications/mutations';
import {useSession} from 'next-auth/react';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import UploadImage from 'components/shared/UploadImage/UploadImage';
import queries from 'constants/GraphQL/Publications/queries';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {useRouter} from 'next/router';
import Loader from 'components/shared/Loader/Loader';
import dynamic from 'next/dynamic';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const Publication = () => {
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {pubID} = modalProps || {};

  const isAdd = !pubID;
  const [publicationData, setPublicationData] = useState<Object>([]);
  const {data: session} = useSession();
  const [loading, setLoading] = useState(false);
  const [createMutation] = useMutation(mutations.createPublication);
  const [editMutation] = useMutation(mutations.editPublication);
  const router = useRouter();
  const [PubImage, setImage] = useState('');
  const [imageError, setErrorimage] = useState('');
  const {t} = useTranslation();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  useEffect(() => {
    setLoading(true);
    const getServiceData = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getPublicationById,
        {documentId: pubID, token: session?.accessToken},
        session?.accessToken
      );
      setPublicationData(data);
    };

    if (pubID !== undefined) {
      getServiceData();
    }
    setLoading(false);
  }, [pubID]);

  const pubData =
    publicationData &&
    Object.values(publicationData).map(
      publication => publication?.getPublicationById?.publicationData
    );

  const publicationValues = pubData?.reduce(
    (acc, cur) => ({
      ...acc,
      ...cur,
    }),
    {}
  );

  const [descLength, setDescLength] = useState(
    publicationValues?.description
      ? (publicationValues.description || '')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .replace(/&nbsp;/gi, ' ').length - 7
      : 0
  );

  useEffect(() => {
    setImage(publicationValues?.image);
  }, [publicationValues?.image]);

  const AddPublication = async (values, setSubmitting) => {
    if (PubImage === ' ' || PubImage === '' || PubImage === null || PubImage === undefined) {
      setErrorimage('Please upload an image');
      setSubmitting(false);
      return;
    }

    await createMutation({
      variables: {
        publicationData: {
          headline: values.headline,
          url: values.url,
          type: values.type,
          description: values.description,
          image: PubImage,
        },
        token: session?.accessToken,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Publication successfully added', false);
    router.reload();
    setSubmitting(false);
  };

  const EditPublication = async (id, values, setSubmitting) => {
    if (PubImage === ' ' || PubImage === '' || PubImage === null || PubImage === undefined) {
      setErrorimage('Please upload an image');
      setSubmitting(false);
      return;
    }

    await editMutation({
      variables: {
        publicationData: {
          headline: values.headline,
          url: values.url,
          type: values.type,
          description: values.description,
          image: PubImage,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    showNotification(NOTIFICATION_TYPES.info, 'Publication successfully edited', false);
    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddPublication(values, setSubmitting);
    } else {
      EditPublication(pubID, values, setSubmitting);
    }
  };

  const {hideModal} = ModalContextProvider();

  const [mutateImageUpload] = useMutation(singleUpload);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];

    try {
      if (valid) {
        const response = await mutateImageUpload({
          variables: {
            file: image,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          showNotification(NOTIFICATION_TYPES.error, 'Maximum size allowed is 2MB', false);
          setErrorimage('Maximum size allowed is 2MB');
          return;
        }
        setErrorimage('');
        setImage(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        showNotification(NOTIFICATION_TYPES.error, 'Maximum size allowed is 2MB', false);
        setErrorimage('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const handleFileEDIT = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];
    try {
      if (valid) {
        const response = await mutateImageUpload({
          variables: {
            uploadType: 'EDIT_PUBLICATION_IMAGE',
            documentId: pubID,
            file: image,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          setErrorimage('Maximum size allowed is 2MB');
          return;
        }
        setErrorimage('');
        setImage(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        setErrorimage('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const SelectOptions = [
    {key: t('profile:Book'), value: 'Book'},
    {key: t('profile:eBook'), value: 'eBook'},
    {key: t('profile:Whitepaper'), value: 'Whitepaper'},
    {key: t('profile:Patent'), value: 'Patent'},
    {key: t('profile:Other'), value: 'Other'},
  ];
  const PublicationType = SelectOptions.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal
      title={
        isAdd
          ? t('profile:Add_public')
          : `${`${t('profile:Edit_public')} ${publicationValues.headline}`}`
      }
      icon={<PlusIcon className='h-6 w-6 text-blue-600' aria-hidden='true' />}
    >
      <Formik
        initialValues={isAdd ? PUBLICATION_STATE : publicationValues}
        validationSchema={PUBLICATION_YUP}
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
                            {t('profile:Headline')}
                          </label>
                          <input
                            value={values.headline}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={254}
                            type='text'
                            name='headline'
                            id='headline'
                            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                          />
                          {touched.headline && errors.headline ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.headline}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label
                            htmlFor='mediaLink'
                            className='block text-sm font-medium text-gray-700'
                          >
                            {t('Url')}
                          </label>
                          <input
                            value={values.url}
                            maxLength={100}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type='text'
                            name='url'
                            id='url'
                            className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          />
                          {touched.url && errors.url ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.url}
                            </div>
                          ) : null}
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <label className='mt-2 block text-sm font-medium text-gray-700'>
                            {t('profile:Pub_image')}
                          </label>
                          {PubImage ? (
                            <UploadImage
                              title={t('profile:Pub_image')}
                              description={t('common:desc_required')}
                              uploadText={t('profile:upload_img')}
                              uploaded={true}
                              handleChange={isAdd ? handleFileChange : handleFileEDIT}
                              imagePath={
                                typeof PubImage === 'string'
                                  ? PubImage
                                  : URL.createObjectURL(PubImage)
                              }
                            />
                          ) : (
                            <UploadImage
                              title={t('profile:Pub_image')}
                              description={t('common:desc_required')}
                              uploadText={t('profile:upload_img')}
                              handleChange={isAdd ? handleFileChange : handleFileEDIT}
                              uploaded={false}
                            />
                          )}

                          {touched.image && errors.image ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.image}
                            </div>
                          ) : null}
                          {imageError ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {imageError}
                            </div>
                          ) : null}
                        </div>

                        <div className='col-span-6 sm:col-span-3'>
                          <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                            {t('profile:pub_type')}
                          </label>
                          <select
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id='type'
                            name='type'
                            className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                          >
                            {PublicationType}
                          </select>
                          {touched.type && errors.type ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {errors.type}
                            </div>
                          ) : null}
                        </div>
                        <div className=' col-span-6'>
                          {t('common:Description')}
                          <CKEditor
                            name={t('common:Description')}
                            setDescLength={setDescLength}
                            value={values.description}
                            onChange={data => {
                              setFieldValue('description', data);
                            }}
                          />
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
                </div>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default Publication;
