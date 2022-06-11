import { NextApiRequest, NextApiResponse } from 'next';

import initApolloServer from '@/helpers/initApolloServer';

const apolloHandler = initApolloServer().then((apolloServer) => apolloServer.createHandler({
  path: '/api/graphql',
}));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return apolloHandler.then((handler) => handler(req, res));
}
