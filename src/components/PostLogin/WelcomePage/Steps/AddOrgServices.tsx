import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import slug from 'slug';
import {ORG_SERVICE_YUP, ORG_SERVICE_STATE} from 'constants/yup/organization';
import {Field, Form, Formik} from 'formik';
import {Switch} from '@headlessui/react';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import mutations from 'constants/GraphQL/Organizations/mutations';
import DropDownComponent from 'components/shared/DropDownComponent';
import WelcomeSvg from './Svg/welcomeSvg';

const AddOrgServices = ({handleClick, org, User}) => {
  const {data: session} = useSession();
  const [mutation] = useMutation(mutations.createOrganizationService);
  const {t} = useTranslation();
  const [buttonText, setButtonText] = useState('');

  const router = useRouter();
  const {step} = router.query;

  const conferenceTypes = User?.accountDetails?.allowedConferenceTypes;

  const currencies = [
    {key: '$', value: '$'},
    {key: '£', value: '£'},
    {key: '€', value: '€'},
    {key: '₹', value: '₹'},
  ];

  const baseOption = [
    {
      key: 'Select',
      value: '',
    },
  ];

  const orgCategories = org?.organizationId?.serviceCategories.map(category => ({
    key: category,
    value: category,
  }));

  const options = baseOption.concat(orgCategories);

  const SelectCurrencies = currencies.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  useEffect(() => {
    setButtonText('Skip');
  }, []);

  const newStep = Number(step);

  const handleSkip = () => {
    router.push({
      pathname: '/user/welcome',
      query: {step: newStep + 1},
    });
    handleClick();
  };

  const submitHandler = async (values, {setSubmitting, resetForm}) => {
    setSubmitting(true);
    await mutation({
      variables: {
        organizationServiceData: {
          title: values.title,
          slug: slug(values.slug),
          conferenceType: values.conferenceType,
          duration: values.duration,
          isOrgService: true,
          description: values.description,
          isPaid: values.isPaid,
          currency: values.currency,
          price: parseInt(values.price, 10),
          paymentType: 'none',
          organizationId: org.organizationId._id,
          organizationName: values.organizationName
            ? values.organizationName
            : org?.organizationId?.title,
          orgServiceCategory: values.orgServiceCategory,
        },
        token: session?.accessToken,
      },
    });
    router.push({
      pathname: '/user/welcome',
      query: {step: newStep + 1},
    });
    resetForm({});
    handleClick();
    setSubmitting(false);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-32 mx-8'>
      <div className='flex items-center justify-center self-start'>
        <WelcomeSvg
          className='w-60 h-60 sm:w-96 sm:h-96'
          skeleton='animate-animated animate-fadeInUp animate-fast animate-repeat-1'
          avatar='animate-animated animate-fadeInDown animate-fast animate-delay-1s'
        />
      </div>

      <Formik
        initialValues={ORG_SERVICE_STATE}
        validationSchema={buttonText === 'Skip' ? null : ORG_SERVICE_YUP}
        onSubmit={submitHandler}
        enableReinitialize
      >
        {({
          isSubmitting,
          values,
          handleBlur,
          handleSubmit,
          setFieldValue,
          touched,
          errors,
          handleChange,
        }) => {
          const customHandleChange = async e => {
            const {name, value} = e.target;
            if (name === 'title') {
              setFieldValue('title', value);
              setFieldValue('slug', slug(value));
            } else {
              setFieldValue(name, value);
            }
            setFieldValue('conferenceType', t(`event:onPhone`));
          };
          if (values.title.length > 0 || values.slug.length > 0 || values.description.length > 0) {
            setButtonText('Continue');
          } else if (values.title === '' || values.slug === '' || values.description === '') {
            setButtonText('Skip');
          }
          if (values.organizationName === '') {
            setFieldValue('organizationName', org.organizationId.title);
          }

          return (
            <Form onSubmit={handleSubmit}>
              <div className='sm:overflow-hidden'>
                <div className='bg-white py-6 px-4 sm:p-6'>
                  <div>
                    <h2
                      id='payment-details-heading'
                      className='text-lg leading-6 font-medium text-gray-900'
                    >
                      {t('event:txt_add_new_service')} for {org.organizationId.title}
                    </h2>
                  </div>

                  <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2'>
                    <div className='col-span-4 md:col-span-2'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:Title')}
                      </label>
                      <input
                        value={values.title}
                        onChange={customHandleChange}
                        onBlur={handleBlur}
                        type='text'
                        name='title'
                        id='title'
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                      />
                      {touched.title && errors.title ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>{errors.title}</div>
                      ) : null}
                    </div>

                    <div className='col-span-4 md:col-span-2'>
                      <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                        {t('event:Duration')} ({t('common:min')})
                      </label>
                      <input
                        value={values.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type='number'
                        name='duration'
                        min={5}
                        id='duration'
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                      />
                      {touched.duration && errors.duration ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>
                          {errors.duration}
                        </div>
                      ) : null}
                    </div>

                    <div className='col-span-4 sm:col-span-4'>
                      <label
                        htmlFor='last-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('common:slug')}
                      </label>
                      <div className='mt-1 flex rounded-md shadow-sm'>
                        <span className='hidden md:inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                          https://30mins.com/org/
                        </span>
                        <input
                          type='text'
                          name='slug'
                          id='slug'
                          defaultValue={values.title}
                          value={values.slug}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-mainBlue focus:border-mainBlue sm:text-sm border-gray-300'
                          placeholder='title'
                        />
                      </div>
                      {touched.slug && errors.slug ? (
                        <div className='text-red-500 mt-2 text-sm font-normal'>{errors.slug}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className='col-span-6 sm:col-span-2'>
                    <label
                      htmlFor='conferenceType'
                      className='block text-sm font-medium text-gray-700'
                    >
                      {t('event:typeof_meeting')}
                    </label>
                    <div className='flex flex-col gap-2 py-2 items-start pl-2'>
                      {conferenceTypes.map((option, index) => (
                        <div className='flex gap-2' key={index}>
                          <Field
                            type='checkbox'
                            className='checked:bg-mainBlue'
                            name='conferenceType'
                            value={option}
                          />
                          <label
                            htmlFor='fname'
                            className='block text-sm font-medium text-gray-700 '
                          >
                            {t(`event:${option}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                    {touched.conferenceType && errors.conferenceType ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {errors.conferenceType}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label
                      htmlFor='orgServiceCategory'
                      className='block text-sm font-medium text-gray-700'
                    >
                      {t('event:service_category')}
                    </label>
                    <div className='mt-1 flex rounded-md shadow-sm'>
                      <DropDownComponent
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.orgServiceCategory}
                        name='orgServiceCategory'
                        options={options}
                      />
                    </div>
                    {touched.orgServiceCategory && errors.orgServiceCategory ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {errors.orgServiceCategory}
                      </div>
                    ) : null}
                  </div>
                  <div className='mt-4'>
                    <Switch.Group as='div' className='flex items-center justify-between'>
                      <span className='flex-grow flex flex-col'>
                        <Switch.Label
                          as='span'
                          className='text-sm font-medium text-gray-900'
                          passive
                        >
                          {t('profile:welcome_pay_type_title')}
                        </Switch.Label>
                        <Switch.Description as='span' className='text-sm text-gray-500'>
                          {t('profile:welcome_pay_type_desc')}
                        </Switch.Description>
                      </span>
                      <Switch
                        checked={values.isPaid}
                        onChange={() =>
                          values.isPaid
                            ? setFieldValue('isPaid', false)
                            : setFieldValue('isPaid', true)
                        }
                        className={classNames(
                          values.isPaid ? 'bg-mainBlue' : 'bg-gray-200',
                          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                        )}
                      >
                        <span
                          aria-hidden='true'
                          className={classNames(
                            values.isPaid ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                          )}
                        />
                      </Switch>
                    </Switch.Group>
                  </div>

                  {values.isPaid ? (
                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <label
                          htmlFor='currency'
                          className='block text-sm font-medium text-gray-700'
                        >
                          {t('profile:currency')}
                        </label>
                        <select
                          value={values.currency}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id='currency'
                          name='currency'
                          className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue sm:text-sm'
                        >
                          {SelectCurrencies}
                        </select>
                        {touched.currency && errors.currency ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.currency}
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                          {t('event:price')}
                        </label>
                        <input
                          value={values.price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type='number'
                          min={5}
                          name='price'
                          id='price'
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  focus:ring-mainBlue sm:text-sm'
                        />
                        {touched.price && errors.price ? (
                          <div className='text-red-500 mt-2 text-sm font-normal'>
                            {errors.price}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <div className='mt-4'>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                      {t('common:Description')}
                    </label>
                    <textarea
                      rows={4}
                      onChange={handleChange}
                      name='description'
                      value={values.description}
                      id='description'
                      className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                    />
                    {touched.description && errors.description ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {errors.description}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className='py-5 text-right sm:px-6'>
                  {buttonText === 'Skip' ? (
                    <button
                      type='button'
                      onClick={handleSkip}
                      className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      {buttonText}
                    </button>
                  ) : (
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                    >
                      {buttonText}
                    </button>
                  )}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default AddOrgServices;
