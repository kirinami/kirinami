import { useContext } from 'react';

import { ThemeContext } from '@/containers/theme/Theme';

export default function useTheme() {
  return useContext(ThemeContext);
}
