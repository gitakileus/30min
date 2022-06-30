import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const validateRecaptcha = async (token: string): Promise<boolean> => {
      const secret = process.env.RECAPTCHA_SECRET_KEY;
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      return data.success;
    };

    const human = await validateRecaptcha(req.body.captchaToken);
    if (!human) {
      res.status(400);
      res.json({errors: ['Recaptca validation failed']});
      return null;
    }

    const {data: signInData} = await graphqlRequestHandler(
      mutations.handleOtpSignIn,
      {
        email: req.body?.email,
      },
      process.env.BACKEND_API_KEY
    );

    if (signInData.data.handleOtpSignIn?.status === 404) {
      return res.status(404).send({message: 'Account Not Found'});
    }

    return res.status(200).send({message: 'OTP SignIn Response', signInData});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
