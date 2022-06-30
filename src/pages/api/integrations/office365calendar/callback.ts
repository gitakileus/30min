import {getSession} from 'next-auth/react';
import type {NextApiRequest, NextApiResponse} from 'next';
import queries from 'constants/GraphQL/User/queries';
import axios from 'axios';
import graphqlRequestHandler from '../../../../utils/graphqlRequestHandler';
import {addOffice365Calendar} from '../../../../constants/GraphQL/Integrations/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: {error},
  } = req;

  try {
    const session = await getSession({req: req});
    const {data: userDataResults} = await graphqlRequestHandler(
      queries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );
    const userResults = userDataResults.data.getUserById;

    const isWelcomeComplete = userResults?.userData?.welcomeComplete;

    if (error && isWelcomeComplete) {
      res.redirect(301, '/user/integrations');
      return;
    }

    if (error && !isWelcomeComplete) {
      res.redirect(301, '/user/welcome?step=2');
      return;
    }

    if (!session) {
      res.status(401).send({message: 'You must be signed in to perform this action.'});
      return;
    }

    const SCOPES = ['offline_access', 'User.Read', 'Calendars.Read', 'Calendars.ReadWrite'];
    const ACCESS_CODE = req.query.code;
    const REDIRECT_URI = `${process.env.FRONT_END_URL}/api/integrations/office365calendar/callback`;
    const PAYLOAD = `&client_id=${process.env.MS_GRAPH_CLIENT_ID}&scope=${SCOPES.join(
      ' '
    )}&code=${ACCESS_CODE}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code&client_secret=${
      process.env.MS_GRAPH_CLIENT_SECRET
    }`;

    const {data} = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      PAYLOAD
    );

    const {data: userInfoResponse} = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    const {data: calendarData} = await axios.get('https://graph.microsoft.com/v1.0/me/calendar', {
      headers: {
        Authorization: data.access_token,
        'Content-Type': 'application/json',
      },
    });

    const CRED_PAYLOAD = {
      token_type: data.token_type,
      scope: data.scope,
      expires_in: data.expires_in.toString(),
      ext_expires_in: data.ext_expires_in.toString(),
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };

    // Save Credentials to Database
    const response = await graphqlRequestHandler(
      addOffice365Calendar,
      {
        credentials: CRED_PAYLOAD,
        email: userInfoResponse.userPrincipalName,
        allowedProviders: calendarData.allowedOnlineMeetingProviders,
      },
      session.accessToken
    );
    const dupeStatus = response.data.data.addOffice365Calendar.status;
    if (dupeStatus === 409) {
      res.redirect(
        301,
        '/user/integrations?type=office&error=That Email account is already linked'
      );
      return;
    }

    if (!isWelcomeComplete) {
      res.redirect(301, '/user/welcome?step=2');
      return;
    }

    res.redirect(301, '/user/integrations');
  } catch (err) {
    res.redirect(500, '/user/integrations?type=office&error=Unknown Error Adding Calendar');
  }
};

export default handler;
