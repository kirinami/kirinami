import { ReactNode, useCallback } from 'react';

import LoginModal from '@/components/Modal/LoginModal/LoginModal';
import RegisterModal from '@/components/Modal/RegisterModal/RegisterModal';
import useAuth from '@/hooks/useAuth';

import styles from './PageLayout.styles';

export type PageLayoutProps = {
  children: ReactNode,
};

export default function PageLayout({ children }: PageLayoutProps) {
  const { user, setIsOpenLoginModal, setIsOpenRegisterModal } = useAuth();

  const handleLoginClick = useCallback(() => setIsOpenLoginModal(true), []);

  const handleRegisterClick = useCallback(() => setIsOpenRegisterModal(true), []);

  return (
    <>
      <LoginModal />
      <RegisterModal />

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
    </>
  );
}
