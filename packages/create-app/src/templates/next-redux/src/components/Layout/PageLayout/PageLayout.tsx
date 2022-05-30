import { ReactNode } from 'react';

import Auth from '@/components/Common/Auth/Auth';
import Menu from '@/components/Common/Menu/Menu';
import LoginModal from '@/components/Modal/LoginModal/LoginModal';
import RegisterModal from '@/components/Modal/RegisterModal/RegisterModal';

import styles from './PageLayout.styles';

export type PageLayoutProps = {
  children: ReactNode,
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <div css={styles.container}>
        <div css={styles.header}>
          <Menu />
          <Auth />
        </div>

        <main css={styles.content}>
          {children}
        </main>

        <footer css={styles.footer}>
          <a href="https://kirinami.com" target="_blank" rel="noopener noreferrer">
            Powered by <strong>KIRINAMI</strong>
          </a>
        </footer>
      </div>

      <LoginModal />
      <RegisterModal />
    </>
  );
}
