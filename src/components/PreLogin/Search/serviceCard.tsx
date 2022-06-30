import useTranslation from 'next-translate/useTranslation';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MailIcon} from '@heroicons/react/outline';
import {ChatAlt2Icon} from '@heroicons/react/solid';

const Services = ({service}) => {
  const serviceUrl = `${window.origin}/${service?.userId?.accountDetails?.username}/${service?.slug}`;
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: service?.userId?.personalDetails?.name,
      providerEmail: service?.userId?.accountDetails?.email,
    });
  };

  return (
    <a href={serviceUrl}>
      <li
        className='mt-4 grid overflow-hidden grid-cols-6 grid-rows-7 gap-2 grid-flow-row w-auto shadow-md overflow-y-auto'
        key={service.id}
      >
        <div className='row-start-1 col-span-2 row-span-1'>
          <img
            src={
              service?.userId?.accountDetails.avatar
                ? service?.userId?.accountDetails.avatar
                : '/assets/default-profile.jpg'
            }
            alt='avatar'
            className='w-36 h-36 object-cover object-center'
          />
        </div>

        <div className='box col-start-3 col-span-4 w-full flex flex-col overflow-y-auto px-2'>
          <div className='flex justify-between'>
            <h2 className='text-md font-bold text-black'>{service.title}</h2>
            <h2 className='text-md font-bold text-mainBlue mr-1'>
              {service?.price > 0 ? `${service?.currency}${service?.price}` : t('event:Free')}
            </h2>
          </div>
          <p className='line-clamp-3 text-sm text-gray-500 font-bold'>
            {service?.userId?.personalDetails?.name
              ? `By ${service?.userId?.personalDetails?.name}`
              : null}
            {service?.userId?.personalDetails?.headline
              ? `, ${service?.userId?.personalDetails?.headline}`
              : null}
          </p>
          <p className='line-clamp-4 text-xs'>
            {service.description ? (
              <div
                className={`custom break-words `}
                dangerouslySetInnerHTML={{__html: service.description}}
              />
            ) : null}
          </p>
        </div>

        <div className='col-span-3 flex gap-2 px-2 py-2 text-mainBlue'>
          <a
            href={`/${service?.userId?.accountDetails?.username}`}
            target='_blank'
            rel='noreferrer'
          >
            <img src='/assets/logo.svg' alt='logo' className='w-5 h-5 sm:h-7 sm:w-7 mr-1' />
          </a>

          <a href='#' className='text-xs tracking-tight font-bold' title={t('common:live_chat')}>
            <ChatAlt2Icon className='w-5 h-5 sm:h-7 sm:w-7 text-mainBlue cursor-pointer' />
          </a>

          <a href={`#`} className='text-xs tracking-tight font-bold' title={t('common:message_me')}>
            <MailIcon
              className='w-5 h-5 sm:h-7 sm:w-7 text-mainBlue cursor-pointer'
              onClick={sendMessageExtension}
            />
          </a>
        </div>

        <div className='flex justify-end mr-2 gap-2 col-start-4 col-span-3 '>
          <div className='flex text-mainBlue items-center justify-center'>
            <a
              href={serviceUrl}
              className='text-xs tracking-tight font-bold'
              title={t('common:view_service')}
            >
              {t('common:view_service')}
            </a>
          </div>
        </div>
      </li>
    </a>
  );
};
export default Services;
