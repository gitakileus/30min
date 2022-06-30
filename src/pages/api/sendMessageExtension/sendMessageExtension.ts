import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutation from 'constants/GraphQL/SendMessageExtention/mutations';

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

    const human = await validateRecaptcha(req.body.captcha);
    if (!human) {
      res.status(400);
      res.json({errors: ['Recaptca validation failed']});
      return null;
    }

    const {data: sendMessage} = await graphqlRequestHandler(
      mutation.createMessage,
      {
        messageData: {
          name: req.body.name,
          subject: req.body.subject,
          description: req.body.description,
          email: req.body.email,
          phone: req.body.phone,
          providerName: req.body.providerName,
          providerEmail: req.body.providerEmail,
          captcha: req.body.captcha,
        },
      },
      process.env.BACKEND_API_KEY
    );

    return res.status(200).send({message: 'Query Successful', sendMessage});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
