import Guard from '../types/Guard';

export default function isAuthenticated(role?: string): Guard {
  return async (root, args, ctx) => {
    if (!ctx.currentUser) {
      throw new Error('You are not authenticated!');
    }

    if (role && !ctx.currentUser.roles.includes(role)) {
      throw new Error('You are not authorized!');
    }
  };
};
