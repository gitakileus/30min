import {gql} from '@apollo/client';

export const singleUpload = gql`
  mutation Mutation(
    $file: Upload!
    $accessToken: String!
    $uploadType: AllowedUploads
    $documentId: String
  ) {
    singleUpload(
      file: $file
      accessToken: $accessToken
      uploadType: $uploadType
      documentId: $documentId
    ) {
      message
      status
    }
  }
`;

const mutations = {singleUpload};

export default mutations;
