import type {NextApiRequest, NextApiResponse} from 'next';
import getOfficeBusyTimes from 'utils/getOfficeBusyTimes';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import getGoogleBusyTimes from 'utils/getGoogleBusyTimes';
import userQueries from '../../../constants/GraphQL/User/queries';
import integrationQueries from '../../../constants/GraphQL/Integrations/queries';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {data: userDataResults} = await graphqlRequestHandler(
      userQueries.getUserByUsername,
      {
        username: req.body.username,
      },
      process.env.BACKEND_API_KEY
    );

    const userResults = userDataResults.data.getUserByUsername;

    if (userResults.response.status === 404) {
      return res.status(404).send({message: 'User Document Not Found'});
    }

    // eslint-disable-next-line no-underscore-dangle
    const userId = userResults.userData._id;

    const {data: credentialsData} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByUserId,
      {
        userId: userId,
      },
      process.env.BACKEND_API_KEY
    );

    const credentialsResults = credentialsData.data.getCredentialsByUserId;

    if (credentialsResults.response.status === 404) {
      return res.status(404).send({message: 'Credentials Not Found'});
    }

    const {startTime, endTime} = req.body;
    // Example Formatted Values
    // startTime = '2022-01-10T16:00:00';
    // endTime = '2022-02-10T16:30:00';

    const googleBusyTimes = await Promise.all(
      credentialsResults.googleCredentials.map(async credential => {
        const busyData = await getGoogleBusyTimes(credential.credentials, startTime, endTime);
        return busyData.data.calendars?.primary.busy;
      })
    );

    const officeBusyTimes = await Promise.all(
      credentialsResults.officeCredentials.map(async credential => {
        const busyData = await getOfficeBusyTimes(credential, startTime, endTime);
        return busyData;
      })
    );

    return res.status(200).send({message: 'Query Successful', googleBusyTimes, officeBusyTimes});
  } catch (err) {
    return res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
