import {FormikErrors, FormikTouched} from 'formik';

type Props = {
  title?: string;
  description?: string;
  uploadText?: string;
  uploaded?: boolean;
  imagePath?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[];
};
const UploadImage = ({uploaded, imagePath, handleChange}: Props) => (
  <>
    <div className='row ml-1'>
      <div className=''>
        <div className='mt-1 position-relative w-full'>
          {uploaded ? (
            <>
              <label>
                <div className='w-36 h-36 rounded-md overflow-hidden'>
                  <img
                    className='w-full h-full object-contain object-center'
                    src={imagePath}
                    width='256px'
                    height='256px'
                    alt=''
                  />
                </div>
                <input
                  type='file'
                  name='image'
                  onChange={handleChange}
                  accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png'
                  id='image'
                  className='opacity-0'
                />
              </label>
            </>
          ) : (
            <>
              <label className='flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100'>
                <div className='flex flex-col items-center justify-center pt-7'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    stroke='currentColor'
                    fill='none'
                    viewBox='0 0 48 48'
                    aria-hidden='true'
                  >
                    <path
                      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <p className='pt-1 text-sm tracking-wider  text-gray-400 group-hover:text-gray-600'>
                    Allowed *.jpeg, *.jpg, *.png, *.gif{' '}
                    <p className='flex justify-center items-center'>Max size of 2 MB 256 x 256</p>
                  </p>
                </div>
                <input
                  type='file'
                  name='image'
                  onChange={handleChange}
                  accept='image/gif,image/jpeg,image/png,.gif,.jpeg,.jpg,.png,'
                  id='image'
                  className='opacity-0'
                />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  </>
);

export default UploadImage;
