import * as Yup from 'yup';

export const OTP_STATE = {
  otpToken: '',
};

export const OTP_YUP = Yup.object().shape({
  otpToken: Yup.string().required('OTP Input Required'),
});
