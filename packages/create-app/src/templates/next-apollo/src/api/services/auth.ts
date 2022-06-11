import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import prisma, { User } from '@/prisma/client';

import { Auth, LoginArgs, RefreshArgs, RegisterArgs } from '../graphql/schemas/auth/types';

import { createUser } from './users';

async function getSignTokens(user: User): Promise<Auth> {
  const payload = {
    id: user.id,
  };

  const accessToken = jwt.sign(payload, String(process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, String(process.env.REFRESH_TOKEN_SECRET), {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      accessToken: bcrypt.hashSync(accessToken, 10),
      refreshToken: bcrypt.hashSync(refreshToken, 10),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function login(input: LoginArgs['input']) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) throw new Error('User Not Found');

  const match = await bcrypt.compare(input.password, user.password);

  if (!match) throw new Error('Unauthorized');

  return getSignTokens(user);
}

export async function register(input: RegisterArgs['input']) {
  const user = await createUser(input);

  return getSignTokens(user);
}

export async function refresh(token: RefreshArgs['token']) {
  const payload = jwt.verify(token, String(process.env.REFRESH_TOKEN_SECRET));
  const id = typeof payload === 'string' ? undefined : payload.id;

  if (!id) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user || !user.refreshToken) throw new Error('Unauthorized');

  const match = await bcrypt.compare(token, user.refreshToken);

  if (!match) throw new Error('Unauthorized');

  return getSignTokens(user);
}
