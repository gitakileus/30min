import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import {PlusCircleIcon, TrashIcon} from '@heroicons/react/solid';
import {Field, FieldArray, Form, Formik} from 'formik';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import DayPicker from './DayPicker';
import {getCustomHours} from './utils';

const CustomTime = ({custom_time}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {hideModal} = ModalContextProvider();
  const [updateWorkingHours] = useMutation(mutations.updateWorkingHours);
  const router = useRouter();

  // eslint-disable-next-line no-bitwise
  const convert = n => `${`0${(n / 60) ^ 0}`.slice(-2)}:${`0${n % 60}`.slice(-2)}`;

  const [initialValues, setInitialValues] = useState({
    sunday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
    monday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
    tuesday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
    wednesday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
    thursday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
    friday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
    saturday: {
      isActive: false,
      availability: [{start: '0', end: '0'}],
    },
  });

  useEffect(
    () =>
      setInitialValues({
        sunday: {
          isActive: custom_time?.sunday?.isActive,
          availability: custom_time?.sunday?.availability?.map(item => ({
            start: convert(String(item.start)),
            end: convert(String(item.end)),
          })),
        },
        monday: {
          isActive: custom_time?.monday?.isActive,
          availability: custom_time?.monday?.availability?.map(item => ({
            start: convert(String(item.start)) || null,
            end: convert(String(item.end)) || null,
          })),
        },
        tuesday: {
          isActive: custom_time?.tuesday?.isActive,
          availability: custom_time.tuesday.availability?.map(item => ({
            start: convert(String(item.start)),
            end: convert(String(item.end)),
          })),
        },
        wednesday: {
          isActive: custom_time?.wednesday?.isActive,
          availability: custom_time.wednesday.availability?.map(item => ({
            start: convert(String(item.start)),
            end: convert(String(item.end)),
          })),
        },
        thursday: {
          isActive: custom_time?.thursday?.isActive,
          availability: custom_time.thursday.availability?.map(item => ({
            start: convert(String(item.start)),
            end: convert(String(item.end)),
          })),
        },
        friday: {
          isActive: custom_time?.friday?.isActive,
          availability: custom_time.friday.availability?.map(item => ({
            start: convert(String(item.start)),
            end: convert(String(item.end)),
          })),
        },
        saturday: {
          isActive: custom_time?.saturday?.isActive,
          availability: custom_time.saturday.availability?.map(item => ({
            start: convert(String(item.start)),
            end: convert(String(item.end)),
          })),
        },
      }),
    []
  );

  const submitHandler = async (values, setSubmitting) => {
    setSubmitting(true);

    await updateWorkingHours({
      variables: {
        workingHours: {
          isCustomEnabled: true,
          sunday: {
            isActive: values?.sunday?.isActive,
            availability: values?.sunday?.availability.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
          monday: {
            isActive: values?.monday.isActive,
            availability: values?.monday?.availability?.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
          tuesday: {
            isActive: values?.tuesday.isActive,
            availability: values?.tuesday?.availability?.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
          wednesday: {
            isActive: values?.wednesday.isActive,
            availability: values?.wednesday?.availability?.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
          thursday: {
            isActive: values?.thursday.isActive,
            availability: values?.thursday?.availability?.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
          friday: {
            isActive: values?.friday.isActive,
            availability: values?.friday?.availability?.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
          saturday: {
            isActive: values?.saturday.isActive,
            availability: values?.saturday?.availability?.map(item => ({
              start: getCustomHours(item?.start),
              end: getCustomHours(item?.end),
            })),
          },
        },
        token: session?.accessToken,
      },
    });

    router.reload();
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
        enableReinitialize={true}
      >
        {({isSubmitting, values, handleSubmit, setFieldValue}) => (
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
              <div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.sunday?.isActive}
                      setFieldValue={() =>
                        values?.sunday?.isActive
                          ? setFieldValue('sunday.isActive', false)
                          : setFieldValue('sunday.isActive', true)
                      }
                      letter={'SU'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='sunday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.sunday?.availability?.length > 0 ? (
                              values?.sunday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`sunday.availability.${index}.start`}
                                      type='time'
                                      required={values?.sunday?.isActive}
                                      min={values?.sunday?.availability[index - 1]?.end}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`sunday.availability.${index}.end`}
                                      type='time'
                                      required={values?.sunday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.monday?.isActive}
                      setFieldValue={() =>
                        values?.monday?.isActive
                          ? setFieldValue('monday.isActive', false)
                          : setFieldValue('monday.isActive', true)
                      }
                      letter={'MO'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='monday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.monday?.availability?.length > 0 ? (
                              values?.monday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`monday.availability.${index}.start`}
                                      type='time'
                                      required={values?.monday?.isActive}
                                      min={values?.monday?.availability[index - 1]?.end}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`monday.availability.${index}.end`}
                                      type='time'
                                      required={values?.monday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.tuesday?.isActive}
                      setFieldValue={() =>
                        values?.tuesday?.isActive
                          ? setFieldValue('tuesday.isActive', false)
                          : setFieldValue('tuesday.isActive', true)
                      }
                      letter={'TU'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='tuesday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.tuesday?.availability?.length > 0 ? (
                              values?.tuesday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`tuesday.availability.${index}.start`}
                                      type='time'
                                      min={values?.tuesday?.availability[index - 1]?.end}
                                      required={values?.tuesday?.isActive}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`tuesday.availability.${index}.end`}
                                      type='time'
                                      required={values?.tuesday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.wednesday?.isActive}
                      setFieldValue={() =>
                        values?.wednesday?.isActive
                          ? setFieldValue('wednesday.isActive', false)
                          : setFieldValue('wednesday.isActive', true)
                      }
                      letter={'WE'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='wednesday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.wednesday?.availability?.length > 0 ? (
                              values?.wednesday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`wednesday.availability.${index}.start`}
                                      type='time'
                                      required={values?.wednesday?.isActive}
                                      min={values?.wednesday?.availability[index - 1]?.end}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`wednesday.availability.${index}.end`}
                                      type='time'
                                      required={values?.wednesday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.thursday?.isActive}
                      setFieldValue={() =>
                        values?.thursday?.isActive
                          ? setFieldValue('thursday.isActive', false)
                          : setFieldValue('thursday.isActive', true)
                      }
                      letter={'TH'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='thursday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.thursday?.availability?.length > 0 ? (
                              values?.thursday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`thursday.availability.${index}.start`}
                                      required={values?.thursday?.isActive}
                                      type='time'
                                      min={values?.thursday?.availability[index - 1]?.end}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`thursday.availability.${index}.end`}
                                      type='time'
                                      required={values?.thursday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.friday?.isActive}
                      setFieldValue={() =>
                        values?.friday?.isActive
                          ? setFieldValue('friday.isActive', false)
                          : setFieldValue('friday.isActive', true)
                      }
                      letter={'FR'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='friday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.friday?.availability?.length > 0 ? (
                              values?.friday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`friday.availability.${index}.start`}
                                      min={values?.friday?.availability[index - 1]?.end}
                                      required={values?.friday?.isActive}
                                      type='time'
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`friday.availability.${index}.end`}
                                      type='time'
                                      required={values?.friday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className='flex py-1'>
                  <div className='flex'>
                    <DayPicker
                      day={values?.saturday?.isActive}
                      setFieldValue={() =>
                        values?.saturday?.isActive
                          ? setFieldValue('saturday.isActive', false)
                          : setFieldValue('saturday.isActive', true)
                      }
                      letter={'SA'}
                    />
                  </div>

                  <div className='flex w-full'>
                    <FieldArray name='saturday.availability'>
                      {({remove, push}) => (
                        <>
                          <div className='flex flex-col w-full items-center'>
                            {values?.saturday?.availability?.length > 0 ? (
                              values?.saturday?.availability?.map((_idx, index) => (
                                <div className='flex flex-row' key={index}>
                                  <div className='flex flex-row'>
                                    <Field
                                      name={`saturday.availability.${index}.start`}
                                      min={values?.saturday?.availability[index - 1]?.end}
                                      type='time'
                                      required={values?.saturday?.isActive}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                    <Field
                                      name={`saturday.availability.${index}.end`}
                                      type='time'
                                      required={values?.saturday?.isActive}
                                      min={`${_idx.start}`}
                                      className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                                    />
                                  </div>
                                  <button
                                    type='button'
                                    className='secondary'
                                    onClick={() => remove(index)}
                                  >
                                    <TrashIcon className='h-5 w-5 text-red-500' />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className='flex justify-center items-center'>Unavailable</span>
                            )}
                          </div>
                          <div className='items-center'>
                            <button
                              type='button'
                              className='secondary'
                              onClick={() => push({start: '', end: ''})}
                            >
                              <PlusCircleIcon className='h-5 w-5 text-mainBlue' />
                            </button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default CustomTime;
