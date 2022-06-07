import { createContext, ReactNode, useCallback, useState } from 'react';
import { Global, ThemeProvider as BaseThemeProvider } from '@emotion/react';

import light from './themes/light';
import dark from './themes/dark';
import styles from './ThemeProvider.styles';

const themes = {
  light,
  dark,
};

export type ThemeVariants = keyof typeof themes;

export type ThemeContextValue = {
  theme: ThemeVariants,
  changeTheme: (theme: ThemeVariants) => void,
  toggleTheme: () => void,
};

export const ThemeContext = createContext({} as ThemeContextValue);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeVariants>('light');

  const changeTheme = useCallback((theme: ThemeVariants) => setTheme(theme), []);

  const toggleTheme = useCallback(() => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')), []);

  return (
    <BaseThemeProvider theme={themes[theme]}>
      <Global styles={styles.root} />
      <ThemeContext.Provider value={{ theme, changeTheme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </BaseThemeProvider>
  );
}

declare module '@emotion/react' {
  type BaseTheme = typeof light;

  export interface Theme extends BaseTheme {
  }
}
