import {useEffect, useState} from 'react';

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  const Accept = () => {
    localStorage.setItem('cookiesConsent', 'true');
    setShow(false);
  };

  useEffect(() => {
    const cookiesConsent = document.cookie;

    if (Object.keys(cookiesConsent).length <= 1) {
      localStorage.setItem('cookiesConsent', 'false');
      setShow(true);
    }
  }, []);

  return show ? (
    <div className='flex flex-col justify-center'>
      <div className='z-50 transition duration-200 transform ease scale-90 max-w-screen-lg mx-auto fixed bg-white inset-x-5 p-5 bottom-2 rounded-lg drop-shadow-2xl flex gap-4 flex-wrap md:flex-nowrap text-center md:text-left items-center justify-center md:justify-between'>
        <div className='w-full'>
          We use cookies on our website to give you the most relevant experience by remembering your
          preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the
          cookies.
        </div>
        <div className='flex gap-4 items-center flex-shrink-0'>
          <button className='text-mainBlue focus:outline-none hover:underline' onClick={Accept}>
            Decline
          </button>
          <button
            className='bg-mainBlue px-5 py-2 text-white rounded-md hover:bg-blue-700 focus:outline-none'
            onClick={Accept}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
export default CookieConsent;
