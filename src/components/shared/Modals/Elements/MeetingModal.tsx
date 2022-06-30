import {useRouter} from 'next/router';
import axios from 'axios';
import {Formik, Form} from 'formik';
import {CheckCircleIcon, ClockIcon} from '@heroicons/react/outline';

import {MEETING_MODAL_STATE, MEETING_MODAL_YUP} from 'constants/yup';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import Modal from '../Modal';

const MeetingModal = () => {
  const router = useRouter();
  const {t} = useTranslation();

  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {meetingData, mode, title, labelTitle} = modalProps || {};

  async function onSubmit(values) {
    try {
      if (mode === 'complete') {
        await axios.post('/api/meetings/complete', {
          meetingDetails: meetingData,
          notes: values.text,
        });
      } else if (mode === 'confirm') {
        await axios.post('/api/meetings/confirm', {
          meetingDetails: meetingData,
          feedback: values.text,
        });
      } else if (mode === 'cancel') {
        await axios.post('/api/meetings/cancel', {
          meetingDetails: meetingData,
          reason: values.text,
        });
      } else if (mode === 'decline') {
        await axios.post('/api/meetings/decline', {
          meetingDetails: meetingData,
          reason: values.text,
        });
      } else if (mode === 'report') {
        await axios.post('/api/meetings/report', {
          meetingDetails: meetingData,
          reason: values.text,
        });
      } else if (mode === 'refund') {
        await axios.post('/api/meetings/refund', {
          meetingDetails: meetingData,
          reason: values.text,
        });
      } else if (mode === 'release') {
        await axios.post('/api/meetings/release', {
          meetingDetails: meetingData,
        });
      } else {
        console.log('INVALID MODAL MODE');
      }
      router.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal
      icon={mode === 'complete' || mode === 'confirm' ? CheckCircleIcon : ClockIcon}
      title={title}
      small
    >
      <Formik
        initialValues={MEETING_MODAL_STATE}
        validationSchema={MEETING_MODAL_YUP}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({isSubmitting, errors, values, touched, handleSubmit, handleChange}) => (
          <Form onSubmit={handleSubmit}>
            <>
              <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
                <button
                  type='button'
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
                  {t('common:btn_submit')}
                </button>
              </div>
              <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-1 md:gap-6'>
                  <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='overflow-hidden sm:rounded-md'>
                      <div className='px-4 py-5 bg-white sm:p-6'>
                        <div className='grid grid-cols-6 gap-6'>
                          <div className=' col-span-6'>
                            <label
                              htmlFor='description'
                              className='block text-sm font-medium text-gray-700'
                            >
                              {labelTitle}
                            </label>
                            <div className='mt-1'>
                              <textarea
                                rows={4}
                                onChange={handleChange}
                                name='text'
                                value={values.text}
                                id='text'
                                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                              />
                            </div>{' '}
                            {touched.text && errors.text ? (
                              <div className='text-red-500 mt-2 text-sm font-normal'>
                                {' '}
                                {t('common:desc_required')}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default MeetingModal;
