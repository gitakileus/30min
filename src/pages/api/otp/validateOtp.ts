import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: validateData} = await graphqlRequestHandler(
      mutations.validateOtp,
      {
        email: req.body?.email,
        otpToken: req.body?.otpToken,
      },
      process.env.BACKEND_API_KEY
    );

    return res.status(200).send({message: 'OTP Token Response', validateData});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
