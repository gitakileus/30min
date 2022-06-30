import TextField, {UrlInput} from 'components/shared/TextField/TextField';
import {Form} from 'formik';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

export default function AddEditForm({
  apiError,
  values,
  errors,
  touched,
  setFieldValue,
  handleBlur,
  handleChange,
  handleSubmit,
  descLength,
  setDescLength,
  isSubmitting,
  handleImage,
  imageError,
  type,
}) {
  const {t} = useTranslation();

  const RestrictionLevelPicker = [
    {
      value: 'RESTRICTED',
      key: 'RESTRICTED - Invite Required',
    },
    {value: 'OPEN', key: 'OPEN - No Invite Required'},
    {value: 'LOCKED', key: 'LOCKED - No New Members'},
  ].map(option => (
    <option key={option.key} value={option.value}>
      {option.key}
    </option>
  ));

  const MediaPikcer = [
    {key: t('Select'), value: 'None'},
    {
      key: t('common:txt_media_type_google'),
      value: 'Google Slides',
    },
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ].map(option => (
    <option key={option.key} value={option.value}>
      {option.value}
    </option>
  ));

  const PrivatePicker = [
    {key: 'Public Organization', value: 'false'},
    {key: 'Private Organzation', value: 'true'},
  ].map(option => (
    <option key={option.key} value={option.value}>
      {option.key}
    </option>
  ));

  return (
    <Form onSubmit={handleSubmit}>
      <div className='bg-white rounded-lg border shadow-lg mt-5 mb-5'>
        <div className='py-6 px-4 sm:p-6 lg:pb-8'>
          <div className='mt-6 row'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6 sm:col-span-3'>
                <div className='mt-6 lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0'>
                  <div className='relative overflow-hidden lg:block'>
                    <img
                      className='relative w-24 h-24 object-contain object-center'
                      src={values.image || '/assets/default-profile.jpg'}
                      alt=''
                    />
                    <label className='absolute inset-0 w-24 h-24 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100'>
                      <span>Change</span>
                      <input
                        id='user-photo'
                        name='user-photo'
                        accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png,'
                        type='file'
                        onChange={e =>
                          handleImage(e).then(res => {
                            setFieldValue('image', res);
                          })
                        }
                        className='absolute inset-0 w-24 h-24 opacity-0 cursor-pointer border-gray-300 rounded-md'
                      />
                    </label>
                  </div>
                </div>
                {imageError && imageError ? (
                  <div className='text-red-500 mt-2 text-xs font-normal'>{imageError}</div>
                ) : null}
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'common:organization_name'}
                  name={'title'}
                  value={values.title}
                  errors={errors}
                  touched={touched}
                  onChange={(e: {target: {value: string}}) => {
                    const {value} = e.target;
                    setFieldValue('title', value);
                    setFieldValue('slug', value.toLowerCase().replace(/[^a-z0-9]+/gi, '-'));
                  }}
                  onBlur={handleBlur}
                />
              </div>
              {type === 'create' && (
                <div className='col-span-6 sm:col-span-3'>
                  <TextField
                    label={'common:owner_email'}
                    name={'ownerEmail'}
                    value={values.ownerEmail}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              )}
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'common:slug'}
                  name={'slug'}
                  value={values.slug}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <UrlInput
                  label={'common:website'}
                  name={'website'}
                  value={values.website}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'common:headline'}
                  name={'headline'}
                  value={values.headline}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'common:location'}
                  name={'location'}
                  value={values.location}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'common:support_email'}
                  name={'supportEmail'}
                  value={values.supportEmail}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'common:support_phone'}
                  name={'supportPhone'}
                  value={values.supportPhone}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6'>
                <CKEditor
                  name={t('common:Description')}
                  setDescLength={setDescLength}
                  value={values.description}
                  onChange={data => {
                    setFieldValue('description', data);
                  }}
                />
                {descLength}/750
                {touched.description && errors.description ? (
                  <div className='text-red-500 mt-2 text-sm font-normal'>
                    {t('common:desc_required')}
                  </div>
                ) : null}
              </div>
              <div className='col-span-6 sm:col-span-2'>
                {values.type === 'None' || values.type === '' ? (
                  <>
                    <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                      {t('common:txt_media_link_label')}
                    </label>
                    <input
                      type='text'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.link}
                      name='link'
                      id='link'
                      className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                  </>
                ) : (
                  <>
                    <label htmlFor='mediaLink' className='block text-sm font-medium text-gray-700'>
                      {t('common:txt_media_link_label')}
                    </label>
                    <input
                      type='text'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.link}
                      name='link'
                      required
                      id='link'
                      className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                  </>
                )}
              </div>

              <div className='col-span-6 sm:col-span-1'>
                <label htmlFor='mediaType' className='block text-sm font-medium text-gray-700'>
                  {t('common:txt_media_type_label')}
                </label>
                <select
                  value={values.type}
                  onChange={e => {
                    setFieldValue('type', e.target.value);
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  id='type'
                  name='type'
                  className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                >
                  {MediaPikcer}
                </select>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                  {t('common:restriction_level')}
                </label>
                <div className='mt-1 rounded-md shadow-sm flex'>
                  <select
                    onChange={handleChange}
                    value={values.restrictionLevel}
                    id='restrictionLevel'
                    name='restrictionLevel'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                  >
                    {RestrictionLevelPicker}
                  </select>
                </div>
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                  {t('common:is_private')}
                </label>
                <div className='mt-1 rounded-md shadow-sm flex'>
                  <select
                    onChange={handleChange}
                    value={values.isPrivate}
                    id='isPrivate'
                    name='isPrivate'
                    className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                  >
                    {PrivatePicker}
                  </select>
                </div>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'Facebook'}
                  name={'facebook'}
                  value={values.facebook}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'Instagram'}
                  name={'instagram'}
                  value={values.instagram}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'LinkedIn'}
                  name={'linkedin'}
                  value={values.linkedin}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'Twitter'}
                  name={'twitter'}
                  value={values.twitter}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className='col-span-6 sm:col-span-3'>
                <TextField
                  label={'YouTube'}
                  name={'youtube'}
                  value={values.youtube}
                  errors={errors}
                  touched={touched}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <hr className='mt-8' />
            <div className='py-4 flex justify-end'>
              {isSubmitting ? (
                <button disabled={isSubmitting} className='btn btn-primary btn-block'>
                  {t('common:txt_loading1')}
                </button>
              ) : (
                <button
                  type='submit'
                  className='ml-2 bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  {t('common:btn_save')}
                </button>
              )}
              {apiError ? (
                <div className='text-red-500 mt-2 text-sm font-normal'>{apiError}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
