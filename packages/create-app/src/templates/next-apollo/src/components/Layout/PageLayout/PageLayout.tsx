import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Auth from '@/components/Common/Auth/Auth';
import Menu from '@/components/Common/Menu/Menu';
import Language from '@/components/Common/Language/Language';
import LoginModal from '@/components/Modal/LoginModal/LoginModal';
import RegisterModal from '@/components/Modal/RegisterModal/RegisterModal';

import styles from './PageLayout.styles';

export type PageLayoutProps = {
  children: ReactNode,
};

export default function PageLayout({ children }: PageLayoutProps) {
  const { t } = useTranslation();

  return (
    <>
      <div css={styles.container}>
        <div css={styles.header}>
          <Menu />
          <Language />
          <Auth />
        </div>

        <main css={styles.content}>
          {children}
        </main>

        <footer css={styles.footer}>
          <a href="https://kirinami.com" target="_blank" rel="noopener noreferrer">
            <Trans t={t} i18nKey="footer.created_by" values={{ name: 'KIRINAMI ' }} components={[<strong />]} />
          </a>
        </footer>
      </div>

      <LoginModal />
      <RegisterModal />
    </>
  );
}
