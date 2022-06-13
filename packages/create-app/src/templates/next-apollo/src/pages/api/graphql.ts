import { NextApiRequest, NextApiResponse } from 'next';

import initApolloMiddleware from '@/helpers/initApolloMiddleware';

const middleware = initApolloMiddleware({
  path: '/api/graphql',
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const run = await middleware;
  await run(req, res);
}
