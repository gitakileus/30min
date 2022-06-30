/* eslint-disable @typescript-eslint/dot-notation */
import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import graphqlRequestHandler from '../../../../../utils/graphqlRequestHandler';
import {addZoomCredentials} from '../../../../../constants/GraphQL/Integrations/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {code, token, email} = req.body;

  try {
    if (!code) {
      res.status(400).send({message: 'No Code Present.'});
      return;
    }

    const {data: zoomTokenResponse} = await axios('https://zoom.us/oauth/token', {
      method: 'POST',
      params: {
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://30mins.com/user/extensions/zoom',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_DEV_ZOOM_CLIENT_ID}:${process.env.DEV_ZOOM_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const {data: zoomUserResponse} = await axios('https://zoom.us/v2/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${zoomTokenResponse.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    // Save Credentials to Database
    const response = await graphqlRequestHandler(
      addZoomCredentials,
      {
        credentials: zoomTokenResponse,
        email: email,
        allowedProviders: ['zoom'],
        credentialIdentifier: zoomUserResponse.id,
      },
      token
    );
    const dupeStatus = response.data.data.addZoomCredentials.status;
    if (dupeStatus === 409) {
      res.status(409).send({message: 'You may only link one Zoom Account.'});
      return;
    }

    res.status(200).send({message: 'Zoom Account Linked Successfully.'});
  } catch (err) {
    res.status(500).send({message: 'Unknown Error Linking Zoom Account.'});
  }
};

export default handler;
