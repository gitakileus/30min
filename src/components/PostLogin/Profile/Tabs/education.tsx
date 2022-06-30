import {useQuery} from '@apollo/client';
import {MODAL_TYPES} from 'constants/context/modals';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import queries from 'constants/GraphQL/EducationHistory/queries';
import Loader from 'components/shared/Loader/Loader';
import EmptyService from 'components/shared/Card/States/emptyService';
import EducationCard from 'components/shared/Card/Education/Card';

const Education = () => {
  const {data: session} = useSession();
  const {data, loading} = useQuery(queries.getEducationHistoryByUserId, {
    variables: {token: session?.accessToken},
  });

  const HasEducation = data?.getEducationHistoryByUserId?.response?.status !== 404;
  const educationData: any =
    data?.getEducationHistoryByUserId?.educationHistoryData &&
    Object.values(data?.getEducationHistoryByUserId?.educationHistoryData).sort(
      (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
    );

  const svg = (
    <svg
      className='mx-auto h-12 w-12 text-gray-400'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      role='img'
      width='1em'
      height='1em'
      preserveAspectRatio='xMidYMid meet'
      viewBox='0 0 16 16'
    >
      <g fill='currentColor'>
        <path d='M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z' />
      </g>
    </svg>
  );

  const {t} = useTranslation();

  const {showModal} = ModalContextProvider();

  const toggleAddEducation = () => {
    showModal(MODAL_TYPES.EDUCATION);
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className='justify-end items-end flex mt-2'>
        <button
          onClick={toggleAddEducation}
          className='bg-mainBlue mt-2 mr-6 flex justify-center items-center px-5 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700'
        >
          {t('profile:add_education_history_title')}
        </button>
      </div>

      {!HasEducation ? (
        <div className='max-w-lg '>
          <EmptyService
            title={t('event:txt_not_add_desc2')}
            svg={svg}
            onClick={toggleAddEducation}
          />
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-1 gap-1 w-full px-6'>
          {educationData.map((education, index) => (
            <EducationCard key={index} education={education} />
          ))}
        </div>
      )}
    </>
  );
};

export default Education;
