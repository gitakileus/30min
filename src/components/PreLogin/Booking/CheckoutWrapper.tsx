import {Elements} from '@stripe/react-stripe-js';
import getStripe from 'utils/getStripe';
import CheckOutForm from './CheckOutForm';

const CheckoutWrapper = ({
  selectedBookerTimezone,
  serviceData,
  user,
  formPayload,
  clientSecret,
}) => (
  <>
    {serviceData.paymentType !== 'escrow' ? (
      <Elements stripe={getStripe(user.accountDetails.stripeAccountId)} options={{clientSecret}}>
        <CheckOutForm
          selectedBookerTimezone={selectedBookerTimezone}
          serviceData={serviceData}
          user={user}
          formPayload={formPayload}
          clientSecret={clientSecret}
        />
      </Elements>
    ) : (
      <Elements stripe={getStripe()} options={{clientSecret}}>
        <CheckOutForm
          selectedBookerTimezone={selectedBookerTimezone}
          serviceData={serviceData}
          user={user}
          formPayload={formPayload}
          clientSecret={clientSecret}
        />
      </Elements>
    )}
  </>
);

export default CheckoutWrapper;
