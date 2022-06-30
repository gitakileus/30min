import {createRef, useEffect, useState} from 'react';

import {GlobeIcon} from '@heroicons/react/outline';

const Publications = ({item}: {item: any}) => {
  const [show, setShow] = useState<boolean>(false);
  const [lineHeight, setLineHeight] = useState<number>(3);

  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    const divHeight = ref.current ? ref.current.offsetHeight : 0;
    const height = ref.current ? parseInt(getComputedStyle(ref.current).lineHeight, 10) : 0;
    const lines = Math.floor(divHeight / height);
    setLineHeight(lines);
  }, []);

  return (
    <li
      className='flex flex-row flex-wrap items-center bg-white mb-2 rounded-md py-3 px-4 w-full list-none overflow-hidden'
      key={item}
    >
      <div className={`w-full md:w-1/6 justify-center text-center`}>
        {item.image ? (
          <div className='w-36 h-36 rounded-md overflow-hidden'>
            <img
              className='w-full h-full object-cover object-center'
              src={item?.image}
              alt='avatar'
            />
          </div>
        ) : (
          ''
        )}
      </div>
      <div className={`text-left w-full md:w-5/6 mt-3`}>
        {item.headline ? (
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>{item.headline}</h1>
        ) : (
          ''
        )}
        <a href={item.url} target='_blank' rel='noreferrer'>
          <GlobeIcon className='w-6 h-6' />
        </a>
        <div
          className={`w-full break-words  ${lineHeight > 3 && 'line-clamp-3'}  ${
            show && 'line-clamp-none'
          } `}
          key='key'
          ref={ref}
        >
          {item.description ? (
            <div
              className={`custom break-words`}
              dangerouslySetInnerHTML={{__html: item.description}}
            />
          ) : null}
        </div>
        {lineHeight > 3 && (
          <div
            onClick={() => setShow(!show)}
            className='mt-1 text-black font-bold hover:underline cursor-pointer'
          >
            {show ? 'Hide' : 'More'}
          </div>
        )}
      </div>
    </li>
  );
};
export default Publications;
