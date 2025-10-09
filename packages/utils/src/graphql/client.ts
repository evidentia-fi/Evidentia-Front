import { cacheExchange, fetchExchange } from '@urql/core';
import { createClient } from 'urql';

import { env } from '../config';

export const graphqlClient = createClient({
  url: 'https://gateway.thegraph.com/api/subgraphs/id/DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G',
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${env.GRAPHQL_KEY}`,
    },
  },
  exchanges: [cacheExchange, fetchExchange],
});
