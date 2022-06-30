import axios from 'axios';
import {ASTNode, print} from 'graphql';

export default function graphqlRequestHandler(
  query: ASTNode,
  variables: any,
  accessToken: string | unknown
) {
  const token = accessToken as string;

  return axios.post(
    `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`,
    {
      query: print(query),
      variables: variables,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
}
