import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import prisma, { User } from '@/prisma/client';

import resolver from '../../utils/resolver';

import { LoginArgs, RefreshArgs, RegisterArgs } from './types';

const computeTokens = async (user: User) => {
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
};

const resolvers = {
  Mutation: {
    login: resolver(async (_, { input }: LoginArgs) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) throw new Error('Unauthorized');

      const match = await bcrypt.compare(input.password, user.password);

      if (!match) throw new Error('Unauthorized');

      return computeTokens(user);
    }),
    register: resolver(async (_, { input }: RegisterArgs) => {
      const user = await prisma.user.create({
        data: { ...input, roles: ['User'] },
      });

      return computeTokens(user);
    }),
    refresh: resolver(async (_, { token }: RefreshArgs) => {
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

      return computeTokens(user);
    }),
  },
};

export default resolvers;
