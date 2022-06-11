import { Guard } from '../utils/resolver';

export default function isAuthenticated(role?: string): Guard {
  return async (root, args, ctx) => {
    if (!ctx.currentUser) {
      throw new Error('Not authenticated');
    }

    if (role && !ctx.currentUser.roles.includes(role)) {
      throw new Error('Not authorized');
    }
  };
};
