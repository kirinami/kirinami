import { createContext, ReactNode, useCallback, useState } from 'react';
import { Global, ThemeProvider } from '@emotion/react';

import light from './themes/light';
import dark from './themes/dark';
import { styles } from './Theme.styles';

const themes = {
  light,
  dark,
};

type ContextValue = {
  theme: keyof typeof themes,
  setTheme: (theme: keyof typeof themes) => void,
  toggleTheme: () => void,
};

export const ThemeContext = createContext({} as ContextValue);

export default function Theme({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ContextValue['theme']>('light');

  const toggleTheme = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme]);

  return (
    <ThemeProvider theme={themes[theme]}>
      <Global styles={styles.global} />
      <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

//

declare module '@emotion/react' {
  type BaseTheme = typeof light & typeof dark;

  export interface Theme extends BaseTheme {
  }
}
