import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useRef, useState, useEffect} from 'react';

const Hero = ({userList}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const searchUser: any = useRef(null);
  const [randomServiceArray, setRandomServiceArray] = useState<any[]>([]);

  useEffect(() => {
    const tempServiceArray = ['Maths Tutor', 'Wi-Fi', 'RTLS', 'AI/ML'];

    const getMultipleRandom = (arr, num) => {
      const shuffled = [...arr]?.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    setRandomServiceArray([...getMultipleRandom(tempServiceArray, 1)]);
  }, []);

  const handleSearchUsers = async e => {
    e.preventDefault();
    router.push({
      pathname: '/users',
      query: {
        keywords: searchUser.current.value,
      },
    });
  };

  const handleSearchTag = async value => {
    router.push({
      pathname: '/users',
      query: {
        keywords: value,
      },
    });
  };

  return (
    <div className='pt-8 overflow-hidden sm:pt-12 lg:relative lg:mt-32'>
      <div className='mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24'>
        <div>
          <div className='mt-4'>
            <div className='mt-6 sm:max-w-xl'>
              <h1 className='text-4xl font-extrabold text-mainText tracking-tight sm:text-5xl'>
                {t('page:Enabling_your_customers_and_prospects_to')}
              </h1>
              <span className='content__container block font-light text-browngray text-2xl my-6'>
                <ul className='content__container__list'>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:Bussiness')}
                  </li>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:Meetings')}
                  </li>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:Seminars')}
                  </li>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:Tuition')}
                  </li>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:Classes')}
                  </li>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:Consulting')}
                  </li>
                  <li className='content__container__list__item text-mainBlue text-4xl sm:text-5xl font-extrabold '>
                    {t('page:much_more')}
                  </li>
                </ul>
              </span>
            </div>
            <div className='mt-10'>
              <h1 className='text-xl font-extrabold text-mainText tracking-tight'>
                {t('page:looking_for_expert')}
              </h1>
              <form onSubmit={handleSearchUsers} className='mt-4 sm:max-w-lg sm:w-full sm:flex'>
                <div className='min-w-0 flex-1'>
                  <input
                    type='text'
                    ref={searchUser}
                    name='search'
                    className='inputBase block w-full border border-gray-300 rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-mainBlue focus:mainBlue'
                    placeholder={`Keywords...`}
                    maxLength={254}
                  />
                </div>
                <div className='mt-4 sm:mt-0 sm:ml-3'>
                  <button
                    type='submit'
                    className='block w-full rounded-md border border-transparent px-5 py-3 bg-mainBlue text-base font-medium text-white shadow duration-150 ease-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:mainBlue focus:ring-offset-2 sm:px-10'
                  >
                    {t('meeting:search')}
                  </button>
                </div>
              </form>

              <div className='mt-4 flex flex-row'>
                {randomServiceArray &&
                  randomServiceArray.map((item, index) => (
                    <button key={index} onClick={() => handleSearchTag(item)}>
                      <span className='flex flex-row px-2 text-mainBlue font-bold'>{item}</span>
                    </button>
                  ))}
                {userList &&
                  userList?.map((user, i) => (
                    <a href={`https://30mins.com/${user?.accountDetails?.username}`} key={i}>
                      <span className='flex flex-row px-2 text-mainBlue font-bold'>
                        {user?.personalDetails?.name}
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className='sm:relative  '>
          <div className='hidden sm:block'>
            <svg
              className='absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0'
              width={404}
              height={392}
              fill='none'
              viewBox='0 0 404 392'
            >
              <defs>
                <pattern id='dots' x={0} y={0} width={20} height={20} patternUnits='userSpaceOnUse'>
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className='text-gray-200'
                    fill='currentColor'
                  />
                </pattern>
              </defs>
              <rect width={404} height={392} fill='url(#dots)' />
            </svg>
          </div>
          <div className='relative pl-4 mt-4 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12'>
            <Image
              src='/assets/hero.svg'
              alt='hero'
              height={500}
              width={500}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
