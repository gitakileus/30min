import React, {useState, ChangeEvent, useEffect, useContext, useRef} from 'react';
import router from 'next/router';
import {Formik, Form} from 'formik';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {ORGANIZATION_YUP, ORGANIZATION_STATE} from 'constants/yup/organization';
import {useSession} from 'next-auth/react';
import {useMutation, useQuery} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import useTranslation from 'next-translate/useTranslation';
import UploadImage from 'components/shared/UploadImage/UploadImage';
import dynamic from 'next/dynamic';
import {NotificationContext} from 'store/Notification/Notification.context';
import queries from 'constants/GraphQL/User/queries';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import DropDownComponent from 'components/shared/DropDownComponent';
import slug from 'slug';
import {TrashIcon} from '@heroicons/react/solid';
import ExtensionRequiredModal from 'components/PostLogin/Organizations/ExtensionRequiredModal';
import Modal from '../Modal';

const CKEditor = dynamic(() => import('components/shared/Ckeditor/Ckeditor'), {ssr: false});

const OrganizationModal = () => {
  const {t} = useTranslation();

  const {hideModal, store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {orgId, initdata, hasOrgExtension} = modalProps || {};
  const [imageError, setErrorimage] = useState('');
  const isAdd = !orgId;

  const ref = useRef(null);
  const [hashTags, setHashtags] = useState(initdata?.searchTags || []);
  const [hashTagValue, setHashTagValue] = useState('');
  const [HashtagError, setHashtagErrorMessage] = useState('');

  const onChange = e => {
    setHashTagValue(e.target.value);
  };

  const {data: session} = useSession();
  const [PubImage, setImage] = useState('');
  const [createMutation] = useMutation(mutations.createOrganization);
  const [editMutation] = useMutation(mutations.editOrganization);
  const [slugError, setSlugError] = useState('');

  const {data: userData} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  const userUsername = userData?.getUserById?.userData?.accountDetails?.username;

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const [descLength, setDescLength] = useState(
    initdata?.description
      ? (initdata.description || '').replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/gi, ' ').length
      : 0
  );
  const SelectMediaType = [
    {key: t('Select'), value: 'None'},
    {
      key: t('common:txt_media_type_google'),
      value: 'Google Slides',
      selected: 'meetingType',
    },
    {key: t('common:txt_media_type_youtube'), value: 'Youtube Embed'},
  ];

  const MediaTypeSelect = SelectMediaType.map(currency => (
    <option key={currency.key}>{currency.value}</option>
  ));

  const selectRestrictedLevel = [
    {
      value: 'RESTRICTED',
      key: 'RESTRICTED - Invite Required',
    },
    {value: 'OPEN', key: 'OPEN - No Invite Required'},
    {value: 'LOCKED', key: 'LOCKED - No New Members'},
  ];

  useEffect(() => {
    setImage(initdata?.image);
  }, [initdata?.image]);

  const AddOrganization = async (values, setSubmitting) => {
    try {
      if (PubImage === ' ' || PubImage === '' || PubImage === null || PubImage === undefined) {
        setErrorimage('Please upload an image');
        setSubmitting(false);
        return;
      }
      const restrictionData = values.restrictionLevel.split(' - ')[0];
      const response = await createMutation({
        variables: {
          organizationData: {
            title: values.title,
            slug: slug(values.slug),
            headline: values.headline,
            description: values.description,
            website: values.website,
            supportEmail: values.supportEmail,
            supportPhone: values.supportPhone,
            location: values.location,
            restrictionLevel: restrictionData,
            searchTags: hashTags,
            socials: {
              twitter: values.socials.twitter,
              instagram: values.socials.instagram,
              linkedin: values.socials.linkedin,
              facebook: values.socials.facebook,
              youtube: values.socials.youtube,
            },
            media: {
              type: values.media.type,
              link: values.media.link,
            },
            isPrivate: values.isPrivate,
            image: PubImage,
          },
          token: session?.accessToken,
        },
      });
      if (response.data.createOrganization.status === 409) {
        setSubmitting(false);
        setSlugError(response.data.createOrganization.message);
      } else {
        showNotification(NOTIFICATION_TYPES.info, 'Organization successfully added', false);
        router.reload();
        setSubmitting(false);
      }
      setSubmitting(false);
    } catch (err) {
      console.log('Unknown Error');
    }
  };

  const EditOrganization = async (id, values, setSubmitting) => {
    if (PubImage === ' ' || PubImage === '' || PubImage === null || PubImage === undefined) {
      setErrorimage('Please upload an image');
      setSubmitting(false);
      return;
    }
    const restrictionData = values.restrictionLevel.split(' - ')[0];
    const response = await editMutation({
      variables: {
        organizationData: {
          title: values.title,
          slug: slug(values.slug),
          headline: values.headline,
          description: values.description,
          website: values.website,
          supportEmail: values.supportEmail,
          supportPhone: values.supportPhone,
          location: values.location,
          searchTags: hashTags,
          restrictionLevel: restrictionData,
          socials: {
            twitter: values.socials.twitter,
            instagram: values.socials.instagram,
            linkedin: values.socials.linkedin,
            facebook: values.socials.facebook,
            youtube: values.socials.youtube,
          },
          media: {
            type: values.type,
            link: values.link,
          },
          isPrivate: values.isPrivate,
          image: PubImage,
        },
        token: session?.accessToken,
        documentId: id,
      },
    });
    if (response.data.editOrganization.status === 409) {
      setSubmitting(false);
      setSlugError(response.data.editOrganization.message);
    } else {
      showNotification(NOTIFICATION_TYPES.info, 'Organization successfully edited', false);
      router.reload();
      setSubmitting(false);
    }
    setSubmitting(false);
  };

  const [mutateImageUpload] = useMutation(singleUpload);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];

    try {
      if (valid) {
        const response = await mutateImageUpload({
          variables: {
            file: image,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          showNotification(NOTIFICATION_TYPES.error, 'Maximum size allowed is 2MB', false);
          setErrorimage('Maximum size allowed is 2MB');
          return;
        }
        setErrorimage('');
        setImage(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        showNotification(NOTIFICATION_TYPES.error, 'Maximum size allowed is 2MB', false);
        setErrorimage('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const handleFileEDIT = async (event: ChangeEvent<HTMLInputElement>) => {
    const {valid} = event.target.validity;
    const image = event.target.files![0];

    try {
      if (valid) {
        const response = await mutateImageUpload({
          variables: {
            uploadType: 'EDIT_ORGANIZATION_IMAGE',
            documentId: orgId,
            file: image,
            accessToken: session?.accessToken,
          },
        });
        if (
          response.data.singleUpload.status === 400 ||
          response.data.singleUpload.status === 409 ||
          response.data.statusCode === 413
        ) {
          setErrorimage('Maximum size allowed is 2MB');
          return;
        }
        setErrorimage('');
        setImage(response.data.singleUpload.message);
      }
    } catch (e) {
      if (
        e.response.status === 400 ||
        e.response.status === 409 ||
        e.response.status === 413 ||
        e.response.status === 404
      ) {
        setErrorimage('Image too large. Maximum size is 2 MB.');
        return;
      }
      console.log('error', e);
    }
  };

  const submitHandler = async (values, setSubmitting) => {
    if (isAdd) {
      AddOrganization(values, setSubmitting);
    } else {
      EditOrganization(orgId, values, setSubmitting);
    }
  };

  if (!hasOrgExtension) {
    return (
      <Modal title='Extension Required' small>
        <ExtensionRequiredModal hideModal={hideModal} />
      </Modal>
    );
  }

  return (
    <Modal
      title={
        isAdd
          ? t('common:add_organization')
          : `${`${t('common:edit_organization')} ${initdata.title}`}`
      }
    >
      <Formik
        initialValues={isAdd ? ORGANIZATION_STATE : initdata}
        validationSchema={ORGANIZATION_YUP}
        onSubmit={(values, {setSubmitting}) => {
          submitHandler(values, setSubmitting);
        }}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          isSubmitting,
          setFieldValue,
          handleChange,
          isValid,
          submitCount,
        }) => {
          const customHandleChange = async e => {
            const {name, value} = e.target;
            if (name === 'title') {
              setFieldValue('title', value);
              setFieldValue('slug', slug(value));
            } else {
              setFieldValue(name, value);
            }
          };

          const submitUserHashag = async e => {
            const regex = /^.{1}[a-zA-Z0-9\s\\-]{0,20}$/;
            const inValid = regex.exec(e.toLowerCase());

            if (e === '# ' || e === '') {
              setHashtagErrorMessage(t('profile:no_empty_hashtags'));
              return;
            }
            if (!inValid) {
              setHashtagErrorMessage(t('profile:no_special_characters_allowed'));
              return;
            }
            setHashtagErrorMessage('');

            if (hashTags.length >= 20) {
              setHashtagErrorMessage(t('profile:no_more_hashtags'));
              return;
            }

            if (hashTags.indexOf(e) !== -1) {
              setHashtagErrorMessage(t('profile:hashtag_already_exists'));
              return;
            }
            setHashtags([...hashTags, e]);
            setHashTagValue('');
          };

          const removeUserHashtag = async toRemove => {
            const currentTags = hashTags;
            const newTags = currentTags.filter(hashValue => hashValue !== toRemove);

            setHashtags(newTags);
          };

          return (
            <Form>
              <>
                <div className='px-4 my-3 sm:mb-4 text-right sm:px-6'>
                  {!isValid && submitCount > 0 && (
                    <div className='text-red-500 mt-2 text-sm font-normal  mb-2'>
                      {t('profile:formik_errors_invalid')}
                    </div>
                  )}
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
                    {t('common:btn_save')}
                  </button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:organization_Name')}*
                      </label>
                    </div>
                    <input
                      value={values.title}
                      onChange={customHandleChange}
                      onBlur={handleBlur}
                      type='text'
                      name='title'
                      id='title'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.title && errors.title ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.title}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <label htmlFor='last-name' className='block text-sm font-medium text-gray-700'>
                      {t('common:slug')}
                    </label>
                    <div className='mt-1 flex rounded-md shadow-sm'>
                      <span className='hidden sm:inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                        https://30mins.com/{userUsername}/
                      </span>
                      <input
                        type='text'
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name='slug'
                        id='slug'
                        className='flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-mainBlue  focus:border-mainBlue sm:text-sm border-gray-300'
                      />
                    </div>
                    {slugError && slugError ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{slugError}</div>
                    ) : null}
                    {touched.slug && errors.slug ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.slug}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('profile:Headline')}*
                      </label>
                    </div>
                    <input
                      value={values.headline}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={160}
                      type='text'
                      name='headline'
                      id='headline'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.headline && errors.headline ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.headline}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:location')}*
                      </label>
                    </div>
                    <input
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={160}
                      type='text'
                      name='location'
                      id='location'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.location && errors.location ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.location}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:organization_website')}
                      </label>
                    </div>
                    <input
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='website'
                      id='website'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.website && errors.website ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.website}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-1'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:support_email')}
                      </label>
                    </div>
                    <input
                      value={values.supportEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='supportEmail'
                      id='supportEmail'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.supportEmail && errors.supportEmail ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {errors.supportEmail}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-1'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:support_phone')}
                      </label>
                    </div>
                    <input
                      value={values.supportPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='supportPhone'
                      id='supportPhone'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.supportPhone && errors.supportPhone ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {errors.supportPhone}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:restriction_level')}
                      </label>
                    </div>
                    <DropDownComponent
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.restrictionLevel}
                      name='restrictionLevel'
                      options={selectRestrictedLevel}
                    />
                  </div>
                  <div className='col-span-4 sm:col-span-1'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:twitter_link')}
                      </label>
                    </div>
                    <input
                      value={values?.socials.twitter}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='socials.twitter'
                      id='socials.twitter'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.twitter && errors.twitter ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.twitter}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-1'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:facebook_link')}
                      </label>
                    </div>
                    <input
                      value={values?.socials.facebook}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='socials.facebook'
                      id='socials.facebook'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />{' '}
                    {touched.facebook && errors.facebook ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{errors.facebook}</div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-1'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:instagram_link')}
                      </label>{' '}
                    </div>{' '}
                    <input
                      value={values?.socials.instagram}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='socials.instagram'
                      id='socials.instagram'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />{' '}
                    {touched.instagram && errors.instagram ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {t('common:desc_required')}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-1'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('event:linkedin_link')}
                      </label>
                    </div>
                    <input
                      value={values?.socials.linkedin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='socials.linkedin'
                      id='socials.linkedin'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.linkedin && errors.linkedin ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {t('common:desc_required')}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('profile:txt_youtube_link')}
                      </label>
                    </div>
                    <input
                      value={values?.socials.youtube}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={254}
                      type='text'
                      name='socials.youtube'
                      id='socials.youtube'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue  sm:text-sm'
                    />
                    {touched.youtube && errors.youtube ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {t('common:desc_required')}
                      </div>
                    ) : null}
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('common:txt_media_link_label')}
                      </label>
                    </div>
                    <input
                      value={values.media.link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type='text'
                      name='media.link'
                      id='media.link'
                      className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                    />
                  </div>
                  <div className='col-span-4 sm:col-span-2'>
                    <div className='flex'>
                      <label
                        htmlFor='first-name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        {t('common:txt_media_type_label')}
                      </label>
                    </div>
                    <select
                      value={values.media.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id='media.type'
                      name='media.type'
                      className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-mainBlue focus:border-gray-900 sm:text-sm'
                    >
                      {MediaTypeSelect}
                    </select>
                  </div>

                  <div className='col-span-4 sm:col-span-4'>
                    <label
                      htmlFor='txt_media_link_label'
                      className='block text-sm font-medium text-gray-700'
                    >
                      {t('profile:txt_user_hashtags')}
                    </label>
                    <div className='row ml-1'></div>
                    <div className='row mx-0 mb-3'>
                      <div className={'mt-1 rounded-md shadow-sm px-0 col-sm-9 flex'}>
                        <input
                          type='text'
                          name='hashtags'
                          maxLength={20}
                          ref={ref}
                          onChange={onChange}
                          value={hashTagValue}
                          id='hashtags'
                          className='mt-1 focus:ring-indigo-500 focus:border-mainBlue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        />
                        <button
                          className='min-w-max text-black hover:text-mainBlue duration-200 rounded-md px-2'
                          onClick={() => submitUserHashag(hashTagValue)}
                          type='button'
                        >
                          {t('profile:add_tag')}
                        </button>
                      </div>
                    </div>
                    {HashtagError && (
                      <div className={'focus:border-blue-500 text-red-600 ml-1 mb-1'}>
                        {HashtagError}
                      </div>
                    )}
                    {hashTags &&
                      hashTags?.map((tag, i) => (
                        <span
                          key={i}
                          className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 justify-between mr-1 mt-1'
                        >
                          {tag}
                          <button
                            className='ml-1 hover:text-red-500 duration-200 justify-end'
                            type='button'
                            onClick={() => {
                              removeUserHashtag(tag);
                            }}
                          >
                            <TrashIcon className='w-5 h-5' />
                          </button>
                        </span>
                      ))}
                  </div>
                  <div className='col-span-4 sm:col-span-2 my-auto'>
                    {PubImage ? (
                      <UploadImage
                        title={t('profile:Pub_image')}
                        description={t('common:desc_required')}
                        uploadText={t('profile:upload_img')}
                        uploaded={true}
                        handleChange={isAdd ? handleFileChange : handleFileEDIT}
                        imagePath={
                          typeof PubImage === 'string' ? PubImage : URL.createObjectURL(PubImage)
                        }
                      />
                    ) : (
                      <UploadImage
                        title={t('profile:Pub_image')}
                        description={t('common:desc_required')}
                        uploadText={t('profile:upload_img')}
                        handleChange={isAdd ? handleFileChange : handleFileEDIT}
                        uploaded={false}
                      />
                    )}

                    {touched.image && errors.image ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>
                        {t('common:desc_required')}
                      </div>
                    ) : null}
                    {imageError ? (
                      <div className='text-red-500 mt-2 text-sm font-normal'>{imageError}</div>
                    ) : null}
                  </div>
                  <div className='col-span-2'>
                    <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                      {t('common:Description')}*
                    </label>
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
                </div>
              </>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
export default OrganizationModal;
