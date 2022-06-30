import {google} from 'googleapis';
import {getSession} from 'next-auth/react';
import type {NextApiRequest, NextApiResponse} from 'next';

import {addGoogleCalendar} from 'constants/GraphQL/Integrations/mutations';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import queries from 'constants/GraphQL/User/queries';
import axios from 'axios';

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

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    const authorizationCode = req.query.code.toString();
    const {tokens} = await oauth2Client.getToken(authorizationCode);
    const requiredScopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ];

    const providedScopes = tokens?.scope?.split(' ') || [];

    if (!requiredScopes.every(requiredScope => providedScopes.includes(requiredScope))) {
      if (!isWelcomeComplete) {
        res.redirect(301, '/user/welcome?step=2&error=Insufficient Permissions Provided');
        return;
      }

      res.redirect(301, '/user/integrations?type=google&error=Insufficient Permissions Provided');
      return;
    }

    const {data: userInfoResponse} = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        params: {
          oauth_token: tokens?.access_token,
        },
      }
    );

    // We can use this in other API calls using these credentials to allow googleapis package
    // to automatically handle refreshing access tokens:
    // oauth2Client.setCredentials({
    //   refresh_token: tokens.refresh_token,
    // });

    const payload = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date?.toString(),
    };

    // Save Credentials to Database
    const response = await graphqlRequestHandler(
      addGoogleCalendar,
      {credentials: payload, email: userInfoResponse.email},
      session.accessToken
    );
    const dupeStatus = response.data.data.addGoogleCalendar.status;
    if (dupeStatus === 409) {
      res.redirect(
        301,
        '/user/integrations?type=google&error=That Email account is already linked'
      );
      return;
    }

    if (!isWelcomeComplete) {
      res.redirect(301, '/user/welcome?step=2');
      return;
    }

    res.redirect(301, '/user/integrations');
  } catch (err) {
    res.redirect(500, '/user/integrations?type=google&error=Unknown Error Adding Calendar');
  }
};

export default handler;
