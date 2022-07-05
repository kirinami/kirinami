import jwt from 'jsonwebtoken';

import prisma from '@/prisma/client';

export default async function authenticateUser(ctx: any, role?: string) {
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new Error('Not authenticated');
  }

  const payload = jwt.verify(token, String(process.env.ACCESS_TOKEN_SECRET));
  const id = typeof payload === 'string' ? undefined : payload.id;

  if (!id) {
    throw new Error('Not authenticated');
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  if (role && !currentUser.roles.includes(role)) {
    throw new Error('Not authorized');
  }

  return currentUser;
}
