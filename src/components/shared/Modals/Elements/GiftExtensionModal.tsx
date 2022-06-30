import {useContext} from 'react';
import {useRouter} from 'next/router';
import TextField from 'components/shared/TextField/TextField';
import mutations from 'constants/GraphQL/ActiveExtension/mutations';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import ProductIDs from 'constants/stripeProductIDs';
import {NotificationContext} from 'store/Notification/Notification.context';
import {ExtenionGiftState, EXTENION_GIFT_YUP} from 'constants/yup/extension';
import {Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Modal from '../Modal';

const GiftExtensionModal = () => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const {data: session} = useSession();
  const router = useRouter();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const ExtenstionsList = [
    {key: t('common:organization'), value: ProductIDs.EXTENSIONS.ORGANIZATIONS},
    {key: t('common:zoom'), value: ProductIDs.EXTENSIONS.ZOOM},
    {key: t('common:send_a_message'), value: ProductIDs.EXTENSIONS.SEND_MESSAGE},
    {key: t('common:advertisement'), value: ProductIDs.EXTENSIONS.ADVERTISEMENT},
    {key: t('common:white_black_list'), value: ProductIDs.EXTENSIONS.WHITE_BLACK_LIST},
    {
      key: t('common:collective_availability'),
      value: ProductIDs.EXTENSIONS.COLLECTIVE_AVAILABILITY,
    },
  ];

  const ExtensionsPicker = ExtenstionsList.map(option => (
    <option key={option.key} value={option.key}>
      {option.key}
    </option>
  ));

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);

    const productId = ExtenstionsList.find(option => option.key === values.extensionTitle)?.value;

    const response = await graphqlRequestHandler(
      mutations.adminAddGiftedExtension,
      {
        extensionProductId: productId,
        extensionTitle: values.extensionTitle,
        userEmail: values.userEmail,
        token: session?.accessToken,
      },
      session?.accessToken
    );

    if (response.data?.data?.adminAddGiftedExtension?.status === 409) {
      setSubmitting(false);
      showNotification(
        NOTIFICATION_TYPES.error,
        `${t('common:Error')}: User Already has this Extension`,
        false
      );
    }
    if (response.data?.data?.adminAddGiftedExtension.status === 500) {
      setSubmitting(false);
      showNotification(
        NOTIFICATION_TYPES.error,
        `${t('common:Error')}: ${response.data.data.adminAddGiftedExtension?.message}`,
        false
      );
    }

    if (response.data?.data?.adminAddGiftedExtension?.status !== 200) {
      setSubmitting(false);
      showNotification(
        NOTIFICATION_TYPES.error,
        `${t('common:Error')}: ${response.data.data.adminAddGiftedExtension?.message}`,
        false
      );
      return;
    }

    showNotification(NOTIFICATION_TYPES.info, 'Extension successfully added', false);
    router.reload();
    setSubmitting(false);
  };

  return (
    <Modal medium>
      <Formik
        initialValues={ExtenionGiftState}
        validationSchema={EXTENION_GIFT_YUP}
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
          touched,
          isValid,
          submitCount,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className='mt-10'>
              {!isValid && submitCount > 0 && (
                <div className='text-red-500 mt-2 text-sm font-normal  mb-2'>form error</div>
              )}
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                  {t('common:select_extension')}
                </label>
                <div className='mt-1 rounded-md shadow-sm flex'>
                  <select
                    onChange={handleChange}
                    value={values.extensionTitle}
                    id='extensionTitle'
                    name='extensionTitle'
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                  >
                    {ExtensionsPicker}
                  </select>
                </div>
              </div>
              <div className='mt-5'>
                <TextField
                  label='User Email'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name='userEmail'
                  errors={errors}
                  touched={touched}
                  value={values.userEmail}
                />
              </div>
            </div>
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
                Send Gift
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default GiftExtensionModal;
