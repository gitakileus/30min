import {Transition} from '@headlessui/react';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
  NOTIFICATION_ICONS_NAME,
  NOTIFICATION_BACKGROUND_COLOR,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';

const Notification = () => {
  const {
    actions: {hideNotification},
    state: data,
  } = useContext(NotificationContext);

  const {show, notificationType, message, delayed} = data;

  const [reveal, setReveal] = useState(false);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let collapseTimer: NodeJS.Timer;
    let collapseAfterTimer: NodeJS.Timer;

    const collapse = () => {
      setReveal(false);
      collapseTimer = setTimeout(hideNotification, 300);
    };
    const collapseAfter = (time: number) => setTimeout(collapse, time);

    const expand = () => {
      setReveal(true);
      collapseAfterTimer = collapseAfter(3000);
    };
    if (show) {
      const timer = setTimeout(expand, delayed ? 2000 : 0);

      return () => {
        hideNotification();
        clearTimeout(timer);
        clearTimeout(collapseTimer);
        clearTimeout(collapseAfterTimer);
      };
    }
  }, [show]);

  return message ? (
    <Transition appear show={reveal} as={Fragment}>
      <div className=' px-4 text-center'>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <div
            className={`flex items-center text-white max-w-sm w-full ${
              NOTIFICATION_BACKGROUND_COLOR[notificationType || NOTIFICATION_TYPES.success]
            } shadow-md rounded-lg overflow-hidden mx-auto fixed mt-12 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            style={{
              zIndex: '70',
            }}
          >
            <div className='w-10 border-solid border-r px-2'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d={`${NOTIFICATION_ICONS_NAME[notificationType || NOTIFICATION_TYPES.success]}`}
                ></path>
              </svg>
            </div>
            <div className='flex items-center px-2 py-3'>
              <div className='mx-3'>
                <p>
                  {NOTIFICATION_MESSAGES[message] ? NOTIFICATION_MESSAGES[message].node : message}{' '}
                </p>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  ) : null;
};

export default Notification;
