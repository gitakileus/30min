import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import formatCurrency from 'utils/formatCurrency';

const ProductCard = ({pricingData, isActive, activateProduct, cancelSubscription, loadingData}) => {
  const {t} = useTranslation();
  const imageLink = pricingData.product.images[0] ? pricingData.product.images[0] : '';
  const {type, resourceLink} = pricingData.product.metadata;

  const recurringInterval = pricingData?.recurring?.interval
    ? `/${pricingData?.recurring?.interval}`
    : '';

  const isLoading = loadingData.productId === pricingData.product.id && loadingData.loading;
  const isDisabled = loadingData.loading && isActive;

  return (
    <div className='flex flex-col col-span-12 sm:col-span-6 lg:col-span-4 shadow-md divide-y divide-gray-200 rounded-md'>
      <div className='px-4 py-5 grid grid-cols-12 h-full w-full gap-4'>
        <div className='flex justify-center items-center col-span-4'>
          <img
            className='w-full'
            src={imageLink}
            alt={`Display Image for ${pricingData.product.name} Extension`}
          />
        </div>
        <div className='flex flex-col col-span-8 gap-1'>
          <span className='font-bold w-full break-words'>{pricingData.product.name}</span>
          <span className='text-xs break-words w-full'>{pricingData.product.description}</span>
        </div>
      </div>
      <div className='px-4 py-5 flex justify-between items-center'>
        {isActive && pricingData.type === 'recurring' ? (
          <button
            disabled={isDisabled}
            onClick={() => {
              cancelSubscription(pricingData);
            }}
            className='disabled:opacity-25 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            {isLoading ? t('common:btn_canceling') : t('common:btn_cancel')}
          </button>
        ) : isActive && pricingData.type === 'one_time' ? (
          <button
            disabled={isDisabled}
            onClick={() => {
              cancelSubscription(pricingData);
            }}
            className='disabled:opacity-25 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            {isLoading ? t('common:btn_removing') : t('common:btn_remove')}
          </button>
        ) : (
          <button
            disabled={isDisabled || type === 'coming_soon'}
            onClick={() => {
              activateProduct(pricingData);
            }}
            className='disabled:opacity-50 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {type === 'coming_soon'
              ? t('common:coming_soon')
              : isLoading
              ? t('common:Activating')
              : t('common:Activate')}
          </button>
        )}
        {resourceLink && (
          <Link href={resourceLink} passHref>
            <a className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
              Extension Page
            </a>
          </Link>
        )}
        {type === 'active' && (
          <span className='font-semibold'>
            {pricingData.product.metadata?.isFree
              ? 'Free'
              : formatCurrency.format(pricingData.unit_amount / 100)}
            {recurringInterval}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
