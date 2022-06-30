import dayjs from 'dayjs';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import queries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Layout from 'components/Layout/PostLogin';
import Loader from 'components/shared/Loader/Loader';
import {ChevronRightIcon} from '@heroicons/react/solid';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import Link from 'next/link';

dayjs.extend(utc);
dayjs.extend(timezone);

const MeetingDetails = ({meeting, user}) => {
  const {status} = useSession();

  const {showModal} = ModalContextProvider();
  const User = user?.data?.getUserById?.userData;
  const userTimezone = User?.locationDetails?.timezone;
  const {t} = useTranslation();

  const meetingDetails = meeting?.data?.getBookingById?.bookingData;
  const meetingStatus = meeting?.data?.getBookingById?.bookingData?.status;

  const isProvider = () => User._id === meetingDetails.provider;
  const isClient = () => User._id === meetingDetails.booker;

  const meetingDateUTC = isProvider()
    ? dayjs(meetingDetails.meetingDate).utc().tz(userTimezone)
    : isClient()
    ? dayjs(meetingDetails.meetingDate).utc().tz(meetingDetails?.bookerTimeZone)
    : dayjs(meetingDetails.meetingDate).utc().tz(userTimezone);

  const meetingStartTime = isProvider()
    ? dayjs(meetingDetails.startTime).utc().tz(userTimezone)
    : isClient()
    ? dayjs(meetingDetails.startTime).utc().tz(meetingDetails?.bookerTimeZone)
    : dayjs(meetingDetails.startTime).utc().tz(userTimezone);

  const showComplete = () =>
    dayjs().isAfter(meetingDateUTC) &&
    isProvider() &&
    !meetingStatus?.providerConfirmed &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined;

  const showConfirm = () =>
    dayjs().isAfter(meetingDateUTC) &&
    isClient() &&
    !meetingStatus.hasOpenReport &&
    !meetingStatus.clientConfirmed &&
    !meetingStatus.providerConfirmed &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.providerDeclined &&
    !meetingStatus.clientCanceled;

  const showRefund = () =>
    dayjs().isAfter(meetingDateUTC) &&
    !meetingStatus.refundRequested &&
    !meetingStatus.clientConfirmed &&
    !meetingStatus.providerConfirmed &&
    meetingDetails.price > 0 &&
    isClient();

  const showCancel = () =>
    dayjs().isBefore(meetingDateUTC) &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.providerDeclined &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined;

  const showDecline = () =>
    dayjs().isBefore(meetingDateUTC) &&
    !meetingStatus.providerCanceled &&
    !meetingStatus.clientCanceled &&
    !meetingStatus.providerDeclined &&
    User._id === meetingDetails.provider;

  const showReport = () =>
    dayjs().isAfter(meetingDateUTC) &&
    isClient() &&
    !meetingStatus.hasOpenReport &&
    !meetingStatus.clientConfirmed;

  const showButtonBar = () =>
    showComplete() ||
    showConfirm() ||
    showReport() ||
    showCancel() ||
    showRefund() ||
    showDecline();

  const getStatus = () => {
    if (meetingStatus.refunded) {
      return 'Refunded';
    }
    if (meetingStatus.refundRequested && meetingStatus.clientCanceled && meetingDetails.price > 0) {
      return 'Client cancelled & Refund Requested';
    }
    if (meetingStatus.refundRequested && meetingStatus.clientCanceled) {
      return 'Client cancelled';
    }
    if (
      meetingStatus.refundRequested &&
      meetingStatus.providerCanceled &&
      meetingDetails.price > 0
    ) {
      return 'Provider cancelled & Refund Requested';
    }
    if (meetingStatus.refundRequested && meetingStatus.providerCanceled) {
      return 'Provider cancelled';
    }
    if (meetingStatus.hasOpenReport) {
      return 'reported';
    }
    if (meetingStatus.providerCanceled) {
      return 'provider canceled';
    }
    if (meetingStatus.providerDeclined) {
      return 'provider declined';
    }
    if (meetingStatus.clientCanceled) {
      return 'client canceled';
    }
    if (meetingStatus.clientConfirmed) {
      return 'client confirmed';
    }
    if (meetingStatus.providerConfirmed) {
      return 'provider confirmed';
    }
    return 'pending';
  };

  if (status === 'loading') {
    return <Loader />;
  }
  return (
    <ProtectedRoute status={status}>
      <Layout>
        <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
          <div className='flex-1 min-w-0'>
            <nav className='flex' aria-label='Breadcrumb'>
              <ol role='list' className='flex items-center space-x-4'>
                <li>
                  <div className='flex'>
                    <a href={'/'} className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                      {t('page:Home')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <Link href='/user/meetings' passHref>
                      <a className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                        {t('common:txt_my_meetings')}
                      </a>
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
              {meetingDetails.title}
            </h2>
          </div>
        </div>
        <div className='flex flex-col items-center py-4 w-full h-full gap-8'>
          {showButtonBar() ? (
            <div className='flex gap-4 w-full justify-center sm:justify-start flex-wrap bg-white rounded-md py-3 px-4 shadow-md'>
              {showCancel() ? (
                <button
                  type='button'
                  onClick={() => {
                    showModal(MODAL_TYPES.MEETINGS, {
                      mode: 'cancel',
                      meetingData: meetingDetails,
                      title: 'Cancel Meeting',
                      labelTitle: 'Reason for Cancel',
                    });
                  }}
                  className='bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
                >
                  {t('common:txt_cancel_met')}
                </button>
              ) : null}

              {showDecline() ? (
                <button
                  type='button'
                  onClick={() => {
                    showModal(MODAL_TYPES.MEETINGS, {
                      mode: 'decline',
                      meetingData: meetingDetails,
                      title: 'Decline Meeting',
                      labelTitle: 'Reason for Decline',
                    });
                  }}
                  className='bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
                >
                  {t('common:txt_decline_met')}
                </button>
              ) : null}

              {showComplete() ? (
                <button
                  type='button'
                  onClick={() => {
                    showModal(MODAL_TYPES.MEETINGS, {
                      mode: 'complete',
                      meetingData: meetingDetails,
                      title: 'Complete Meeting',
                      labelTitle: 'Meeting Notes',
                    });
                  }}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('meeting:Complete Meeting')}
                </button>
              ) : null}

              {showConfirm() ? (
                <button
                  type='button'
                  onClick={() => {
                    showModal(MODAL_TYPES.MEETINGS, {
                      mode: 'confirm',
                      meetingData: meetingDetails,
                      title: 'Confirm Meeting Completion',
                      labelTitle: 'Meeting Notes',
                    });
                  }}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  {t('meeting:Confirm Meeting Completion')}
                </button>
              ) : null}

              {showReport() ? (
                <button
                  type='button'
                  onClick={() => {
                    showModal(MODAL_TYPES.MEETINGS, {
                      mode: 'report',
                      meetingData: meetingDetails,
                      title: 'Report Meeting',
                      labelTitle: 'Reason for Report',
                    });
                  }}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  Report Meeting
                </button>
              ) : null}

              {showRefund() ? (
                <button
                  type='button'
                  onClick={() => {
                    showModal(MODAL_TYPES.MEETINGS, {
                      mode: 'refund',
                      meetingData: meetingDetails,
                      title: 'Refund Meeting',
                      labelTitle: 'Reason for Refund',
                    });
                  }}
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                >
                  Request Refund
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className='flex flex-col'>
          <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
              <div className='shadow overflow-hidden sm:rounded-lg'>
                <table className='min-w-full'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:provider_name')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:provider_email')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:client_name')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:client_email')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_date')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_time')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_cost')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:payment_status')}
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        {t('meeting:meeting_status')}
                      </th>
                      {meetingStatus.reportReason ? (
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                        >
                          {t('meeting:report_reason')}
                        </th>
                      ) : null}
                      {meetingStatus.refundRequestReason ? (
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36'
                        >
                          {t('meeting:refund_request_reason')}
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.providerName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.providerEmail}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.bookerName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.bookerEmail}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {dayjs(meetingDateUTC).format('dddd DD MMMM YYYY')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {dayjs(meetingStartTime).format('hh:mm A')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.price > 0 ? `$${meetingDetails.price}` : t('event:Free')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {meetingDetails.price > 0
                          ? meetingDetails.paymentStatus
                          : t('profile:txt_media_type_none')}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {getStatus()}
                      </td>
                      {meetingStatus.reportReason ? (
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {meetingStatus.reportReason}
                        </td>
                      ) : null}
                      {meetingStatus.refundRequestReason ? (
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {meetingStatus.refundRequestReason}
                        </td>
                      ) : null}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};
export default MeetingDetails;
MeetingDetails.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }
  const {data: meeting} = await graphqlRequestHandler(
    queries.getBookingById,
    {
      documentId: context.query.meetingDetails,
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  if (meeting?.data?.getBookingById?.bookingData === null) {
    return {
      notFound: true,
    };
  }
  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );
  const isWelcome = user?.data?.getUserById?.welcomeComplete;
  if (isWelcome) {
    return {
      redirect: {destination: '/user/welcome', permanent: false},
    };
  }
  return {
    props: {
      meeting,
      user,
    },
  };
};
