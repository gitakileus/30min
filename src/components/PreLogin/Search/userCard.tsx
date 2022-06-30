import {convert} from 'html-to-text';
import {useRouter} from 'next/router';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MailIcon} from '@heroicons/react/outline';
import useTranslation from 'next-translate/useTranslation';
import {ChatAlt2Icon} from '@heroicons/react/solid';

const UserCard = ({member}) => {
  const router = useRouter();
  const {showModal} = ModalContextProvider();
  const {t} = useTranslation();

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: member?.personalDetails?.name,
      providerEmail: member?.accountDetails?.email,
    });
  };

  const claimAccount = couponCode => {
    router.push({
      pathname: '/join/',
      query: {code: couponCode},
    });
  };
  return (
    <li
      className='mt-4 grid overflow-hidden grid-cols-6 grid-rows-7 gap-2 grid-flow-row w-auto shadow-md overflow-y-auto'
      key={member?._id}
    >
      <div className='box row-start-1 col-span-2 row-span-1'>
        <img
          src={
            member?.accountDetails.avatar
              ? member?.accountDetails.avatar
              : '/assets/default-profile.jpg'
          }
          alt='avatar'
          className='w-36 h-36 object-cover object-center'
        />
      </div>

      <div className='box col-start-3 col-span-4 w-full flex flex-col overflow-y-auto px-2'>
        <h2 className='text-md font-bold text-black'>{member?.personalDetails?.name}</h2>
        <h4 className='mb-2 text-xs font-bold tracking-tight text-gray-900'>
          {member?.personalDetails?.headline ? (
            <div className='line-clamp-3'>{member?.personalDetails?.headline}</div>
          ) : (
            ''
          )}
        </h4>
        <p className='line-clamp-4 text-xs'> {convert(member?.personalDetails?.description)}</p>
      </div>

      <div className='col-span-3 flex gap-2 px-2 py-2 text-mainBlue'>
        <a href={`/${member?.accountDetails?.username}`} target='_blank' rel='noreferrer'>
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
            href={`/${member?.accountDetails?.username}`}
            className='text-xs tracking-tight font-bold'
            title={t('common:view_profile')}
          >
            {t('common:view_profile')}
          </a>
        </div>

        <div className='flex text-mainBlue items-center justify-center '>
          {member?.accountDetails?.verifiedEmail ? (
            <a
              href={`/${member?.accountDetails?.username}`}
              className='text-xs tracking-tight font-bold'
            >
              {t('common:my_services')}
            </a>
          ) : (
            <button
              className='text-xs tracking-tight font-bold'
              onClick={() => claimAccount(member?.couponCode)}
            >
              {t('profile:Claim_ac')}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
export default UserCard;
