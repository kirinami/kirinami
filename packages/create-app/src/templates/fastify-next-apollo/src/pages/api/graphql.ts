import { NextApiRequest, NextApiResponse } from 'next';

import getApolloServer from '@/helpers/getApolloServer';

const apolloHandler = getApolloServer().then((apolloServer) => apolloServer.createHandler({
  path: '/api/graphql',
}));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return apolloHandler.then(handler => handler(req, res));
}
