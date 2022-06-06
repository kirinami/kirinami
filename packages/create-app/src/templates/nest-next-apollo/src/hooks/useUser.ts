import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { RETRIEVE_USER, RetrieveUserData, RetrieveUserVars } from '@/graphql/queries/users/retrieveUser';

export default function useUser() {
  const { data } = useQuery<RetrieveUserData, RetrieveUserVars>(RETRIEVE_USER);

  return useMemo(() => data?.retrieveUser || null, [data?.retrieveUser]);
}
