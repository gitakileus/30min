import {MenuAlt2Icon} from '@heroicons/react/outline';
import {useEffect, useState} from 'react';

type Props = {
  onCloseSidebar: () => void;
};

const Topbar = ({onCloseSidebar}: Props) => {
  const [scrollActive, setScrollActiveState] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScrollActiveState(window.scrollY > 20);
    });
  }, []);

  return (
    <>
      <div
        className={`z-30 sticky top-0 flex-shrink-0 flex h-12 lg:h-0 bg-white lg:border-none transition-all ${
          scrollActive ? 'bg-opacity-50 pb-4' : 'pt-0'
        }`}
      >
        <button
          type='button'
          className='px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden'
          onClick={onCloseSidebar}
        >
          <span className='sr-only'>Open sidebar</span>
          <MenuAlt2Icon className='h-6 w-6' aria-hidden='true' />
        </button>
      </div>
    </>
  );
};
export default Topbar;
