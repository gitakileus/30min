import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/Organizations/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: orgData} = await graphqlRequestHandler(
      queries.getOrganizationsByTitle,
      {
        title: req.body.title,
      },
      process.env.BACKEND_API_KEY
    );

    return res.status(200).send({message: 'Query Successful', orgData});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
