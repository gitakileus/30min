import {PAYMENT_ACCOUNTS, PAYMENT_TYPE} from 'constants/enums';

export default function validateProviderReceivingCapabilities(user, service) {
  if (
    service?.price > 0 &&
    [PAYMENT_TYPE.DIRECT, PAYMENT_TYPE.ESCROW].includes(service.paymentType)
  ) {
    if (
      service.paymentType === PAYMENT_TYPE.DIRECT &&
      user?.accountDetails?.paymentAccounts?.direct.includes(PAYMENT_ACCOUNTS.STRIPE)
    ) {
      return true;
    }
    if (
      service.paymentType === PAYMENT_TYPE.ESCROW &&
      user?.accountDetails?.paymentAccounts?.escrow.includes(PAYMENT_ACCOUNTS.STRIPE)
    ) {
      return true;
    }
    return false;
  }
  return true;
}
