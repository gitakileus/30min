import {useRouter} from 'next/router';
import {ORG_KICK_MEMBER_STATE} from 'constants/yup/organization';
import {Formik, Form} from 'formik';
import {useSession} from 'next-auth/react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const KickOrganizationMember = () => {
  const router = useRouter();
  const {data: session} = useSession();
  const {t} = useTranslation();

  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {userIdToKick, itemID} = modalProps || {};

  const [kickMutation] = useMutation(mutations.kickOrganizationMember);

  async function onSubmit(values) {
    try {
      await kickMutation({
        variables: {
          token: session?.accessToken,
          organizationMembershipId: userIdToKick,
          organizationId: itemID,
          kickReason: values.reason,
        },
      });
      router.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal title={'Are you sure you want to kick this member?'} small>
      <Formik initialValues={ORG_KICK_MEMBER_STATE} enableReinitialize onSubmit={onSubmit}>
        {({isSubmitting, errors, values, touched, handleSubmit, handleChange}) => (
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
                  {t('common:btn_submit')}
                </button>
              </div>
              <div className='col-span-6'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                  {t('common:Reason')}
                </label>
                <div className='mt-1'>
                  <textarea
                    rows={4}
                    onChange={handleChange}
                    name='reason'
                    value={values.reason}
                    id='text'
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                  />
                </div>{' '}
                {touched.reason && errors.reason ? (
                  <div className='text-red-500 mt-2 text-sm font-normal'>{errors.reason}</div>
                ) : null}
              </div>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default KickOrganizationMember;
