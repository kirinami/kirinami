import { User } from '@/prisma/client';

type Context = {
  currentUser: User | null,
}

export default Context;
