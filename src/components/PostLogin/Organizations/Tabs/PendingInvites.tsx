import queries from 'constants/GraphQL/Organizations/queries';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import inviteMutations from 'constants/GraphQL/Organizations/mutations';
import {useRouter} from 'next/router';

const PendingInvites = ({organization}) => {
  const {data: session} = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    const getInvites = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getPendingInvitesByOrgId,
        {token: session?.accessToken, organizationId: organization._id},
        session?.accessToken
      );
      setInviteData(data?.data?.getPendingInvitesByOrgId?.pendingInvites);
      setLoading(false);
    };
    getInvites();
  }, []);

  const handleDeleteInvite = async documentId => {
    try {
      await graphqlRequestHandler(
        inviteMutations.deletePendingInvite,
        {
          token: session?.accessToken,
          organizationId: organization._id,
          documentId,
        },
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <>
        <div className='flex loader justify-center items-center align-middle self-center'>
          <svg
            className='custom_loader -ml-1 mr-3 h-10 w-10 text-mainBlue'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        </div>
      </>
    );
  }
  return (
    <div className='flex flex-col px-0 py-2'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          {inviteData && inviteData?.length > 0 ? (
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Avatar
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className='bg-white divide-y divide-gray-200'>
                  {inviteData &&
                    inviteData?.map((person, idx) => (
                      <tr key={idx}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          <img
                            className='h-10 w-10 rounded-full object-cover'
                            src={
                              person?.inviteeUserId?.accountDetails?.avatar ||
                              '/assets/default-profile.jpg'
                            }
                            alt=''
                          />
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {person?.inviteeEmail}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <button
                            className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                            onClick={() => {
                              handleDeleteInvite(person._id);
                            }}
                          >
                            Delete Invite
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            'No pending invites'
          )}
        </div>
      </div>
    </div>
  );
};
export default PendingInvites;
