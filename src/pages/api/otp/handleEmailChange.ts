import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutations from '../../../constants/GraphQL/User/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: emailChangeData} = await graphqlRequestHandler(
      mutations.handleEmailChange,
      {
        email: req.body?.email,
      },
      process.env.BACKEND_API_KEY
    );

    if (emailChangeData.data.handleEmailChange?.status === 404) {
      return res.status(404).send({message: 'Account Not Found'});
    }

    return res.status(200).send({message: 'OTP Email Change Response', emailChangeData});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
