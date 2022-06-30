import {google} from 'googleapis';
import {getSession} from 'next-auth/react';
import type {NextApiRequest, NextApiResponse} from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = getSession({req});

    if (!session) {
      res.status(401).send({message: 'You must be signed in to perform this action.'});
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    const consentURL = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      prompt: 'consent',
    });

    res.status(200).send({message: 'Consent URL Generated', payload: consentURL});
  } catch (err) {
    res.status(500).send({message: 'Unknown Server Error'});
  }
};

export default handler;
