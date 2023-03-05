import { useContext } from 'react';

import { AuthContext } from '@/providers/AuthProvider/AuthProvider';

export default function useAuth() {
  return useContext(AuthContext);
}
