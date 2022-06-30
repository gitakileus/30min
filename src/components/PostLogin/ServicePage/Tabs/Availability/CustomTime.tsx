import {PlusCircleIcon, TrashIcon} from '@heroicons/react/solid';
import {Field, FieldArray} from 'formik';
import {useEffect} from 'react';
import DayPicker from '../../../CustomTIme/DayPicker';

const CustomTime = ({values, setFieldValue}) => {
  // eslint-disable-next-line no-bitwise
  const convert = n => `${`0${(n / 60) ^ 0}`.slice(-2)}:${`0${n % 60}`.slice(-2)}`;

  useEffect(() => {
    setFieldValue(
      'serviceWorkingHours.sunday.availability',
      values?.serviceWorkingHours?.sunday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
    setFieldValue(
      'serviceWorkingHours.monday.availability',
      values?.serviceWorkingHours?.monday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
    setFieldValue(
      'serviceWorkingHours.tuesday.availability',
      values?.serviceWorkingHours?.tuesday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
    setFieldValue(
      'serviceWorkingHours.wednesday.availability',
      values?.serviceWorkingHours?.wednesday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
    setFieldValue(
      'serviceWorkingHours.thursday.availability',
      values?.serviceWorkingHours?.thursday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
    setFieldValue(
      'serviceWorkingHours.friday.availability',
      values?.serviceWorkingHours?.friday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
    setFieldValue(
      'serviceWorkingHours.saturday.availability',
      values?.serviceWorkingHours?.saturday?.availability?.map(item => ({
        start: convert(String(item.start)),
        end: convert(String(item.end)),
      }))
    );
  }, []);

  return (
    <>
      <div>
        <div className='flex py-1'>
          <div className='flex'>
            <DayPicker
              day={values?.serviceWorkingHours?.sunday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.sunday?.isActive
                  ? setFieldValue('serviceWorkingHours.sunday.isActive', false)
                  : setFieldValue('serviceWorkingHours.sunday.isActive', true)
              }
              letter={'SU'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.sunday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.sunday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.sunday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.sunday.availability.${index}.start`}
                              type='time'
                              required={values?.serviceWorkingHours?.sunday?.isActive}
                              min={
                                values?.serviceWorkingHours?.sunday?.availability[index - 1]?.end
                              }
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.sunday.availability.${index}.end`}
                              type='time'
                              required={values?.serviceWorkingHours?.sunday?.isActive}
                              min={`${_idx.start}`}
                              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
              day={values?.serviceWorkingHours?.monday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.monday?.isActive
                  ? setFieldValue('serviceWorkingHours.monday.isActive', false)
                  : setFieldValue('serviceWorkingHours.monday.isActive', true)
              }
              letter={'MO'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.monday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.monday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.monday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.monday.availability.${index}.start`}
                              type='time'
                              required={values?.serviceWorkingHours?.monday?.isActive}
                              min={
                                values?.serviceWorkingHours?.monday?.availability[index - 1]?.end
                              }
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.monday.availability.${index}.end`}
                              type='time'
                              required={values?.serviceWorkingHours?.monday?.isActive}
                              min={`${_idx.start}`}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
              day={values?.serviceWorkingHours?.tuesday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.tuesday?.isActive
                  ? setFieldValue('serviceWorkingHours.tuesday.isActive', false)
                  : setFieldValue('serviceWorkingHours.tuesday.isActive', true)
              }
              letter={'TU'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.tuesday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.tuesday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.tuesday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.tuesday.availability.${index}.start`}
                              type='time'
                              min={
                                values?.serviceWorkingHours?.tuesday?.availability[index - 1]?.end
                              }
                              required={values?.serviceWorkingHours?.tuesday?.isActive}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.tuesday.availability.${index}.end`}
                              type='time'
                              required={values?.serviceWorkingHours?.tuesday?.isActive}
                              min={`${_idx.start}`}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
              day={values?.serviceWorkingHours?.wednesday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.wednesday?.isActive
                  ? setFieldValue('serviceWorkingHours.wednesday.isActive', false)
                  : setFieldValue('serviceWorkingHours.wednesday.isActive', true)
              }
              letter={'WE'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.wednesday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.wednesday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.wednesday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.wednesday.availability.${index}.start`}
                              type='time'
                              required={values?.serviceWorkingHours?.wednesday?.isActive}
                              min={
                                values?.serviceWorkingHours?.wednesday?.availability[index - 1]?.end
                              }
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.wednesday.availability.${index}.end`}
                              type='time'
                              required={values?.serviceWorkingHours?.wednesday?.isActive}
                              min={`${_idx.start}`}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
              day={values?.serviceWorkingHours?.thursday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.thursday?.isActive
                  ? setFieldValue('serviceWorkingHours.thursday.isActive', false)
                  : setFieldValue('serviceWorkingHours.thursday.isActive', true)
              }
              letter={'TH'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.thursday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.thursday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.thursday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.thursday.availability.${index}.start`}
                              required={values?.serviceWorkingHours?.thursday?.isActive}
                              type='time'
                              min={
                                values?.serviceWorkingHours?.thursday?.availability[index - 1]?.end
                              }
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.thursday.availability.${index}.end`}
                              type='time'
                              required={values?.serviceWorkingHours?.thursday?.isActive}
                              min={`${_idx.start}`}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
              day={values?.serviceWorkingHours?.friday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.friday?.isActive
                  ? setFieldValue('serviceWorkingHours.friday.isActive', false)
                  : setFieldValue('serviceWorkingHours.friday.isActive', true)
              }
              letter={'FR'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.friday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.friday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.friday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.friday.availability.${index}.start`}
                              min={
                                values?.serviceWorkingHours?.friday?.availability[index - 1]?.end
                              }
                              required={values?.serviceWorkingHours?.friday?.isActive}
                              type='time'
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.friday.availability.${index}.end`}
                              type='time'
                              required={
                                values?.serviceWorkingHours?.serviceWorkingHours?.friday?.isActive
                              }
                              min={`${_idx.start}`}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
              day={values?.serviceWorkingHours?.saturday?.isActive}
              setFieldValue={() =>
                values?.serviceWorkingHours?.saturday?.isActive
                  ? setFieldValue('serviceWorkingHours.saturday.isActive', false)
                  : setFieldValue('serviceWorkingHours.saturday.isActive', true)
              }
              letter={'SA'}
            />
          </div>

          <div className='flex w-full'>
            <FieldArray name='serviceWorkingHours.saturday.availability'>
              {({remove, push}) => (
                <>
                  <div className='flex flex-col w-full sm:w-2/5 items-center'>
                    {values?.serviceWorkingHours?.saturday?.availability?.length > 0 ? (
                      values?.serviceWorkingHours?.saturday?.availability?.map((_idx, index) => (
                        <div className='flex flex-row' key={index}>
                          <div className='flex flex-row'>
                            <Field
                              name={`serviceWorkingHours.saturday.availability.${index}.start`}
                              min={
                                values?.serviceWorkingHours?.saturday?.availability[index - 1]?.end
                              }
                              type='time'
                              required={values?.serviceWorkingHours?.saturday?.isActive}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                            <Field
                              name={`serviceWorkingHours.saturday.availability.${index}.end`}
                              type='time'
                              required={values?.serviceWorkingHours?.saturday?.isActive}
                              min={`${_idx.start}`}
                              className='mt-1 mr-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                            />
                          </div>
                          <button type='button' className='secondary' onClick={() => remove(index)}>
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
    </>
  );
};
export default CustomTime;
