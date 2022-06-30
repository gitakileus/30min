import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {useMutation, useQuery} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {Form, Formik} from 'formik';
import {useEffect, useState} from 'react';
import queries from 'constants/GraphQL/User/queries';
import CustomTime from 'components/PostLogin/CustomTIme/CustomTime';
import {Switch} from '@headlessui/react';
import classNames from 'classnames';
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import DayPicker from './DayPicker';

const DefaultHours = () => {
  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const {data: session} = useSession();
  const {data} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  useEffect(() => {}, []);

  const User = data?.getUserById?.userData?.workingHours;
  const [initialValues, setInitialValues] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
    starttime: '0',
    endtime: '0',
    isCustomEnabled: false,
  });
  const [customHours, setCustomHousrs] = useState(User?.isCustomEnabled);

  const handleCustomHours = () => {
    setCustomHousrs(!customHours);
  };

  const startTime = User?.startTime;
  const endTime = dayjs(User?.endTime);

  // eslint-disable-next-line no-bitwise
  const convert = n => `${`0${(n / 60) ^ 0}`.slice(-2)}:${`0${n % 60}`.slice(-2)}`;
  const userStart = convert(String(startTime));
  const userEnd = convert(endTime);

  useEffect(
    () =>
      setInitialValues({
        monday: User?.monday?.isActive,
        tuesday: User?.tuesday?.isActive,
        wednesday: User?.wednesday?.isActive,
        thursday: User?.thursday?.isActive,
        friday: User?.friday?.isActive,
        saturday: User?.saturday?.isActive,
        sunday: User?.sunday?.isActive,
        starttime: userStart,
        endtime: userEnd,
        isCustomEnabled: User?.isCustomEnabled,
      }),
    [
      User?.friday?.isActive,
      User?.monday?.isActive,
      User?.saturday?.isActive,
      User?.sunday?.isActive,
      User?.thursday?.isActive,
      User?.tuesday?.isActive,
      User?.wednesday?.isActive,
      User?.endTime,
      User?.endTime,
    ]
  );

  const [updateWorkingHours] = useMutation(mutations.updateWorkingHours);
  const router = useRouter();

  const AddWorkingHours = async (values, setSubmitting) => {
    const splitStart = values.starttime.split(':');
    const hours = Number(splitStart[0]);
    const minutes = Number(splitStart[1]);

    const finalStart = hours * 60 + minutes;

    const splitEnd = values.endtime.split(':');
    const hoursEnd = Number(splitEnd[0]);
    const minutesEnd = Number(splitEnd[1]);

    const finalEnd = hoursEnd * 60 + minutesEnd;

    await updateWorkingHours({
      variables: {
        workingHours: {
          startTime: finalStart,
          endTime: finalEnd,
          isCustomEnabled: customHours,
          monday: {
            isActive: values.monday,
          },
          tuesday: {
            isActive: values.tuesday,
          },
          wednesday: {
            isActive: values.wednesday,
          },
          thursday: {
            isActive: values.thursday,
          },
          friday: {
            isActive: values.friday,
          },
          saturday: {
            isActive: values.saturday,
          },
          sunday: {
            isActive: values.sunday,
          },
        },
        token: session?.accessToken,
      },
    });

    router.reload();
    setSubmitting(false);
  };

  const submitHandler = async (values, setSubmitting) => {
    AddWorkingHours(values, setSubmitting);
  };
  return (
    <>
      <Switch.Group as='div' className='flex items-center'>
        <div className='grid grid-cols-2 my-4'>
          <Switch.Label as='span' className='mr-3'>
            <span className='text-sm font-medium text-gray-900'>
              {customHours ? t('common:Custom') : t('common:Default')}
            </span>
          </Switch.Label>
          <Switch
            checked={customHours}
            onChange={handleCustomHours}
            className={classNames(
              customHours ? 'bg-mainBlue' : 'bg-gray-200',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
            )}
          >
            <span
              aria-hidden='true'
              className={classNames(
                customHours ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
              )}
            />
          </Switch>
        </div>
      </Switch.Group>

      {!customHours ? (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, {setSubmitting}) => {
            submitHandler(values, setSubmitting);
          }}
          enableReinitialize={true}
        >
          {({isSubmitting, values, handleBlur, handleSubmit, setFieldValue, handleChange}) => (
            <Form onSubmit={handleSubmit}>
              <div className=''>
                <div className='-mt-12 sm:mb-4 text-right'>
                  <button
                    type='submit'
                    onClick={hideModal}
                    className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('common:btn_cancel')}
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('common:btn_save')}
                  </button>
                </div>
                <div className='flex flex-row'>
                  <DayPicker
                    day={values.sunday}
                    setFieldValue={() =>
                      values.sunday ? setFieldValue('sunday', false) : setFieldValue('sunday', true)
                    }
                    letter={'S'}
                  />{' '}
                  <DayPicker
                    day={values.monday}
                    setFieldValue={() =>
                      values.monday ? setFieldValue('monday', false) : setFieldValue('monday', true)
                    }
                    letter={'M'}
                  />
                  <DayPicker
                    day={values.tuesday}
                    setFieldValue={() =>
                      values.tuesday
                        ? setFieldValue('tuesday', false)
                        : setFieldValue('tuesday', true)
                    }
                    letter={'T'}
                  />{' '}
                  <DayPicker
                    day={values.wednesday}
                    setFieldValue={() =>
                      values.wednesday
                        ? setFieldValue('wednesday', false)
                        : setFieldValue('wednesday', true)
                    }
                    letter={'W'}
                  />{' '}
                  <DayPicker
                    day={values.thursday}
                    setFieldValue={() =>
                      values.thursday
                        ? setFieldValue('thursday', false)
                        : setFieldValue('thursday', true)
                    }
                    letter={'Th'}
                  />{' '}
                  <DayPicker
                    day={values.friday}
                    setFieldValue={() =>
                      values.friday ? setFieldValue('friday', false) : setFieldValue('friday', true)
                    }
                    letter={'F'}
                  />{' '}
                  <DayPicker
                    day={values.saturday}
                    setFieldValue={() =>
                      values.saturday
                        ? setFieldValue('saturday', false)
                        : setFieldValue('saturday', true)
                    }
                    letter={'S'}
                  />
                </div>
                <div className='item w-36 h-auto flex-none'>
                  {t('common:Start_time')}
                  <input
                    value={values.starttime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type='time'
                    name='starttime'
                    required
                    id='starttime'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                  />
                  {t('common:End_time')}
                  <input
                    value={values.endtime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={values.starttime}
                    type='time'
                    required
                    name='endtime'
                    id='endtime'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <CustomTime custom_time={User} />
        </>
      )}
    </>
  );
};

export default DefaultHours;
