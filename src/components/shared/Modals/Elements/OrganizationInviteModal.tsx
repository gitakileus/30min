import {useEffect, useState} from 'react';
import {Formik, Form} from 'formik';
import {PencilAltIcon} from '@heroicons/react/solid';
import {ORG_INVITE_MEMBERS, ORG_INVITE_MEMBERS_YUP} from 'constants/yup/organization';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/Organizations/queries';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Modal from '../Modal';

const ServiceCategoryModal = () => {
  const {hideModal, store} = ModalContextProvider();
  const {data: session} = useSession();
  const {modalProps} = store || {};
  const {initData} = modalProps || {};
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState<any>([]);
  const [tempArray, setTempArray] = useState<any>([]);
  const [showError, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState('');

  useEffect(() => {
    setLoading(true);
    const getInvites = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getPendingInvitesByOrgId,
        {token: session?.accessToken, organizationId: initData._id},
        session?.accessToken
      );
      setInviteData(data?.data?.getPendingInvitesByOrgId?.pendingInvites);
    };
    getInvites();
    setLoading(false);
  }, []);

  const getInviteEmails = () => {
    const emails = inviteData.map((invite: any) => invite?.inviteeUserId?.accountDetails?.email);
    return emails;
  };
  const emailList = getInviteEmails();

  const {t} = useTranslation();
  const [createPendingInvite] = useMutation(mutations.createPendingInvite);

  const onSubmit = async () => {
    try {
      await Promise.all(
        tempArray.map(async (invite: any) => {
          await createPendingInvite({
            variables: {
              token: session?.accessToken,
              inviteeEmail: invite,
              organizationId: initData._id,
              organizationTitle: initData.title,
            },
          });
        })
      );
      setShowSuccess('Invites sent successfully');
      hideModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async values => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const inValid = regex.exec(values);

    if (!inValid) {
      setError('Invalid email address');
      return;
    }
    if (emailList.includes(values) || tempArray.includes(values)) {
      setError('Invite already sent to this email');
      return;
    }
    setError('');
    setTempArray(prevState => prevState.concat(values));
  };

  const handleRemoveEmail = async values => {
    if (tempArray.includes(values)) {
      setTempArray(prevState => prevState.filter(email => email !== values));
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal icon={PencilAltIcon} title={`Invite members for ${initData.title}`} medium>
      <div className='flex flex-wrap gap-8 items-center'>
        <div className='flex-1'>
          <Formik
            initialValues={ORG_INVITE_MEMBERS}
            validationSchema={ORG_INVITE_MEMBERS_YUP}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({values, handleChange}) => (
              <Form>
                <>
                  <div className='text-right'>
                    <button
                      type='button'
                      onClick={hideModal}
                      className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      {t('common:btn_cancel')}
                    </button>
                  </div>

                  <div className='mt-6 flex'>
                    <label htmlFor='email' className='sr-only'>
                      Email address
                    </label>

                    <input
                      type='email'
                      onChange={handleChange}
                      name='email'
                      value={values.email}
                      className='shadow-sm focus:ring-mainBlue focus:border-mainBlue block w-full sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter an email'
                    />
                    <button
                      type='button'
                      onClick={() => handleAdd(values.email)}
                      className='ml-4 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mainBlue hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      + Add to the list
                    </button>
                    <button
                      type='submit'
                      disabled={tempArray?.length === 0}
                      className={`disabled:opacity-50 ml-4 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mainBlue hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
                    >
                      Send invites
                    </button>
                  </div>
                </>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className='flex flex-col pt-4 flex-1'>
        {!loading ? (
          <>
            {showError ? (
              <div className='text-red-500 mt-2 text-md font-normal text-center pb-4'>
                {' '}
                {showError}
              </div>
            ) : null}{' '}
            {showSuccess ? (
              <div className='text-mainBlue mt-2 text-md font-normal text-center pb-4'>
                {' '}
                {showSuccess}
              </div>
            ) : null}
            <div className='max-h-64 overflow-y-auto '>
              {tempArray &&
                tempArray.map((email, index) => (
                  <div
                    key={index}
                    className='border-t border-b border-solid pl-4 relative py-4 w-full h-min flex justify-between'
                  >
                    <span>{email}</span>
                    <button className='text-red-600' onClick={() => handleRemoveEmail(email)}>
                      Remove
                    </button>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <span className='text-center text-xl pb-4'>Loading...</span>
        )}
      </div>
    </Modal>
  );
};
export default ServiceCategoryModal;
