import {Elements} from '@stripe/react-stripe-js';
import PaymentMethodForm from 'components/PostLogin/Extensions/PaymentMethodForm';
import getStripe from 'utils/getStripe';

const ElementsFormWrapper = ({secret, setShowMethodForm, customerId}) => (
  <div className='w-full flex justify-center'>
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret: secret,
      }}
    >
      <PaymentMethodForm setShowMethodForm={setShowMethodForm} customerId={customerId} />
    </Elements>
  </div>
);

export default ElementsFormWrapper;
