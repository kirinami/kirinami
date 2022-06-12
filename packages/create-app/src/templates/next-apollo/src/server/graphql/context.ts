import jwt from 'jsonwebtoken';
import mapKeys from 'lodash/mapKeys';

import prisma, { User } from '@/server/prisma/client';

export type Context = {
  currentUser: User | null,
};

export default async function context(req: { headers: Record<string, unknown> }): Promise<Context> {
  const headers = mapKeys(req.headers, (_, key) => key.toLowerCase());

  let id: number | undefined;

  try {
    const [, token] = typeof headers.authorization === 'string' ? headers.authorization.split(' ') : [];

    const payload = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));

    id = typeof payload === 'string' ? undefined : payload.id;
  } catch (err) {
    //
  }

  let currentUser: User | null = null;

  if (id) {
    currentUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  return {
    currentUser,
  };
}
