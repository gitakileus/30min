import {useState, createRef, useEffect} from 'react';

const Education = ({item}: {item: any}) => {
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
      className='overflow-hidden break-words flex flex-col flex-wrap bg-white mb-2 rounded-md py-3 px-4 w-full list-none'
      key={item.id}
    >
      <div className='mt-3 font-bold'>
        {item.school} - {item.degree}
      </div>
      <div className='overflow-hidden break-words w-full'>
        <div className='font-normal '>
          {item.fieldOfStudy ? <h1>{item.fieldOfStudy}</h1> : null}
        </div>
        <div className='font-normal'>
          {new Date(item.startDate).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
          })}{' '}
          -{' '}
          {item.current
            ? 'Present'
            : new Date(item.endDate).toLocaleDateString('en-us', {
                year: 'numeric',
                month: 'short',
              })}
        </div>
      </div>
      <div
        className={`w-full break-words ${lineHeight > 3 && 'line-clamp-3'}  ${
          show && 'line-clamp-none'
        }`}
        key='key'
        ref={ref}
      >
        {item.extracurricular ? (
          <div
            className={`custom break-words`}
            dangerouslySetInnerHTML={{__html: item.extracurricular}}
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
    </li>
  );
};
export default Education;
