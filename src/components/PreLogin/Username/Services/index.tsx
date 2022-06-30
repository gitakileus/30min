import useTranslation from 'next-translate/useTranslation';

const Services = ({item, user}: {item: any; user: any}) => {
  const serviceUrl = `${window.origin}/${user.accountDetails.username}/${item.slug}`;
  const {t} = useTranslation();

  return (
    <li
      className='flex flex-row flex-wrap items-center bg-white mb-2 rounded-md py-3 px-4 w-full list-none overflow-hidden'
      key={item.id}
    >
      <div className={`flex text-mainBlue gap-2 h-24 w-full md:w-1/4 `}>
        <div
          className={`flex text-mainBlue justify-center `}
          style={{
            background: "#ffffff url('/assets/30mins.png') no-repeat center",
            backgroundSize: 'contain',
            backgroundPosition: 'left top',
          }}
        >
          <h1 className='text-mainBlue text-4xl pt-8 pl-6 pr-0 pb-0 font-extrabold'>
            {item.duration}
          </h1>
          <span className='pt-12 pl-1'>{t('minutes')}</span>
        </div>
      </div>
      <div className='flex flex-col gap-2 pt-2 items-center w-full md:w-2/4 overflow-hidden'>
        <div className='flex flex-col gap-2 justify-start items-start w-full  md:block'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>{item.title}</h1>
        </div>
        <div className='flex flex-col gap-2 justify-start items-start w-full'>
          <div className={`w-full break-words line-clamp-3`}>
            {item.description ? (
              <div
                className={`custom break-words`}
                dangerouslySetInnerHTML={{__html: item.description}}
              />
            ) : null}
          </div>
          <div>
            {item?.percentDonated > 0 ? (
              <span className='text-md font-bold text-mainBlue'>
                {item?.percentDonated}% {t('meeting:donating_to_charity')} {item?.charity}
              </span>
            ) : null}
          </div>{' '}
        </div>
      </div>
      <div className='flex md:flex-col gap-4 items-center w-full md:w-1/4 '>
        <div className='w-full flex justify-start md:justify-center text-center'>
          {item.price ? (
            <h1 className='text-2xl font-extrabold'>{`${item.currency}${item.price}`}</h1>
          ) : (
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>{'FREE'}</h1>
          )}
        </div>
        <div className='w-full flex justify-center text-center'>
          <button
            type='button'
            className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
          >
            <a href={serviceUrl}>{t('profile:book_now')}</a>
          </button>
        </div>
      </div>
    </li>
  );
};
export default Services;
