import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';

import prisma, { User } from '@/prisma/client';

export type Context = {
  currentUser: User | null,
};

export default async function context({ req }: { req: IncomingMessage }): Promise<Context> {
  let id: number | undefined;

  try {
    const [, token] = req.headers.authorization?.split(' ') || [];

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
