import { useContext } from 'react';

import { ThemeContext } from '@/components/Provider/ThemeProvider/ThemeProvider';

export default function useTheme() {
  return useContext(ThemeContext);
}
