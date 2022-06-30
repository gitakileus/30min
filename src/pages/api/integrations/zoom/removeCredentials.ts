/* eslint-disable @typescript-eslint/dot-notation */
import type {NextApiRequest, NextApiResponse} from 'next';
import graphqlRequestHandler from '../../../../utils/graphqlRequestHandler';
import {deleteZoomCredentialsWebhook} from '../../../../constants/GraphQL/Integrations/mutations';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {payload} = req.body;
  const verifiactionToken = req.headers.authorization;

  try {
    if (verifiactionToken !== process.env.ZOOM_VERIFICATION_TOKEN) {
      res.status(401).send({message: 'Unauthorized'});
      return;
    }

    // Delete Credentials From Database
    await graphqlRequestHandler(
      deleteZoomCredentialsWebhook,
      {
        credentialIdentifier: payload.user_id,
      },
      process.env.BACKEND_API_KEY
    );

    res.status(200).send({message: 'Zoom Account Removed Successfully.'});
  } catch (err) {
    res.status(500).send({message: 'Unknown Error Removing Zoom Account.'});
  }
};

export default handler;
