import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import mutation from 'constants/GraphQL/Organizations/mutations';
import {getSession} from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req: req});
  if (!session) {
    res.redirect(307, `/auth/login/`);
    return;
  }
  try {
    const {orgID, requestID} = req.query;
    await graphqlRequestHandler(
      mutation.acceptPendingJoinRequest,
      {
        pendingRequestId: requestID,
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );
    res.redirect(301, `/user/organizations/edit/${orgID}/?tab=pending+join+requests`);
  } catch (err) {
    res.redirect(
      307,
      `/user/organizations/edit/${req.query.orgID}/?tab=pending+join+requests&error=Error+Accepting+Join+Request`
    );
  }
};

export default handler;
