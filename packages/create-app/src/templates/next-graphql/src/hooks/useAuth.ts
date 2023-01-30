import { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthProvider/AuthProvider';

export default function useAuth() {
  return useContext(AuthContext);
}
