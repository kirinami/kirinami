import { ReactNode } from 'react';

import styles from './Layout.styles';

export type LayoutProps = {
  children: ReactNode,
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div css={styles.container}>
      <main css={styles.content}>
        {children}
      </main>

      <footer css={styles.footer}>
        <a href="https://kirinami.com" target="_blank" rel="noopener noreferrer">
          Powered by <strong>KIRINAMI</strong>
        </a>
      </footer>
    </div>
  );
}
