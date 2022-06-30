import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const DevContainer = ({zoomCredentials, deleteZoom, errors}) => {
  const {t} = useTranslation();

  return (
    <>
      <div className='grid overflow-hidden grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6'>
        <div className='box'>
          <div className='bg-white shadow-lg overflow-hidden rounded-lg mb-4'>
            <div className='d-flex mt-10'>
              <div className=' ml-4'>
                <div className='mb-2 mt-1'>
                  <span className='font-24 font-bold'>{t('common:txt_zoom_account')}</span>
                  <br />
                </div>
                {zoomCredentials !== null && zoomCredentials.length > 0 ? (
                  <div className='mt-2 d-flex'>
                    <span className='text-green-500 font-15 font-medium'>
                      {t('setting:txt_connected')}
                    </span>
                  </div>
                ) : (
                  <div className='mt-2 d-flex'>
                    <span className='font-15 font-medium text-gray-600'>
                      {t('common:txt_not_connected')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ul className='mt-4'>
              {zoomCredentials !== null &&
                zoomCredentials.length > 0 &&
                zoomCredentials.map((integration, key) => (
                  <li key={key}>
                    <div className='grid overflow-hidden grid-cols-6 grid-rows-2 gap-2 px-4'>
                      <div className='box col-start-1 col-end-5'>
                        <a className='block'>
                          <div className='min-w-0 flex-1 flex items-center'>
                            <div className='min-w-0 flex-1 md:grid md:gap-4'>
                              <div>
                                <p className='font-medium text-black truncate '>
                                  {integration.userEmail}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className='box col-span-2 justify-end items-end text-right'>
                        <button
                          onClick={() => deleteZoom(integration.userEmail)}
                          type='submit'
                          className='text-red-600'
                        >
                          {t('common:btn_remove')}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>

            <div className='pb-4 pt-4 px-4 flex items-center gap-4 '>
              <a
                href={`https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DEV_ZOOM_CLIENT_ID}&redirect_uri=https%3A%2F%2F30mins.com%2Fuser%2Fextensions%2FzoomDev`}
                className='text-base font-medium ocus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center gap-4'
              >
                <img src='https://30mins.com/assets/zoomLogo.png' alt='' height={20} width={20} />
                {t('common:txt_zoom_integration')}
              </a>
              {errors ? <p className='font-xs text-red-600'>{errors}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DevContainer;
