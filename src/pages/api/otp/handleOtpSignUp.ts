import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/SignIn/mutations';
import domainQueries from '../../../constants/GraphQL/BlockedDomain/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const emailDomain = req.body.email.split('@')[1];

    const {data: domainResponse} = await graphqlRequestHandler(
      domainQueries.validateDomain,
      {domain: emailDomain},
      process.env.BACKEND_API_KEY
    );

    if (domainResponse.data.validateDomain.status !== 200) {
      res.status(400).send({message: 'Invalid Email Provided', error: 'Invalid Email Provided'});
      return;
    }

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
      return;
    }

    const {data: signUpData} = await graphqlRequestHandler(
      mutations.handleOtpSignUp,
      {
        email: req.body?.email,
        name: req.body?.name,
      },
      process.env.BACKEND_API_KEY
    );

    if (signUpData.data.handleOtpSignUp?.status === 409) {
      res.status(409).send({message: 'Email Already in Use'});
      return;
    }

    res.status(200).send({message: 'OTP SignUp Response', signUpData});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
