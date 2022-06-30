import {useState} from 'react';
import {useRouter} from 'next/router';
import {Formik, Form} from 'formik';
import axios from 'axios';
import {JOIN_ORGANIZATION_YUP, JOIN_ORGANIZATION_STATE} from 'constants/yup/organization';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import Modal from '../Modal';

const JoinOrganizationModal = () => {
  const router = useRouter();

  const {data: session} = useSession();
  const [handlingJoinFor] = useState(null);
  const [submittingSearch, setSubmittingSearch] = useState(false);

  const [searchResults, setSearchResults] = useState<any>([]);
  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {joinedOrgIds} = modalProps;

  const [joinMutation] = useMutation(mutations.addOrganizationMember);
  const [requestJoin] = useMutation(mutations.createPendingJoinRequest);

  const [pendingRequest, setPendingRequest] = useState('');
  const {t} = useTranslation();

  async function onSubmit(values) {
    setSubmittingSearch(true);
    try {
      const response = await axios.post('/api/organizations/searchByTitle', {
        title: values.title,
      });
      setSearchResults(response.data.orgData.data.getOrganizationsByTitle.organizationData);
      setSubmittingSearch(false);
    } catch (err) {
      console.log(err);
    }
  }
  const handleJoin = async orgId => {
    await joinMutation({
      variables: {
        organizationId: orgId,
        token: session?.accessToken,
      },
    });
    router.reload();
  };

  const handleRequestJoin = async orgId => {
    const response = await requestJoin({
      variables: {
        organizationId: orgId,
        token: session?.accessToken,
      },
    });
    const {data} = response;
    if (data?.createPendingJoinRequest?.status === 409) {
      setPendingRequest(data?.createPendingJoinRequest?.message);
    } else {
      router.reload();
    }
  };

  return (
    <Modal title='Join Organization' small>
      <Formik
        initialValues={JOIN_ORGANIZATION_STATE}
        validationSchema={JOIN_ORGANIZATION_YUP}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({values, handleBlur, setFieldValue}) => {
          const handleChange = e => {
            const {name, value} = e.target;
            setFieldValue(name, value);
          };

          return (
            <Form>
              <div className='grid gird-flow-cols grid-cols-4 gap-4'>
                <div className='flex flex-col col-span-4'>
                  <div className='flex'>
                    <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                      Organization Name
                    </label>
                  </div>
                  <input
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type='text'
                    name='title'
                    id='title'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                  />
                </div>
                <div className='flex flex-row'>
                  <button
                    type='submit'
                    disabled={values.title.trim() === '' || submittingSearch}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 mr-6 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {submittingSearch ? 'Searching...' : 'Search'}
                  </button>
                  <button
                    type='submit'
                    onClick={() => {
                      hideModal();
                    }}
                    className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('common:btn_cancel')}
                  </button>
                </div>
              </div>
              {searchResults?.length > 0 ? (
                <div className='flex flex-col py-4'>
                  {searchResults.map(org => (
                    <div
                      key={org.id}
                      className='flex flex-col py-4 px-2 border-t border-b border-solid'
                    >
                      <div className='flex gap-4'>
                        <div className='w-16 h-16 rounded-md overflow-hidden'>
                          <img
                            src={org.image || '/default-profile.jpg'}
                            className='object-contain object-center w-full h-full'
                            alt='orgImage'
                          />
                        </div>
                        <div className='flex flex-col flex-1'>
                          <span>{org.title}</span>
                          <span className='text-sm'>{org.headline}</span>
                          {pendingRequest && pendingRequest ? (
                            <div className='text-red-500 mt-2 text-sm font-normal'>
                              {pendingRequest}
                            </div>
                          ) : null}
                          <button
                            type='button'
                            className='self-end disabled:opacity-50 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                            onClick={() => {
                              org.restrictionLevel === 'RESTRICTED'
                                ? handleRequestJoin(org._id)
                                : handleJoin(org._id);
                            }}
                            disabled={
                              org.restrictionLevel === 'LOCKED' || joinedOrgIds?.includes(org._id)
                            }
                          >
                            {handlingJoinFor === org._id
                              ? 'Joining...'
                              : joinedOrgIds?.includes(org._id)
                              ? 'Already Joined'
                              : org.restrictionLevel === 'LOCKED'
                              ? 'Locked'
                              : org.restrictionLevel === 'RESTRICTED'
                              ? 'Request Access'
                              : 'Join'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults === null ? (
                <div className='text-center font-bold text-2xl pt-4'>No results found...</div>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default JoinOrganizationModal;
