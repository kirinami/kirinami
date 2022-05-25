import { useContext } from 'react';

import { ThemeContext } from '@/contexts/theme-provider/ThemeProvider';

export default function useTheme() {
  return useContext(ThemeContext);
}
