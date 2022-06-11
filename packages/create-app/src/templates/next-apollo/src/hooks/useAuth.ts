import { useContext } from 'react';

import { AuthContext } from '@/components/Provider/AuthProvider/AuthProvider';

export default function useAuth() {
  return useContext(AuthContext);
}
