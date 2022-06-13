import { User } from '@prisma/client';

import { Context } from '../context';

export type AuthenticatedContext = Context & {
  currentUser: User,
};

export default function isAuthenticated(role?: string) {
  return async (source: unknown, args: unknown, { currentUser }: Context) => {
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    if (role && !currentUser.roles.includes(role)) {
      throw new Error('Not authorized');
    }
  };
}
