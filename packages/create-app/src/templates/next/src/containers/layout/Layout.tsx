import { ReactNode } from 'react';
import Link from 'next/link';

import LoginFormModal from '../modals/login-form-modal/LoginFormModal';

import styles from './Layout.styles';

export type LayoutProps = {
  title: string,
  page: string,
  children: ReactNode,
};

export default function Layout({ title, page, children }: LayoutProps) {
  return (
    <>
      <LoginFormModal />

      <div css={styles.container}>
        <main css={styles.content}>
          <div css={styles.container}>
            <h1 css={styles.title}>{title}</h1>
            <p css={styles.description}>Get started by editing <code css={styles.code}>{page}</code></p>
            <hr css={styles.delimiter} />
            <div css={styles.menu}>
              <Link href="/" passHref><a css={styles.link}>Home</a></Link>
              <Link href="/todos" passHref><a css={styles.link}>Todos</a></Link>
              <Link href="/404" passHref><a css={styles.link}>404</a></Link>
            </div>
            <hr css={styles.delimiter} />
            <div css={styles.children}>{children}</div>
          </div>
        </main>

        <footer css={styles.footer}>
          <a href="https://kirinami.com" target="_blank" rel="noopener noreferrer">
            Powered by <strong>KIRINAMI</strong>
          </a>
        </footer>
      </div>
    </>
  );
}
