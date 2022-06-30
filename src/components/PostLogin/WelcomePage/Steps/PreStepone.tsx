import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import StepOneSvg from './Svg/step1';

const PreStepOne = ({handleClick}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const {step} = router.query;
  const newStep = Number(step);

  useEffect(() => {
    router.push({
      pathname: '/user/welcome',
      query: {step: 0},
    });
  }, []);

  const handleNext = () => {
    router.push({
      pathname: '/user/welcome',
      query: {step: newStep + 1},
    });
    handleClick();
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-32 mx-8'>
      <div className='flex items-center justify-center self-start'>
        <StepOneSvg
          className='hidden sm:flex w-60 h-60 sm:w-96 sm:h-96'
          skeleton='animate-animated animate-fadeInUp animate-fast animate-repeat-1'
          avatar='animate-animated animate-fadeInDown animate-fast '
        />
      </div>

      <div className='sm:overflow-hidden'>
        <div className='bg-white py-6 px-4 sm:p-6'>
          <div>
            <h2 className='text-3xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-4xl'>
              {t('common:welcome_1')}
            </h2>
            <p className='mt-6 max-w-2xl text-sm text-gray-500'>{t('common:welcome_2')}</p>
            <p className='mt-6 max-w-2xl text-sm text-gray-500'>{t('common:welcome_3')}</p>
            <p className='mt-6 max-w-2xl text-sm text-gray-500'>{t('common:welcome_4')}</p>
          </div>
        </div>
        <div className='px-4 py-3 text-right sm:px-6'>
          <button
            type='submit'
            onClick={handleNext}
            className={` bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
          >
            {t('common:btn_continue')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PreStepOne;
