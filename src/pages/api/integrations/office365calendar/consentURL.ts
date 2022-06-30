//
import {getSession} from 'next-auth/react';
import type {NextApiRequest, NextApiResponse} from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({req: req});
    if (!session) {
      res.status(401).send({message: 'You must be signed in to perform this action.'});
      return;
    }

    const BASE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?';
    const REDIRECT_URI = `${process.env.FRONT_END_URL}/api/integrations/office365calendar/callback`;
    const SCOPES = ['offline_access', 'User.Read', 'Calendars.Read', 'Calendars.ReadWrite'];

    const CONSTRUCTED_AUTH_URL = `${BASE_URL}client_id=${
      process.env.MS_GRAPH_CLIENT_ID
    }&response_type=code&redirect_uri=${REDIRECT_URI}&response_mode=query&scope=${SCOPES.join(
      ' '
    )}`;

    res.status(200).send({message: 'Consent URL Generated', payload: CONSTRUCTED_AUTH_URL});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error', error: 'Unknown Server Error'});
  }
};

export default handler;
