import {ApolloClient, InMemoryCache} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache(),
  link: createUploadLink({uri: process.env.NEXT_PUBLIC_GRAPHQL_URL}),
});

export default client;
