/* eslint-disable @typescript-eslint/dot-notation */
import {useSession} from 'next-auth/react';
import React, {useState} from 'react';
import ProductCard from 'components/PostLogin/Extensions/ProductCard';
import axios from 'axios';
import {useStripe} from '@stripe/react-stripe-js';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {useRouter} from 'next/router';
import activeExtensionsQueries from 'constants/GraphQL/ActiveExtension/queries';
import activeExtensionsMutations from 'constants/GraphQL/ActiveExtension/mutations';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import formatCurrency from 'utils/formatCurrency';
import createSubscriptionHandler from 'utils/createSubscriptionHandler';
import chargeCardHandler from 'utils/chargeCardHandler';
import PaymentMethodWarning from './PaymentMethodWarning';
import PaymentError from './PaymentError';

const ExtensionsContainer = ({
  prices,
  paymentMethods,
  customerId,
  activeExtensions,
  hasCustomerId,
  hasPaymentMethod,
}) => {
  const stripe = useStripe();
  const {data: session} = useSession();
  const router = useRouter();
  const {showModal, hideModal} = ModalContextProvider();
  const {t} = useTranslation();

  const [showPaymentMethodWarning, setShowPaymentMethodWarning] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [loadingData, setLoadingData] = useState({
    productId: '',
    loading: false,
  });

  const activateProduct = async priceObject => {
    try {
      setLoadingData({
        productId: priceObject.product.id,
        loading: true,
      });

      if (!priceObject.product?.metadata?.isFree && (!hasCustomerId || !hasPaymentMethod)) {
        setShowPaymentMethodWarning(true);
        setLoadingData({
          productId: '',
          loading: false,
        });
        hideModal();
        return;
      }

      if (priceObject.type === 'recurring') {
        const response = await createSubscriptionHandler(
          session,
          priceObject,
          customerId,
          stripe,
          paymentMethods
        );

        if (!response.success) {
          setPaymentError(response.message);
        }
      }

      if (priceObject.type === 'one_time') {
        const response = await chargeCardHandler(priceObject, customerId, session, paymentMethods);
        if (!response.success) {
          setPaymentError(response.message);
        }
      }

      router.reload();
    } catch (err) {
      hideModal();
      setPaymentError('Unknown Error');
      setLoadingData({
        productId: '',
        loading: false,
      });
    }
  };

  const cancelSubscription = async priceObject => {
    try {
      await axios.post('/api/stripe/cancelSubscription', {
        productId: priceObject.id,
      });

      router.reload();
    } catch (err) {
      console.log('Unknown Error');
      hideModal();
    }
  };

  const removeFreeExtenstion = async priceObject => {
    try {
      const {data: extensionDataResponse} = await graphqlRequestHandler(
        activeExtensionsQueries.getActiveExtensionByProductId,
        {
          token: session?.accessToken,
          productId: priceObject?.id,
        },
        session?.accessToken
      );

      const {_id: documentId} =
        extensionDataResponse.data.getActiveExtensionByProductId.activeExtensionData;

      await graphqlRequestHandler(
        activeExtensionsMutations.deleteActiveExtension,
        {
          token: session?.accessToken,
          documentId,
        },
        session?.accessToken
      );
      router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const sortedPrices = prices.sort((a, b) => {
    if (a?.product?.metadata?.type === 'active' && b?.product?.metadata?.type === 'coming_soon') {
      return -1;
    }
    if (a?.product?.metadata?.type === 'coming_soon' && b?.product?.metadata?.type === 'active') {
      return 1;
    }
    return 0;
  });

  return (
    <div className='flex flex-col gap-4'>
      {showPaymentMethodWarning ? (
        <PaymentMethodWarning
          closeWarning={() => {
            setShowPaymentMethodWarning(false);
          }}
        />
      ) : null}
      {paymentError ? (
        <PaymentError
          closeError={() => {
            setPaymentError('');
          }}
          errorMessage={paymentError}
        />
      ) : null}
      <div className='grid grid-cols-12 gap-4'>
        {sortedPrices.map((price, index) => {
          if (price.product.metadata?.type !== 'disabled') {
            return (
              <ProductCard
                key={index}
                pricingData={price}
                isActive={activeExtensions.includes(price.id)}
                activateProduct={priceObject => {
                  showModal(MODAL_TYPES.CONFIRM, {
                    handleConfirm: () => {
                      activateProduct(priceObject);
                    },
                    title: `${t('common:Activate')} ${priceObject.product.name} ${t(
                      'common:for'
                    )} ${formatCurrency.format(priceObject.unit_amount / 100)}${
                      priceObject?.recurring?.interval ? `/${priceObject?.recurring?.interval}` : ''
                    }?`,
                    message: t('common:extension_confirmation_message'),
                  });
                }}
                cancelSubscription={priceObject => {
                  showModal(MODAL_TYPES.CONFIRM, {
                    handleConfirm: () => {
                      priceObject?.product?.metadata?.isFree
                        ? removeFreeExtenstion(priceObject)
                        : cancelSubscription(priceObject);
                    },

                    title: priceObject?.product?.metadata?.isFree
                      ? t('common:extension_cancel_free_title')
                      : t('common:extension_cancel_title'),
                    message: priceObject?.product?.metadata?.isFree
                      ? `${t('common:extension_cancel_free_question')} ${priceObject.product.name}?`
                      : `${t('common:extension_cancel_question')} ${priceObject.product.name}?`,
                  });
                }}
                loadingData={loadingData}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ExtensionsContainer;
