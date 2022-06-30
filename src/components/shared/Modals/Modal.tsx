import React, {PropsWithChildren} from 'react';

type Props = PropsWithChildren<{
  icon?: any;
  title?: string;
  medium?: Boolean;
  small?: Boolean;
  extraSmall?: Boolean;
}>;

const Modal = ({title, children, medium, small, extraSmall}: Props) => (
  <>
    <div
      className='fixed inset-0 overflow-y-auto'
      style={{
        maxHeight: '100vh',
        paddingRight: '10px',
        paddingLeft: '10px',
        zIndex: '60',
      }}
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div className='relative min-h-screen max-h-screen text-center flex justify-center items-center'>
        <div
          className='fixed h-screen w-screen inset-0 bg-black bg-opacity-50 transition-opacity max-h-screen'
          aria-hidden='true'
        ></div>
        <div
          className={`inline-block bg-white rounded-lg px-4  pb-4 text-left shadow-xl transform transition-all overflow-y-scroll md:overflow-auto lg:overflow-auto md:overflow-x-hidden lg:overflow-x-hidden align-middle max-w-4xl w-full p-6 sm:my-8 sm:align-middle sm:max-w-4xl`}
          style={{
            maxHeight: '80vh',
            width: medium ? '550px' : small ? '400px' : extraSmall ? '340px' : '100%',
          }}
        >
          <div className='sm:flex sm:items-start'>
            <h3 className='text-lg leading-6 font-bold text-gray-900 justify-center align-middle w-full text-left'>
              {title}
            </h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  </>
);
export default Modal;
