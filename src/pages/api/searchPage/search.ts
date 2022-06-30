import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';

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

    const {data: queryData} = await graphqlRequestHandler(
      queries.getUserAndOrganizationSearchResults,
      {
        searchParams: {
          pageNumber: req.body.pageNumber,
          keywords: req.body.keywords,
          location: req.body.location,
          resultsPerPage: req.body.resultsPerPage,
          isIndividual: req.body.isIndividual,
        },
      },
      process.env.BACKEND_API_KEY
    );
    return res.status(200).send({message: 'Query Successful', queryData});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
