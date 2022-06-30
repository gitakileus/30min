import {Field, Form, Formik} from 'formik';

const SearchForm = ({setSearchFilter, isLoading}) => {
  const handleQuery = values => {
    const {logType, logLevel, functionName, logId} = values;
    setSearchFilter({
      logType,
      logLevel,
      functionName,
      id: logId,
      newSearch: true,
    });
  };

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

  return (
    <div className='shadow-md rounded-md overflow-hidden'>
      <h3 className='text-xl col-span-12 font-bold text-gray-500 bg-gray-100 px-6 py-3'>
        Search Filter
      </h3>
      <Formik
        initialValues={{functionName: '', logLevel: [], logType: [], logId: ''}}
        onSubmit={values => {
          handleQuery(values);
        }}
      >
        {({values}) => (
          <Form className='grid grid-cols-12 gap-2 px-6 py-3 text-center sm:text-left'>
            <h4 className='col-span-12 font-bold text-gray-500'>Log Levels</h4>
            <div className='col-span-12 flex gap-2 text-gray-400 justify-center sm:justify-start items-center'>
              {LOG_LEVELS.map(level => (
                <label key={level} className='flex gap-2 items-center'>
                  <Field type='checkbox' name='logLevel' value={level} />
                  {level}
                </label>
              ))}
            </div>
            <h4 className='col-span-12 font-bold text-gray-500'>Log Types</h4>
            <div className='col-span-12 flex flex-col sm:flex-row items-center sm:items-start gap-2 text-gray-400 flex-wrap'>
              {LOG_TYPES.map(type => (
                <label key={type} className='flex gap-2 items-center'>
                  <Field type='checkbox' name='logType' value={type} />
                  {type}
                </label>
              ))}
            </div>
            <div className='col-span-12 flex gap-2 flex-wrap justify-center sm:justify-start'>
              <Field
                type='text'
                name='functionName'
                placeholder='Function Name'
                className='appearance-none block max-w-max px-3 py-2 border border-gray-300 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue
              focus:border-mainBlue sm:text-sm'
              />
              <Field
                type='text'
                name='logId'
                placeholder='Log ID'
                className='appearance-none block max-w-max px-3 py-2 border border-gray-300 rounded-md
              shadow-sm placeholder-gray-400 focus:outline-none focus:ring-mainBlue
              focus:border-mainBlue sm:text-sm'
              />
            </div>
            <div className='col-span-12 flex gap-4 justify-center sm:justify-start'>
              <button
                disabled={isLoading}
                type='submit'
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
              >
                Submit
              </button>
              <button
                disabled={isLoading}
                type='button'
                onClick={() => {
                  handleQuery(values);
                }}
                className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-25'
              >
                Refresh
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchForm;
