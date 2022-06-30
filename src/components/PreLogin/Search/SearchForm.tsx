import {Form, Formik} from 'formik';
import {HOME_SEARCH_PAGE} from 'constants/yup/index';
import Recaptcha from 'react-google-recaptcha';

const HomeSearchForm = ({onSubmit, recaptchaRef}) => (
  <Formik
    initialValues={HOME_SEARCH_PAGE}
    onSubmit={(values, {setSubmitting}) => {
      onSubmit(values, setSubmitting);
    }}
  >
    {({values, handleChange, handleSubmit}) => (
      <Form onSubmit={handleSubmit}>
        <Recaptcha
          ref={recaptchaRef}
          size='invisible'
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
        />
        <div className='col-span-1 justify-between flex h-10'>
          <div className='divide-x shadow flex w-full lg:w-3/5'>
            <div className='w-full'>
              <input
                className='w-full rounded p-2 border-0 outline-none border-transparent focus:border-transparent focus:ring-0'
                type='text'
                name='keywords'
                id='keywords'
                value={values.keywords}
                onChange={handleChange}
                placeholder='Search by name, headline...'
              />
            </div>
            <div className='w-full hidden md:flex'>
              <input
                className='w-full rounded p-2 border-0 outline-none border-transparent focus:border-transparent focus:ring-0'
                type='text'
                name='location'
                id='location'
                value={values.location}
                onChange={handleChange}
                placeholder='Search by country or zipcode'
              />
            </div>
            <button
              className='rounded-r btn px-6 py-2.5 bg-mainBlue text-white font-medium text-xs leading-tight uppercase  shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center'
              type='submit'
            >
              <svg
                aria-hidden='true'
                focusable='false'
                data-prefix='fas'
                data-icon='search'
                className='w-4'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
              >
                <path
                  fill='currentColor'
                  d='M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z'
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </Form>
    )}
  </Formik>
);
export default HomeSearchForm;
