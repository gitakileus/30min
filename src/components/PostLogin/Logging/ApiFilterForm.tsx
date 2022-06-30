import {Field, Form, Formik} from 'formik';

const ApiFilterForm = ({apiFilter, updateApiFilter}) => {
  const LOG_LEVELS = ['ERROR', 'INFO'];
  const LOG_TYPES = [
    'QUERY_START',
    'QUERY_END',
    'MUTATION_START',
    'MUTATION_END',
    'CRON_JOB_START',
    'CRON_JOB_END',
    'API_PROCESSING_START',
    'API_PROCESSING_END',
  ];

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    await updateApiFilter(values);
    actions.setSubmitting(false);
  };

  return (
    <>
      <div>
        <Formik
          initialValues={{...apiFilter}}
          onSubmit={(values, actions) => {
            handleSubmit(values, actions);
          }}
        >
          {({isSubmitting}) => (
            <Form className='grid grid-cols-12 gap-2 px-6 py-3 text-center sm:text-left'>
              <h4 className='col-span-12 font-bold text-gray-500'>Log Levels</h4>
              <div className='col-span-12 flex gap-2 text-gray-400 justify-center sm:justify-start items-center'>
                {LOG_LEVELS.map(level => (
                  <label key={level} className='flex gap-2 items-center'>
                    <Field type='checkbox' name='levels' value={level} />
                    {level}
                  </label>
                ))}
              </div>
              <h4 className='col-span-12 font-bold text-gray-500'>Log Types</h4>
              <div className='col-span-12 flex flex-col sm:flex-row items-center sm:items-start gap-2 text-gray-400 flex-wrap'>
                {LOG_TYPES.map(type => (
                  <label key={type} className='flex gap-2 items-center'>
                    <Field type='checkbox' name='types' value={type} />
                    {type}
                  </label>
                ))}
              </div>

              <div className='col-span-12 flex gap-4 justify-center sm:justify-start'>
                <button
                  disabled={isSubmitting}
                  type='submit'
                  className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ApiFilterForm;
