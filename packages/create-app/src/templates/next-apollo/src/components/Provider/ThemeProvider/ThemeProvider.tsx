import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
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
  theme: ThemeVariants;
  changeTheme: (theme: ThemeVariants) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext({} as ThemeContextValue);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeVariants>('light');

  const changeTheme = useCallback((theme: ThemeVariants) => setTheme(theme), []);

  const toggleTheme = useCallback(() => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')), []);

  const value = useMemo(() => ({ theme, changeTheme, toggleTheme }), [theme, changeTheme, toggleTheme]);

  return (
    <BaseThemeProvider theme={themes[theme]}>
      <Global styles={styles.root} />
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </BaseThemeProvider>
  );
}

declare module '@emotion/react' {
  type BaseTheme = typeof light;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  export type Theme = BaseTheme;
}
