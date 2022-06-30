import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {ORG_INVITE_MEMBERS, ORG_INVITE_MEMBERS_YUP} from 'constants/yup/organization';
import {Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import {useState} from 'react';
import IndexHeaderBar from './IndexHeaderBar';

const SpreadTheWord = () => {
  const {data: session} = useSession();

  const [tempArray, setTempArray] = useState<any>([]);
  const [inviteArray, setInviteArray] = useState<any>([]);
  const [showError, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState('');

  const [createPendingInvite] = useMutation(mutations.generateInviteLink);

  const submitHandler = async () => {
    try {
      setError('');
      await Promise.all(
        tempArray.map(async (invite: any) => {
          const response = await createPendingInvite({
            variables: {
              token: session?.accessToken,
              inviteeEmail: invite,
              inviteeName: invite,
            },
          });

          setShowSuccess('Invites generated successfully');
          setInviteArray(prevState =>
            prevState.concat(...inviteArray, {
              invite,
              message: response.data?.generateInviteLink.message,
            })
          );
          setTempArray([]);
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async values => {
    setShowSuccess('');
    setError('');
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const inValid = regex.exec(values);

    if (!inValid) {
      setError('Invalid email address');
      return;
    }
    if (tempArray.includes(values)) {
      setError('Email already in the list');
      return;
    }
    setError('');
    setTempArray(prevState => prevState.concat(values));
  };

  const handleRemoveEmail = async values => {
    setError('');
    if (tempArray.includes(values)) {
      setTempArray(prevState => prevState.filter(email => email !== values));
    }
  };

  const mailBody = person => `
Hello ${person?.invite},\n
Hope all is well. Not sure if you are already using a scheduling service, or are looking for a solution to enable your customers/prospects to schedule meetings with you without the back and forth for availability.\n
Here is the link you can click to activate your 30mins account: ${person?.message}
Once you activate you will get your own link. Typically, people add that link in their email signature. You may want to do the same.\n
And, not just this link, you can create many more service links like this. You can create paid services where the booker is charged a booking fee. The payment can be direct to you or you can offer via ESCROW thru us. You can also create recurring meetings, allowing bookers to optionally book weekly recurring meetings with you.\n
Best Regards`;

  return (
    <>
      <IndexHeaderBar />
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 mx-8'>
        <div className='flex items-center justify-center self-start'>
          <img src='/assets/spreadtheword.svg' alt='spreadTheWord' />
        </div>

        <div className='sm:overflow-hidden'>
          <div className='bg-white py-6 px-2'>
            <div>
              <Formik
                initialValues={ORG_INVITE_MEMBERS}
                validationSchema={ORG_INVITE_MEMBERS_YUP}
                onSubmit={submitHandler}
                enableReinitialize
              >
                {({values, handleChange}) => (
                  <Form>
                    <>
                      <div className='grid grid-cols-6 gap-2'>
                        <label htmlFor='email' className='sr-only'>
                          Email address
                        </label>
                        <div className='col-span-6 sm:col-span-6'>
                          <input
                            type='email'
                            onChange={handleChange}
                            name='email'
                            value={values.email}
                            className='shadow-sm focus:ring-mainBlue focus:border-mainBlue block w-full sm:text-sm border-gray-300 rounded-md'
                            placeholder='Enter an email'
                          />
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <button
                            type='button'
                            onClick={() => handleAdd(values.email)}
                            className='w-full flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mainBlue hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                          >
                            + Add to the list
                          </button>
                        </div>
                        <div className='col-span-6 sm:col-span-3'>
                          <button
                            type='submit'
                            disabled={tempArray?.length === 0}
                            className={`w-full disabled:opacity-50 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mainBlue hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
                          >
                            Generate Invite
                          </button>
                        </div>
                      </div>
                      <div className='flex flex-col pt-4 flex-1'>
                        <>
                          {showError ? (
                            <div className='text-red-500 mt-2 text-md font-normal text-center pb-4'>
                              {showError}
                            </div>
                          ) : null}
                          {showSuccess ? (
                            <div className='text-mainBlue mt-2 text-md font-normal text-center pb-4'>
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
                                  <button
                                    className='text-red-600'
                                    onClick={() => handleRemoveEmail(email)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                          </div>
                        </>
                      </div>
                    </>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <div className='px-10 mt-3'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          {inviteArray && inviteArray?.length > 0 && (
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    ></th>
                  </tr>
                </thead>

                <tbody className='bg-white divide-y divide-gray-200'>
                  {inviteArray &&
                    inviteArray?.map((person, idx) => (
                      <tr key={idx}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {person?.invite}
                        </td>
                        <td>
                          <div className='flex-shrink-0'>
                            <a
                              href={`mailto:${
                                person?.invite
                              }?subject=You're invited to join 30mins.com!&body=${encodeURIComponent(
                                mailBody(person)
                              )}`}
                            >
                              <button
                                type='button'
                                className='inline-flex items-center py-2 px-3 border border-transparent rounded-full bg-gray-100 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                              >
                                <span className='text-sm font-medium text-gray-900'>
                                  Send Invite
                                </span>
                              </button>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default SpreadTheWord;
